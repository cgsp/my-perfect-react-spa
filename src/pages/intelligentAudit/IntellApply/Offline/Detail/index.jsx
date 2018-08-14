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
        this.basicAppInfo = sessionCache.get('highLinesMobileData') || {}
    }

    render() {
        const {basicAppInfo} = this
        const basic  = [
            {label: '产品名称', value: basicAppInfo.appKey},
            {label: '所属开发者', value: basicAppInfo.developerName},
            {label: '设备类型', value: '不知道'},
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
        const applyResult = [
            {label: '审批结果', value: status[this.basicAppInfo.auditState]},
            {label: '审批人', value: basicAppInfo.auditor},
            {label: '审批时间', value: basicAppInfo.auditTime},
        ]

        if(basicAppInfo.auditState === 4){
            applyResult.push( {label: '审批驳回意见', value: basicAppInfo.auditFailReason})
        }
        return (
            <div className="apply-check-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/intelligentAudit/IntellApply" style={{color: 'cornflowerblue'}}>智能硬件应用列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>应用上线审批详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="apply-basic-info colum1">
                    <div className="title1">审批状态:   <span className="title1-value">{status[this.basicAppInfo.auditState]}</span></div>
                </div>
                <div className="apply-title">智能硬件应用上线审批详情</div>
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
                <div className="apply-basic-info colum3">
                    <div className="title1">审批结果</div>
                    <Form className="apply-form">
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
