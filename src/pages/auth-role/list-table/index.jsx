import React, { Component } from 'react'
import { Table, Divider, Pagination } from 'antd'
import { PropTypes } from 'prop-types'
import { myGetStrTime } from '@Utils/myGetTime'
import { hasThisButton } from '@Utils/getButton'

export default class AuthRoleListTable extends Component {
  static propTypes = {
    total: PropTypes.number,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    onSizeAndPageChange: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    page: PropTypes.number
  }




  render() {
    let columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: '角色描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
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
          // console.log(record)
          return (<span>
            {
              hasThisButton('auth-role', '编辑') ?
                <span>
                  <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
                  <Divider type="vertical" />
                </span>
                : null
            }
            {
              hasThisButton('auth-role', '删除') ?
                <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.tableLineDelete(record)}>删除</i>
                : null
            }
          </span>)
        },
      }]
    if (!hasThisButton('auth-role', '编辑') && !hasThisButton('auth-role', '删除')) {
      columns.pop(columns.length - 1)
    }
    return (
      <div>
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={1}
            current={this.props.page}
            onShowSizeChange={this.props.onSizeAndPageChange}
            onChange={this.props.onSizeAndPageChange}
            total={this.props.total}
            showTotal={this.props.showTotal}
          />
        </div>
      </div>
    )
  }
}
