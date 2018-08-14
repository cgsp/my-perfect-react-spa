import React, { Component } from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import {sessionCache} from '../../../../utils/cache'
import {
    Breadcrumb,
    Form,
} from 'antd'
const {Item} = Form
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


@Form.create({})
export default class PersonalAuditDetail extends Component {
    constructor(props){
        super(props)
        this.basicAppInfo = sessionCache.get('perAuditOperation') || {}
    }

    render() {
        const {basicAppInfo} = this
        const applyContent = [
            {label: '姓名', value: basicAppInfo.developerName},
            {label: '身份证号', value: basicAppInfo.idCardNo},
            {label: '身份证照', value: <img src={basicAppInfo.idCardPhoto} width="68" height="68"/>},
            {label: '手机号码', value: basicAppInfo.companyAddress},
            {label: '邮箱', value: basicAppInfo.developerEmail},
            {label: '联系地址', value: basicAppInfo.developerPhone},
            {label: '开发者简介', value: basicAppInfo.developerIntro},
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
            <div className="personal-check-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/developerAudit/Personal" style={{color: 'cornflowerblue'}}>个人开发者列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>个人开发者详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="company-basic-info colum1">
                    <div className="title1">审批状态:   <span className="title1-value">{status[this.basicAppInfo.auditState]}</span></div>
                </div>
                <div className="company-title">个人开发者详情</div>
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
