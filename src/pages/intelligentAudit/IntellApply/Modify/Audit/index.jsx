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
    Input,
    Table
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

const columns = [
    {
        width: 200,
        dataIndex: 'title1',
        title: '修改部分'
    },
    {
        width: 200,
        dataIndex: 'title2',
        title: '修改字段'
    },
    {
        width: 200,
        dataIndex: 'title3',
        title: '原有信息'
    },
    {
        width: 200,
        dataIndex: 'title4',
        title: '修改后信息'
    },
]
const data = [
    {
        key: 1,
        title1:'基本信息',
        title2:'应用名称',
        title3:'什么值得买',
        title4:'什么都想要',
    },
]

@inject('applyAudit')
@observer
@Form.create({})
export default class modifyIntellApply extends Component {
    constructor(props){
        super(props)
        this.state={
            isViewModel: false,
            textAreaStatus: true,
            value: '',
        }
        this.basicAppInfo = sessionCache.get('modifyMobileData') || {}
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
        const othersText = document.getElementById('MIA').value
        const {basicAppInfo} = this
        const {auditState,id } = basicAppInfo
        e.preventDefault()
        if(auditState && othersText && id){
            this.saveHighMobileData(id, {auditState, auditFailReason:  othersText})
        }else if(auditState && this.state.value && this.state.value !='其他' && id){
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
    onChangeUserName = (value)=>{
        console.log('checkedValues values',value.target.value)
        const cc=value.target.value
        console.log('checkedValues valuescccccc',cc)
    }


    render() {
        const {handleSubmit, handleCancel, onChange, handleModalSubmit, basicAppInfo} = this
        const basic  = [
            {label: '产品名称', value: basicAppInfo.appKey},
            {label: '所属开发者', value: basicAppInfo.developerName},
            {label: '设备类型', value: '不知道'},
            {label: '产品简介', value: basicAppInfo.appDesc},
            {label: '产品图标', value: <img src={basicAppInfo.appIcon} width="68" height="68"/>},
            {label: '固定图标', value: '不知道'},
        ]
        const rules  = [
            {label: '首批订单量', value: basicAppInfo.androidPackageUrl},
            {label: '预计上线时间', value: basicAppInfo.iosPackageUrl},
            {label: '预估年产量', value: ''},
            {label: '应用截图', value: <img src={basicAppInfo.screenshotUrls} width="68" height="68"/>},
        ]
        const {isViewModel, textAreaStatus, value} = this.state
        return (
            <div className="modifyIntellApply-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/intelligentAudit/IntellApply" style={{color: 'cornflowerblue'}}>智能硬件应用列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>信息修改审批</Breadcrumb.Item>
                </Breadcrumb>
                <div className="modifyIntellApply-title">应用信息修改审批</div>

                <div className="modifyIntellApply-basic-info">
                    <div className="title1">申请内容</div>
                    <Form className="modifyIntellApply-form">
                        <Item {...shortItemLayout} label="申请时间" style={{marginBottom: 0}}>
                            {basicAppInfo.applyTime}
                        </Item>
                        <Item {...shortItemLayout} label="应用" style={{marginBottom: 0}}>
                            还没来及写
                        </Item>
                        <div className='modifyIntellApply-table'>
                            <Table columns={columns}
                                   dataSource={data}
                                   bordered = {true}
                                   pagination = {false}
                            />
                        </div>
                    </Form>
                </div>

                <div className="modifyIntellApply-button">
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
                <div className="modifyIntellApply-basic-info">
                    <div className="title1">应用当前信息</div>
                    <Form className="modifyIntellApply-form">
                        <div className="second-title"><span className="modifyIntellApply-form-mark"></span><span>基本信息</span></div>
                        {basic && basic.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                        <div className="second-title"><span className="modifyIntellApply-form-mark"></span><span>合作规范</span></div>
                        {rules && rules.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                    </Form>
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
                        <Radio value={'未进行喜马拉品牌露出'}>未进行喜马拉品牌露出</Radio>
                        <Radio value={'其他'} className='radio-other'>其他</Radio>
                    </RadioGroup>
                    <TextArea minrows={5}
                              disabled={textAreaStatus}
                              id="MIA"
                    />
                </Modal>
            </div>
        )
    }
}
