import React, { Component } from 'react'
import { Table, Divider, Pagination } from 'antd'
import { PropTypes } from 'prop-types'

export default class AuthAccountListTable extends Component {
  static propTypes = {
    total: PropTypes.number,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    onChange: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array
  }



  render() {
    const columns = [{
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    }, {
      title: '角色名称',
      dataIndex: 'rolename',
      key: 'rolename',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        // console.log(record)
        return (<span>
          <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
          <Divider type="vertical" />
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
