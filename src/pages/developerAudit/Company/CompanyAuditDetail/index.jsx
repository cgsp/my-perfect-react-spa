import React, { Component } from 'react'
import './style.scss'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import {sessionCache} from '../../../../utils/cache'
import {
    Breadcrumb,
    Form,
} from 'antd'
const { Item } = Form
const shortItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 8
    }
}

const status = {
    1: '未审核',
    3: '已通过',
    4: '未通过'
}

@inject('developerAudit')
@observer
@Form.create({})
export default class CompanyAuditDetail extends Component {
    constructor(props){
        super(props)
        this.auditArr = []
        this.basicAppInfo=sessionCache.get('comAuditOperation') || {}
    }

    render() {
        const {basicAppInfo} = this
        const applyContent = [
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
        const applyResult = [
            {label: '审批结果', value: status[this.basicAppInfo.auditState]},
            {label: '审批人', value: basicAppInfo.auditor},
            {label: '审批时间', value: basicAppInfo.auditTime},
        ]

        if(basicAppInfo.auditState === 4){
            applyResult.push( {label: '审批驳回意见', value: basicAppInfo.auditFailReason})
        }
        return (
            <div className="company-check-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/developerAudit/Company" style={{color: 'cornflowerblue'}}>企业开发者列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>企业开发者详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="company-basic-info colum1">
                    <div className="title1">审批状态:   <span className="title1-value">{status[this.basicAppInfo.auditState]}</span></div>
                </div>
                <div className="company-title">企业开发者详情</div>
                <div className="company-basic-info">
                    <div className="title1">申请内容</div>
                    <Form className="company-form">
                        {applyContent && applyContent.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                    </Form>
                </div>
                <div className="company-basic-info colum3">
                    <div className="title1">审批结果</div>
                    <Form className="company-form">
                        {applyResult && applyResult.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                    </Form>
                </div>
            </div>
        )
    }
}
