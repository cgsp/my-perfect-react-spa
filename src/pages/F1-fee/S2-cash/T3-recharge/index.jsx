import React, { Component } from 'react'
import { Button, Table, Pagination } from 'antd'
import './style.scss'
// import { toJS } from 'mobx'
import Search from './ReAndWithSearch'

const data = [{
  id: '什么值得买',
  name: '3743894392721',
  desc: '金融线',
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


export default class Recharge extends Component {
  state = {
    addModal: false,
    editModal: false,
    addUserModal: false,
    deleteModal: false,
    editInitData: {
      name: '',
      desc: ''
    },
    pageCurrent: 1,
  }


  // componentDidMount() {

  // }
  title = ''

  handleDetail = (record) => {
    this.props.history.push(`/!F1-fee/!S2-cash/!T3-recharge/!F4-detail/${1}`)
  }


  render() {
    const context = this
    const columns = [
      {

        dataIndex: 'id',
        title: '交易流水号'
      },
      {

        dataIndex: 'name',
        title: '支付流水号'
      },
      {

        dataIndex: 'desc',
        title: '充值金额'
      },
      {

        dataIndex: 'money',
        title: '充值后账户余额'
      },
      {

        dataIndex: 'middle',
        title: '开发者名称'
      },
      {

        dataIndex: 'time',
        title: '开发者ID'
      },
      {

        dataIndex: 'status',
        title: '所属渠道'
      },
      {

        dataIndex: 'type',
        title: '充值类型'
      },
      {

        dataIndex: 'channel',
        title: '支付渠道'
      },
      {

        dataIndex: 'account',
        title: '支付账号'
      },
      {

        dataIndex: 'accountstatus',
        title: '充值状态'
      },
      {

        dataIndex: 'accounttime',
        title: '充值时间',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        key: 'action',
        title: '操作',
        render(_, record, index) {
          return (
            <div>
              <a onClick={() => context.handleDetail(record, index)}>查看详情 </a>
            </div>
          )
        }
      }
    ]

    return (
      <div className="role-content-container">
        <p className="role-title">充值记录</p>
        <Search mark="recharge" />
        <Button style={{ marginBottom: "20px" }} type="primary">导出</Button>
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
            total={10}
            showTotal={total => `共 ${total} 条`}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.pageChange}
            current={this.state.pageCurrent}
          />
        </div>
      </div>
    )
  }
}


