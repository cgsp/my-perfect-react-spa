import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

export default class AuthAccountListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineAddOrEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    pageNo: PropTypes.number
  }

  render() {
    const columns = [{
      title: '父节点名称',
      dataIndex: 'parentName',
      key: 'parentName'
    },
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '节点类型',
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => {
        let spanname
        text = `${text}-${record.type}`
        switch (text) {
          case '1-3':
            spanname = '一级菜单'
            break
          case '2-3':
            spanname = '二级菜单'
            break
          case '3-3':
            spanname = '三级菜单'
            break
          case '1-4':
            spanname = '按钮'
            break
          default:
            break
        }
        return (
          <span>{spanname}</span>
        )
      },
    },
    {
      title: 'Path地址',
      dataIndex: 'routePath',
      key: 'routePath',
    },
    {
      title: '权限字符串',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '一级菜单Icon',
      dataIndex: 'icon',
      key: 'icon',
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
        return (<span>
          <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineAddOrEdit(record, '编辑')}>编辑</i>
          <Divider type="vertical" />
          {
            !record.level ? null : (
              <span>
                <i style={{ color: 'green', cursor: 'pointer' }} onClick={() => this.props.tableLineAddOrEdit(record, '新增')}>新增节点</i>
                <Divider type="vertical" />
              </span>
            )
          }
          <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.tableLineDelete(record)}>删除</i>
        </span>)
      },
    }]
    return (
      <div>
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1200 }} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            current={this.props.pageNo}
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
