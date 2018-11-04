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
    tableLineAuth: PropTypes.func,
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
        title: '角色ID',
        dataIndex: 'roleId',
        key: 'roleId'
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '角色code',
        dataIndex: 'roleCode',
        key: 'roleCode',
      },
      {
        title: '角色描述',
        dataIndex: 'desc',
        key: 'desc',
        render: (text, record) => {
          return (
            <span>{!text ? '' : text.length > 15 ? (text.substr(0, 14) + '...') : text}</span>
          )
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
              {
                (record.roleName === '商务' || record.roleName === '出纳' || record.roleName === '技术支持' || record.roleName === '财务')
                  ?
                  null
                  :
                  <span>
                    <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
                    <Divider type="vertical" />
                  </span>
              }
              <span>
                <i style={{ color: 'red', cursor: 'pointer', position: 'relative', top: '-1px' }} onClick={() => this.props.tableLineAuth(record)}>权限设置</i>
                {
                  (record.roleName === '商务' || record.roleName === '出纳' || record.roleName === '技术支持' || record.roleName === '财务') ?
                    null :
                    <Divider type="vertical" />
                }
              </span>
              {
                (record.roleName === '商务' || record.roleName === '出纳' || record.roleName === '技术支持' || record.roleName === '财务')
                  ?
                  null
                  :
                  <i style={{ color: 'red', cursor: 'pointer', position: 'relative', top: '1px' }} onClick={() => this.props.tableLineDelete(record)}>删除</i>
              }
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
