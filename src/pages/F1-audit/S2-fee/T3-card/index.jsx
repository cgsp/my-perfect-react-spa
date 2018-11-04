import React, { Component } from 'react'
import './style.scss'
import {
  Table,
  Pagination
} from 'antd'

import Search from './search'

export default class CardAudit extends Component {
  state = {
    itemInfo: {},
    currentPageNum: 1,
  }

  componentDidMount() {

  }

  handlePassBtnClick = (info) => {
    this.props.history.push(`/!F1-audit/!S2-fee/!T3-card/!F4-detail/${1}`)
  }

  // handlePageChange = page => {

  // }

  handleCurrentPage = () => {
    this.setState({ currentPageNum: 1 })
  }


  render() {
    const context = this
    // const { handlePageChange } = this
    const data = [{
      appName: '什么值得买',
      appType: 1,
      mony: '3743894392721',
      account1: '金融线',
      action: '操作',
      key: 1,
      money: '¥10000.0',
      middle: '¥0.00',
      time: '2028-05-09 18:00:00',
      status: 'c',
      type: 'cc',
      channel: 'nn',
      accountstatus: 'hh',
      account: 'tt',
      accounttime: 'yy'


    }]
    const columns = [
      {
        dataIndex: 'appName',
        title: '开发者名称'
      },
      {
        dataIndex: 'appType',
        title: '所属渠道',
        render(text) {
          const statusMap = {
            1: '金融线',
            2: 'APP线',
          }
          return statusMap[text]
        }
      },
      {
        dataIndex: 'money',
        title: '审批类型'
      },
      {
        dataIndex: 'auditState',
        title: '状态',
        render(text) {
          const statusMap = {
            2: '待审核',
            3: '已通过',
            4: '未通过'
          }
          return statusMap[text]
        }
      },
      {
        dataIndex: 'applyTime',
        title: '申请时间'
      },
      {
        dataIndex: 'lastTime',
        title: '最后审批时间'
      },
      {
        dataIndex: 'person',
        title: '最后审批人'
      },
      {
        dataIndex: 'operation',
        title: '操作',
        render(status, record) {
          return [
            <div key="1" style={{ marginBottom: 4 }}>
              <a onClick={() => context.handlePassBtnClick(record)}>审核</a>
            </div>,
          ]
        }
      },
    ]
    return (
      <div className="card-top-container">
        <div className="card-title">提现银行卡审批</div>
        <Search handleCurrentPage={this.handleCurrentPage} />
        <Table
          className="table"
          columns={columns}
          dataSource={data}
          scroll={{ x: 2000 }}
          pagination={false}
        />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            total={10}
            showTotal={total => `共 ${total} 条`}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.pageChange}
            current={this.state.currentPageNum}
          />
        </div>
      </div>
    )
  }
}
