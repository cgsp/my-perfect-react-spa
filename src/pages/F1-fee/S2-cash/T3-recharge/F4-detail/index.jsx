import React, { Component } from 'react'
import './style.scss'
// import { Link } from 'react-router-dom'
import { sessionCache } from '@Utils/cache'
import BreadcrumbNav from '@Components/bread-crumb'
import {
  Form,
  Table
} from 'antd'
import { appType, developerType, applyStatus } from '@Constants'
import EnlargeImg from '@Components/EnlargeImg'
const { Item } = Form
const shortItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
}

const columns = [{
  title: '审批时间',
  dataIndex: 'time',
}, {
  title: '审批节点',
  dataIndex: 'money',
}, {
  title: '审批人',
  dataIndex: 'address',
}, {
  title: '审批结果',
  dataIndex: 'result',
}, {
  title: '备注',
  dataIndex: 'text',
},]

const data = [{
  key: '1',
  time: 'nn',
  name: 'John Brown',
  money: '￥300,000.00',
  address: 'New York No. 1 Lake Park',
  result: "cc",
  text: 'bb'
}, {
  key: '2',
  time: 'nn',
  name: 'John Brown',
  money: '￥300,000.00',
  address: 'New York No. 1 Lake Park',
  result: "cc",
  text: 'bb'
},];


@Form.create({})
export default class RechargeDetail extends Component {
  constructor(props) {
    super(props)
    this.basicAppInfo = sessionCache.get('highLinesWebsiteData') || {}
  }

  render() {
    const { basicAppInfo } = this
    const basic = [
      { label: '交易流水号', value: basicAppInfo.appName },
      { label: '开发者名称', value: basicAppInfo.appName },
      { label: '开发者ID', value: appType[basicAppInfo.appType] },
      { label: '充值金额', value: basicAppInfo.developerName },
      { label: '充值类型', value: developerType[basicAppInfo.developerType] },
      { label: '银行卡信息', value: basicAppInfo.appDesc },
      { label: '充值时间', value: <EnlargeImg picList={basicAppInfo.appIcon} /> },
      { label: '充值状态', value: basicAppInfo.webAddress },
      { label: '所属渠道', value: basicAppInfo.webAddress },
      { label: '充值后账户余额', value: basicAppInfo.webAddress },
    ]
    const applyContent = [
      { label: '申请时间', value: <EnlargeImg picList={basicAppInfo.screenshotUrls} /> },
      { label: '开发者名称', value: '' },
      { label: '汇款金额', value: '' },
      { label: '汇款流水号', value: '' },
      { label: '汇款银行卡信息', value: '' },
      { label: '汇款凭证', value: '' },
      { label: '我方收款银行卡信息', value: '' },
      { label: '审批编号', value: '' },
      { label: '所属渠道', value: '' },
    ]
    const applyResult = [
      { label: '审批结果', value: applyStatus[this.basicAppInfo.auditState] },
      { label: '审批人', value: basicAppInfo.auditor },
      { label: '审批时间', value: basicAppInfo.auditTime },
    ]

    if (basicAppInfo.auditState === 4) {
      applyResult.push({ label: '审批驳回意见', value: basicAppInfo.auditFailReason })
    }

    const navData = {
      url: "/!F1-fee/!S2-cash/!T3-recharge",
      name1: "充值记录",
      name2: "充值详情"
    }

    return (
      <div className="RechargeDetail-check-container">
        <BreadcrumbNav {...navData} />
        <div className="RechargeDetail-title">充值详情</div>
        <div className="RechargeDetail-basic-info">
          <Form className="RechargeDetail-form">
            <div className="second-title">
              {/* <span className="RechargeDetail-form-mark"></span> */}
              <span>充值信息</span></div>
            {basic && basic.map((item, index) => {
              return (
                <Item {...shortItemLayout} label={item.label} key={index} style={{ marginBottom: 0 }}>
                  {item.value}
                </Item>
              )
            })}
            <div className="second-title">
              {/* <span className="RechargeDetail-form-mark"></span> */}
              <span>相关审批单据</span></div>
          </Form>
          <div className="apply-content">
            <div className="title1">申请内容</div>
            <Form>
              {applyContent && applyContent.map((item, index) => {
                return (
                  <Item {...shortItemLayout} label={item.label} key={index} style={{ marginBottom: 0 }}>
                    {item.value}
                  </Item>
                )
              })}
            </Form>
          </div>
          <div className="apply-content">
            <div className="title1">审批记录</div>
            <Table
              className="recharge-table"
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>



        </div>
      </div>
    )
  }
}
