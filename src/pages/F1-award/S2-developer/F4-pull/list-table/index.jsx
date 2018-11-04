import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { myGetStrTime } from '@Utils/my-get-time'
import { myGetMoneyStyle } from '@Utils/my-get-money-style'
import { PropTypes } from 'prop-types'

export default class ListTable extends Component {
  static propTypes = {
    orderBy: PropTypes.string,
    desc: PropTypes.bool,
    clickSort: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    current: PropTypes.number
  }

  render() {
    const { orderBy, desc } = this.props
    let columns = [
      {
        title: '绑定时间',
        dataIndex: 'bindTime',
        key: 'bindTime',
        sorter: true,
        sortOrder: orderBy === 'updated_at' ? false : desc ? 'descend' : 'ascend',
        render: (text, record) => {
          const str = myGetStrTime(text)
          return (
            <span>{str}</span>
          )
        }
      },
      {
        title: '绑定失效时间',
        dataIndex: 'invalidTime',
        key: 'invalidTime',
        sorter: true,
        sortOrder: orderBy === 'created_at' ? false : desc ? 'descend' : 'ascend',
        render: (text, record) => {
          const str = myGetStrTime(text)
          return (
            <span>{str}</span>
          )
        }
      },
      {
        title: '用户UID',
        dataIndex: 'uid',
        key: 'uid',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '用户昵称',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '绑定原因',
        dataIndex: 'bindReason',
        key: 'bindReason',
      },
      {
        title: '绑定来源业务',
        dataIndex: 'fromBusiness',
        key: 'fromBusiness',
      },
      {
        title: '绑定来源应用',
        dataIndex: 'fromApp',
        key: 'fromApp',
      },
      {
        title: '奖励订单数',
        dataIndex: 'rewardOrderCount',
        key: 'rewardOrderCount',
        render: (text, record) => {
          let content
          if (text) {
            content = (
              <span style={{ color: '#3f90f7' }}>
                {text}
              </span>
            )
          } else {
            content = (
              <span>
                0
              </span>
            )
          }
          return content
        }
      },
      {
        title: '奖励金额',
        dataIndex: 'totalRewardAmount',
        key: 'totalRewardAmount',
        render: (text, record) => {
          let content
          if (text) {
            content = (
              <span style={{ color: '#3f90f7' }}>
                {`¥ ${myGetMoneyStyle(text, 2)}`}
              </span>
            )
          } else {
            content = (
              <span>
                0
              </span>
            )
          }
          return content
        }
      },
      {
        title: '绑定状态',
        dataIndex: 'bindStatus',
        key: 'bindStatus',
        render: (text, record) => {
          let content
          if (text) {
            content = (
              <span style={{ color: '#71cb47' }}>
                绑定中
              </span>
            )
          } else {
            content = (
              <span>
                已失效
              </span>
            )
          }
          return content
        }
      },]

    const that = this
    function onChange(pagination, filters, sorter) {
      const { order, columnKey } = sorter
      console.log(order, columnKey)
      const olderDesc = that.props.desc
      const oldOrderBy = that.props.orderBy
      let desc, orderBy
      if (order === 'ascend') {
        desc = false
      } else if (order === 'descend') {
        desc = true
      } else {
        // 出现无序了
      }
      if (columnKey === 'invalidTime') {
        orderBy = 'updated_at'
      } else if (columnKey === 'bindTime') {
        orderBy = 'created_at'
      } else {
        // 出现无序了
      }

      // 这个时候，是无序的
      // 需要根据上次的记录去判断
      if (order === undefined && columnKey === undefined) {
        if (olderDesc === false && oldOrderBy === 'created_at') {
          orderBy = 'created_at'
          desc = true
        }
        if (olderDesc === false && oldOrderBy === 'updated_at') {
          orderBy = 'updated_at'
          desc = true
        }
      }
      that.props.clickSort(orderBy, desc)
    }

    return (
      <div>
        <Table columns={columns} dataSource={this.props.tableData} onChange={onChange} pagination={false} scroll={{ x: 1300 }} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            current={this.props.current}
            defaultCurrent={1}
            onShowSizeChange={this.props.pageOrPageSizeChange}
            onChange={this.props.pageOrPageSizeChange}
            total={this.props.total}
            showTotal={this.props.showTotal}
          />
        </div>
      </div>
    )
  }
}
