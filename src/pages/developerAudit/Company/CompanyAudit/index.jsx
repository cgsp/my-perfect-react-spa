import React, { Component } from 'react'
import './style.scss'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import {sessionCache} from '../../../../utils/cache'
import api, {http} from './../../../../service'
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

@inject('developerAudit')
@observer
@Form.create({})
export default class CompanyAuditDetail extends Component {
    constructor(props){
        super(props)
        this.auditArr = []
        this.state={
            isViewModel: false,
            textAreaStatus: true,
            value: ''
        }
    }

    handleSubmit = e => {
        const basicAppInfo = sessionCache.get('comAuditOperation') || {}
        const {auditState,id } = basicAppInfo
        e.preventDefault()
        if(auditState && id){
            this.saveCompanyData(id, {auditState})
        }
    }

    handleModalSubmit = e => {
        const basicAppInfo = sessionCache.get('comAuditOperation') || {}
        const {auditState,id } = basicAppInfo
        e.preventDefault()
        if(auditState && this.state.value && id){
            this.saveCompanyData(id, {auditState, auditFailReason:  this.state.value})
        }else{
            message.error('请输入审批驳回意见')
        }
    }



    saveCompanyData = (key, params) =>{
      http.put(`${api.ENTERDEVELOPERS}/${key}`, params).then((res)=>{
          const data= res.data || {}
          const {code, message}=data
          if (code===0) {
              message.success('审批成功')
              this.props.history.push('/developerAudit/Company')
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

    componentWillMount(){
        const basicAppInfo = sessionCache.get('comAuditOperation') || {}
        this.auditArr = [
            {label: '申请时间', value: basicAppInfo.applyTime},
            {label: '公司名称', value: basicAppInfo.companyName},
            {label: '公司主页网址', value: basicAppInfo.companySite},
            {label: '公司介绍', value: basicAppInfo.companyDesc},
            {label: '公司地址', value: basicAppInfo.companyAddress},
            {label: '企业工商营业执照', value: <img src={basicAppInfo.companyBusinessLicense} width="68" height="68"/>},
            {label: '公司联系人姓名', value: basicAppInfo.developerName},
            {label: '联系人手机号', value: basicAppInfo.developerPhone},
            {label: '联系人邮箱', value: basicAppInfo.developerEmail},
        ]
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
        const {handleSubmit, handleCancel, onChange, handleModalSubmit} = this
        const {isViewModel, textAreaStatus, value} = this.state
        return (
            <div className="company-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/developerAudit/Company" style={{color: 'cornflowerblue'}}>企业开发者列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>企业开发者审批</Breadcrumb.Item>
                </Breadcrumb>
                <div className="company-title">企业开发者审批</div>
                <div className="company-basic-info">
                    <div className="title1">申请内容</div>
                    <Form className="company-form">
                        {this.auditArr && this.auditArr.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                    </Form>
                </div>

                <div className="company-button">
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
                        <Radio value={'营业执照和公司名称不符'}>营业执照和公司名称不符</Radio>
                        <Radio value={'未上传真实的营业执照'}>未上传真实的营业执照</Radio>
                        <Radio value={'其他'} className='radio-other'>其他</Radio>
                    </RadioGroup>
                    <TextArea minrows={5} disabled={textAreaStatus}/>
                </Modal>
            </div>
        )
    }
}
