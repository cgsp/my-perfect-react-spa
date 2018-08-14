import React, { Component } from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import {sessionCache} from '../../../../../utils/cache'
import {
    Breadcrumb,
    Form,
    Table
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


@Form.create({})
export default class MobileDetail extends Component {
    constructor(props){
        super(props)
        this.basicAppInfo = sessionCache.get('modifyMobileData') || {}
    }

    render() {
        const {basicAppInfo} = this
        const applyResult = [
            {label: '审批结果', value: status[this.basicAppInfo.auditState]},
            {label: '审批人', value: basicAppInfo.auditor},
            {label: '审批时间', value: basicAppInfo.auditTime},
        ]

        if(basicAppInfo.auditState === 4){
            applyResult.push( {label: '审批驳回意见', value: basicAppInfo.auditFailReason})
        }
        return (
            <div className="modifyMobileApply-check-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/mobileAudit/ApplyAudit" style={{color: 'cornflowerblue'}}>移动&网站应用列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>应用信息修改审批详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="modifyMobileApply-basic-info colum1">
                    <div className="title1">审批状态:   <span className="title1-value">{status[this.basicAppInfo.auditState]}</span></div>
                </div>
                <div className="modifyMobileApply-title">应用信息修改审批详情</div>
                <div className="modifyMobileApply-basic-info">
                    <div className="title1">申请内容</div>
                    <Form className="modifyMobileApply-form">
                        <Item {...shortItemLayout} label="申请时间" style={{marginBottom: 0}}>
                            {basicAppInfo.applyTime}
                        </Item>
                        <Item {...shortItemLayout} label="应用" style={{marginBottom: 0}}>
                            还没来及写111
                        </Item>
                        <div className='modifyMobileApply-table'>
                            <Table columns={columns}
                                   dataSource={data}
                                   bordered = {true}
                                   pagination = {false}
                            />
                        </div>
                    </Form>
                </div>
                <div className="modifyMobileApply-basic-info colum3">
                    <div className="title1">审批结果</div>
                    <Form className="modifyMobileApply-form">
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
