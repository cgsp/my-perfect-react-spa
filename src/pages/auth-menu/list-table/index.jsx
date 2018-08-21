import React, { Component } from 'react'
import { Table, Divider, Pagination } from 'antd'
import { PropTypes } from 'prop-types'

export default class AuthMenuListTable extends Component {
  static propTypes = {
    total: PropTypes.number,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    tableLineAdd: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    onChange: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array
  }



  render() {
    const columns = [{
      title: '父权限名称',
      dataIndex: 'pname',
      key: 'pname'
    }, {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '前端 url 地址',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '权限类型',
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => {
        let spanname
        switch (text) {
          case '1':
            spanname = '一级菜单'
            break
          case '2':
            spanname = '二级菜单'
            break
          case '3':
            spanname = '三级菜单'
            break
          case null:
            spanname = '功能'
            break
          default:
            break
        }
        return (
          <span>{spanname}</span>
        )
      },
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (<span>
          <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
          <Divider type="vertical" />
          {
            !record.level ? null : (
              <span>
                <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineAdd(record)}>新增节点</i>
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
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={1}
            onShowSizeChange={this.props.onShowSizeChange}
            onChange={this.props.onChange}
            total={this.props.total}
            showTotal={this.props.showTotal}
          />
        </div>
      </div>
    )
  }
}
