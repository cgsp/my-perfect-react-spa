import React, { Component } from 'react'
import './style.scss'
import { sessionCache } from '@Utils/cache'
import {
  Form,
  Table
} from 'antd'
import BreadcrumbNav from '@Components/bread-crumb'
import EnlargeImg from '@Components/EnlargeImg'
import { applyStatus } from '@Constants'
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
  time: '2018-09-05 18:00:00',
  name: 'John Brown',
  money: '商务',
  address: '豆豆',
  result: "通过",
  text: '商务通过才有这条记录 通过意见需要回执单'
}];


@Form.create({})
export default class MobileDetail extends Component {
  constructor(props) {
    super(props)
    this.basicAppInfo = sessionCache.get('highLinesMobileData') || {}
  }

  render() {
    const { basicAppInfo } = this
    const basic = [
      { label: '应用名称', value: basicAppInfo.appName },
      { label: '应用类型', value: '' },
      { label: '应用简介', value: basicAppInfo.appDesc },
      { label: '应用图标', value: <EnlargeImg picList={basicAppInfo.appIcon} /> },
      { label: '应用平台', value: basicAppInfo.clientOsTypes },
    ]

    const navData = {
      url: "/!F1-audit/!S2-fee/!T3-withdraw",
      name1: "账户审批列表",
      name2: "提现审批详情"
    }
    return (
      <div className="withdraw-check-container-detail">
        <BreadcrumbNav {...navData} />
        <div className="withdraw-basic-info colum1">
          <div className="title1">审批状态:
            <span className="title1-value" style={basicAppInfo.auditState === 4 ? { color: 'red' } : { color: 'cornflowerblue' }}>
              &nbsp;{applyStatus[basicAppInfo.auditState]}</span></div>
        </div>
        <div className="withdraw-title">提现审批详情</div>

        <div className="withdraw-basic-info">
          <div className="title1">申请内容</div>
          <Form className="withdraw-form">
            {basic && basic.map((item, index) => {
              return (
                <Item {...shortItemLayout} label={item.label} key={index} style={{ marginBottom: 0 }}>
                  {item.value}
                </Item>
              )
            })}
          </Form>
        </div>

        <div className="withdraw-basic-info">
          <div className="title1">审批记录</div>
          <Table
            className="withdraw-table"
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>

      </div>
    )
  }
}
