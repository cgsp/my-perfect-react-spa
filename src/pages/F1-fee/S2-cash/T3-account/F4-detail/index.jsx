import React, { Component } from 'react'
import './style.scss'
import { sessionCache } from '@Utils/cache'
import BreadcrumbNav from '../../../../../components/bread-crumb'
import {
  Form,
  Table,
  Button,
  Pagination
} from 'antd'
import { appType, developerType, applyStatus, cashStatus } from '../../../../../constants'
import EnlargeImg from '../../../../../components/EnlargeImg'
import CashDetailSearch from './CashDetailSearch'
const { Item } = Form
const shortItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
}

const columns = [
  {
    dataIndex: 'id',
    title: '开发者名称'
  },
  {

    dataIndex: 'name',
    title: '开发者ID'
  },
  {

    dataIndex: 'desc',
    title: '所属渠道'
  },
  {

    dataIndex: 'money',
    title: '现金账户余额'
  },
  {

    dataIndex: 'middle',
    title: '提现中金额'
  },
  {
    width: 200,
    dataIndex: 'time',
    title: '创建时间',
    sorter: true,
    defaultSortOrder: 'descend',
  },
  {
    width: 200,
    dataIndex: 'status',
    title: '状态'
  },
  {
    key: 'action',

    title: '操作',
    dataIndex: 'action',
  }
]

const data = [{
  id: '什么值得买',
  name: '3743894392721',
  desc: '金融线',
  key: 1,
  money: '¥10000.0',
  middle: '¥0.00',
  status: '停用',
  time: '2028-05-09 18:00:00',
  action: '--'
}, {
  id: 'woemn',
  name: '3743894392721',
  desc: '点点点',
  key: 2,
  money: '¥10000.0',
  middle: '¥0.00',
  status: '停用',
  time: '2028-05-09 18:00:00',
  action: '--'
}, {
  id: '我们不一样',
  name: '3743894392721',
  desc: '收拾收拾',
  key: 3,
  money: '¥10000.0',
  middle: '¥0.00',
  status: '停用',
  time: '2028-05-09 18:00:00',
  action: '--'
}, {
  id: '我们真不一样',
  name: '3743894392721',
  desc: '上午此案',
  key: 4,
  money: '¥10000.0',
  middle: '¥0.00',
  status: '启用',
  time: '2028-05-09 18:00:00',
  action: '--'
}]


@Form.create({})
export default class CashDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 1
    }
    this.basicAppInfo = sessionCache.get('highLinesWebsiteData') || {}
  }

  render() {
    const { basicAppInfo } = this
    const basic = [
      { label: '开发者名称', value: basicAppInfo.appName },
      { label: '开发者ID', value: appType[basicAppInfo.appType] },
      { label: '创建时间', value: basicAppInfo.developerName },
      { label: '状态', value: developerType[basicAppInfo.developerType] },
      { label: '账户余额', value: basicAppInfo.appDesc },
      { label: '提现中余额', value: <EnlargeImg picList={basicAppInfo.appIcon} /> },
      { label: '提现银行卡信息', value: basicAppInfo.webAddress },
      { label: '所属渠道', value: basicAppInfo.webAddress },
    ]
    // const rules = [
    //   { label: '应用截图', value: <EnlargeImg picList={basicAppInfo.screenshotUrls} /> },
    // ]
    const applyResult = [
      { label: '审批结果', value: applyStatus[this.basicAppInfo.auditState] },
      { label: '审批人', value: basicAppInfo.auditor },
      { label: '审批时间', value: basicAppInfo.auditTime },
    ]

    if (basicAppInfo.auditState === 4) {
      applyResult.push({ label: '审批驳回意见', value: basicAppInfo.auditFailReason })
    }
    const navData = {
      url: "/!F1-fee/!S2-cash/!T3-account",
      name1: "现金账户",
      name2: "账户详情"
    }
    return (
      <div className="cashDetail-check-container">
        <BreadcrumbNav {...navData} />
        <div className="cashDetail-basic-info colum1">
          <div className="title1">现金账户已被
                        <span className="title1-value" style={basicAppInfo.auditState === 4 ? { color: 'red' } : { color: 'cornflowerblue' }}>
              &nbsp;{cashStatus[basicAppInfo.auditState]}</span>
            <span>停用原因: <span>{'不符合规范'}</span></span>
          </div>
        </div>
        <div className="cashDetail-title">账户详情</div>
        <div className="cashDetail-basic-info">
          <Form className="cashDetail-form">
            <div className="second-title">
              {/* <span className="cashDetail-form-mark"></span> */}
              <span>账户信息</span>
            </div>
            {basic && basic.map((item, index) => {
              return (
                <Item {...shortItemLayout} label={item.label} key={index} style={{ marginBottom: 0 }}>
                  {item.value}
                </Item>
              )
            })}
            <div className="second-title">
              {/* <span className="cashDetail-form-mark"></span> */}
              <span>收支明细</span></div>
          </Form>

          <div className="search_show">
            <CashDetailSearch />
            <Button style={{ marginBottom: '20px', marginTop: '20px' }}>
              导出
                        </Button>
            <Table className="table"
              columns={columns}
              dataSource={data}
              scroll={{ x: 2000 }}
              pagination={false}
            />
            <div style={{ textAlign: 'right', marginTop: 30 }}>
              <Pagination
                showSizeChanger
                showQuickJumper
                defaultCurrent={this.state.current}
                total={10}
                showTotal={total => `共 ${total} 条`}
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.pageChange}
                current={this.state.pageCurrent}
              />
            </div>
          </div>



        </div>
      </div>
    )
  }
}
