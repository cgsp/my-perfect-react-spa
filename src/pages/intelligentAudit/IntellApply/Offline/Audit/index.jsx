import React, { Component } from 'react'
import './style.scss'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import {sessionCache} from '../../../../../utils/cache'
import api, {http} from './../../../../../service'
import {
    Breadcrumb,
    Form,
    message,
    Button,
    Radio,
    Modal,
    Input
} from 'antd'
const { TextArea } = Input
const RadioGroup = Radio.Group
const { Item } = Form
const shortItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 8
    }
}

@inject('applyAudit')
@observer
@Form.create({})
export default class IntellAudit extends Component {
    constructor(props){
        super(props)
        this.state={
            isViewModel: false,
            textAreaStatus: true,
            value: ''
        }
        this.basicAppInfo = sessionCache.get('OfflineData') || {}
    }

    handleSubmit = e => {
        const {basicAppInfo} = this
        const {auditState,id } = basicAppInfo
        e.preventDefault()
        if(auditState && id){
            this.saveHighMobileData(id, {auditState})
        }
    }

    handleModalSubmit = e => {
        const {basicAppInfo} = this
        const {auditState,id } = basicAppInfo
        e.preventDefault()
        if(auditState && this.state.value && id){
            this.saveHighMobileData(id, {auditState, auditFailReason:  this.state.value})
        }else{
            message.error('请输入审批驳回意见')
        }
    }



    saveHighMobileData = (key, params) =>{
        http.put(`${api.AUDITAPPS}/${key}`, params).then((res)=>{
            const data= res.data || {}
            const {code, message}=data
            if (code===0) {
                message.success('审批成功')
                this.props.history.push('/mobileAudit/ApplyAudit')
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    handleCancel = () => {
        this.setState({
            isViewModel: false,
        })
    }

    onChange = (checkedValues) => {
        if (checkedValues.target.value === '其他') {
            this.setState({
                textAreaStatus: false,
                value: checkedValues.target.value,
            })
        } else {
            this.setState({
                value: checkedValues.target.value,
                textAreaStatus: true,
            })
        }
    }


    render() {
        const {handleSubmit, handleCancel, onChange, handleModalSubmit, basicAppInfo} = this
        const basic  = [
            {label: '产品名称', value: basicAppInfo.appKey},
            {label: '所属开发者', value: basicAppInfo.developerName},
            {label: '设备类型', value: basicAppInfo.appType},
            {label: '产品简介', value: basicAppInfo.appDesc},
            {label: '产品图标', value: <img src={basicAppInfo.appIcon} width="68" height="68"/>},
            {label: '固件系统', value: '不知道'},
        ]
        const rules  = [
            {label: '首批订单量', value: basicAppInfo.androidPackageUrl},
            {label: '预计上线时间', value: basicAppInfo.iosPackageUrl},
            {label: '预估年产量', value: ''},
            {label: '应用截图', value: <img src={basicAppInfo.screenshotUrls} width="68" height="68"/>},
        ]
        const {isViewModel, textAreaStatus, value} = this.state
        return (
            <div className="apply-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/intelligentAudit/IntellApply" style={{color: 'cornflowerblue'}}>智能硬件应用列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>智能硬件应用上线审批</Breadcrumb.Item>
                </Breadcrumb>
                <div className="apply-title">智能硬件应用上线审批</div>
                <div className="apply-basic-info">
                    <div className="title1">申请内容</div>
                    <Form className="apply-form">
                        <div className="second-title"><span className="apply-form-mark"></span><span>申请时间</span></div>
                        <Item {...shortItemLayout} label="申请时间" style={{marginBottom: 0}}>
                            申请时间1
                        </Item>
                        <div className="second-title"><span className="apply-form-mark"></span><span>基本信息</span></div>
                        {basic && basic.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                        <div className="second-title"><span className="apply-form-mark"></span><span>合作信息</span></div>
                        {rules && rules.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                    </Form>
                </div>

                <div className="apply-button">
                    <Button size="small" type="primary" onClick={handleSubmit}>
                        通过
                    </Button>
                    <Button
                        size="small"
                        style={{marginLeft: 20}}
                        onClick={() => {
                            this.setState({
                                isViewModel: true,
                            })
                        }}
                    >
                        驳回
                    </Button>
                </div>
                <Modal
                    className="help-top-remove-confirm"
                    title={'审批驳回意见'}
                    visible={isViewModel}
                    okType="danger"
                    onOk={handleModalSubmit}
                    onCancel={handleCancel}
                >
                    <RadioGroup style={{marginBottom: 30}}  onChange={onChange} value={value}>
                        <Radio value={'应用图标侵权'}>应用图标侵权</Radio>
                        <Radio value={'未上传真实的图标'}>未上传真实的图标</Radio>
                        <Radio value={'未进行喜马拉品牌露出'}>未进行喜马拉品牌露出</Radio>
                        <Radio value={'其他'} className='radio-other'>其他</Radio>
                    </RadioGroup>
                    <TextArea minrows={5} disabled={textAreaStatus}/>
                </Modal>
            </div>
        )
    }
}
