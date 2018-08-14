import React, { Component } from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import {sessionCache} from '../../../../../utils/cache'
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
export default class MobileDetail extends Component {
    constructor(props){
        super(props)
        this.basicAppInfo = sessionCache.get('highLinesWebsiteData') || {}
    }

    render() {
        const {basicAppInfo} = this
        const basic  = [
            {label: '应用名称', value: basicAppInfo.appKey},
            {label: '应用类型', value: basicAppInfo.appType},
            {label: '开发者名称', value: basicAppInfo.developerName},
            {label: '开发者类型', value: '不知道'},
            {label: '应用简介', value: basicAppInfo.appDesc},
            {label: '应用图标', value: <img src={basicAppInfo.appIcon} width="68" height="68"/>},
            {label: '网站地址', value: '还没来及写'},
        ]
        const rules  = [
            {label: '应用截图', value: <img src={basicAppInfo.screenshotUrls} width="68" height="68"/>},
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
            <div className="WebApply-check-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/mobileAudit/ApplyAudit" style={{color: 'cornflowerblue'}}>移动&网站应用列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>网站应用审批上线详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="WebApply-basic-info colum1">
                    <div className="title1">审批状态:   <span className="title1-value">{status[this.basicAppInfo.auditState]}</span></div>
                </div>
                <div className="WebApply-title">网站应用审批上线详情</div>
                <div className="WebApply-basic-info">
                    <div className="title1">申请内容</div>
                    <Form className="WebApply-form">
                        <div className="second-title"><span className="WebApply-form-mark"></span><span>申请时间</span></div>
                        <Item {...shortItemLayout} label="申请时间" style={{marginBottom: 0}}>
                            申请时间1
                        </Item>
                        <div className="second-title"><span className="WebApply-form-mark"></span><span>基本信息</span></div>
                        {basic && basic.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                        <div className="second-title"><span className="WebApply-form-mark"></span><span>合作规范</span></div>
                        {rules && rules.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index} style={{marginBottom: 0}}>
                                    {item.value}
                                </Item>
                            )
                        })}
                    </Form>
                </div>
                <div className="WebApply-basic-info colum3">
                    <div className="title1">审批结果</div>
                    <Form className="WebApply-form">
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
