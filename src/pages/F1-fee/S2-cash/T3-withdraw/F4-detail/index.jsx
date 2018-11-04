import React, { Component } from 'react'
import './style.scss'
import { sessionCache } from '../../../../../utils/cache'
import BreadcrumbNav from '../../../../../components/bread-crumb'
import {
  Form,
  Table
} from 'antd'
import { appType, developerType } from '../../../../../constants'
import EnlargeImg from '../../../../../components/EnlargeImg'
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
}, {
  key: '3',
  time: 'nn',
  name: 'John Brown',
  money: '￥300,000.00',
  address: 'New York No. 1 Lake Park',
  result: "cc",
  text: 'bb'
},];


@Form.create({})
export default class WithdrawDetail extends Component {
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
      { label: '提现金额', value: basicAppInfo.developerName },
      { label: '提现后账户余额', value: developerType[basicAppInfo.developerType] },
      { label: '提现银行卡信息', value: basicAppInfo.appDesc },
      { label: '提现时间', value: <EnlargeImg picList={basicAppInfo.appIcon} /> },
      { label: '提现状态', value: basicAppInfo.webAddress },
      { label: '所属渠道', value: basicAppInfo.webAddress },
      { label: '提现手续费', value: basicAppInfo.webAddress },
    ]
    const applyContent = [
      { label: '申请时间', value: <EnlargeImg picList={basicAppInfo.screenshotUrls} /> },
      { label: '开发者名称', value: '' },
      { label: '提现金额', value: '' },
      { label: '提现银行卡信息', value: '' },
      { label: '审批编号', value: '' },
      { label: '所属渠道', value: '' },
      { label: '提现手续费', value: '' },
    ]

    const navData = {
      url: "/!F1-fee/!S2-cash/!T3-withdraw",
      name1: "提现记录",
      name2: "提现详情"
    }

    return (
      <div className="withdraw-check-container">
        <BreadcrumbNav {...navData} />
        <div className="withdraw-title">提现详情</div>
        <div className="withdraw-basic-info">
          <Form className="withdraw-form">
            <div className="second-title">
              {/* <span className="withdraw-form-mark"></span> */}
              <span>充值信息</span></div>
            {basic && basic.map((item, index) => {
              return (
                <Item {...shortItemLayout} label={item.label} key={index} style={{ marginBottom: 0 }}>
                  {item.value}
                </Item>
              )
            })}
            <div className="second-title">
              {/* <span className="withdraw-form-mark"></span> */}
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
              className="widthdraw-table"
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
