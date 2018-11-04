import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { myGetStrTime } from '@Utils/my-get-time'
import { PropTypes } from 'prop-types'

export default class ListTable extends Component {
  static propTypes = {
    orderBy: PropTypes.string,
    desc: PropTypes.bool,
    clickSort: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
    tableLineToDetail: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    current: PropTypes.number,
    pageSize: PropTypes.number,
  }

  render() {
    const { orderBy, desc } = this.props
    let columns = [
      {
        title: '开发者名称',
        dataIndex: 'developerName',
        key: 'developerName',
        render: (text, record) => {
          return (
            <span className="down-1-px">{text}</span>
          )
        }
      },
      {
        title: '开发者ID',
        dataIndex: 'developerId',
        key: 'developerId',
        render: (text, record) => {
          return (
            <span className="down-1-px">{text}</span>
          )
        }
      },
      {
        title: '所属渠道',
        dataIndex: 'businessTypeCategoryName',
        key: 'businessTypeCategoryName',
        render: (text, record) => {
          return (
            <span className="down-1-px">{text}</span>
          )
        }
      },
      {
        title: '奖励资格',
        dataIndex: 'rewardTypes',
        key: 'rewardTypes',
        render: (text, record) => {
          if (!text && text.length === 0) {
            return (
              <span />
            )
          }
          let content = null
          content = (
            <span>
              {
                text.map((item, index, arr) =>
                  <span key={index} onClick={() => this.props.tableLineToDetail(item, record)}>
                    <i className="table-rule-name">{item.value}</i>
                    {
                      index === (arr.length - 1)
                        ?
                        null :
                        <Divider type="vertical" />
                    }
                  </span>
                )
              }
            </span>
          )
          return content
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
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
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
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
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>修改奖励资格</i>
            </span>)
        },
      }]

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
      if (columnKey === 'updatedAt') {
        orderBy = 'updated_at'
      } else if (columnKey === 'createdAt') {
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
        <Table columns={columns} dataSource={this.props.tableData} onChange={onChange} pagination={false} scroll={{ x: 1000 }} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            current={this.props.current}
            pageSize={this.props.pageSize}
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
