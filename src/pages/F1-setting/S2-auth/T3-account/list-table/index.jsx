import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { myGetStrTime } from '@Utils/my-get-time'
import { PropTypes } from 'prop-types'

export default class AuthAccountListTable extends Component {
  static propTypes = {
    orderBy: PropTypes.string,
    desc: PropTypes.bool,
    clickSort: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    current: PropTypes.number
  }

  render() {
    const { orderBy, desc } = this.props
    let columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
        render: (text, record) => {
          let str = null
          if (!record.adminFlag) {
            str = text
          } else {
            str = (
              <span className="admin-content">
                <i>
                  {text}
                </i>
                <i className="admin">
                  管理员
                </i>
              </span>
            )
          }
          return (
            <span>{str}</span>
          )
        }
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        render: (text, record) => {
          if (!text) {
            return (
              <span />
            )
          }
          let str = ''
          text.forEach(element => {
            str += (element.roleName + ',')
          })

          str = str.slice(0, -1)
          return (
            <span>{str}</span>
          )
        }
      },
      {
        title: '商务渠道',
        dataIndex: 'businessTypeCategoryName',
        key: 'businessTypeCategoryName',
        render: (text, record) => {
          //   if (!text) {
          //     return (
          //       <span />
          //     )
          //   }
          //   let str = ''
          //   text.forEach(element => {
          //     str += (element.roleName + ',')
          //   })

          //   str = str.slice(0, -1)
          //   return (
          //     <span>{str}</span>
          //   )
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
              <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
              <span style={{ position: 'relative', top: '-2px' }}>
                <Divider type="vertical" />
                <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.tableLineDelete(record)}>清空角色</i>
              </span>
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
