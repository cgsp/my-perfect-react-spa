import React, { Component } from 'react'
import { Table, Divider } from 'antd'
import { PropTypes } from 'prop-types'

export default class ListTable extends Component {
  static propTypes = {
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    tableLineAdd: PropTypes.func,
  }

  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 400,
      },
      {
        title: '类型',
        dataIndex: 'nameType',
        key: 'nameType',
        width: 200,
      },
      {
        title: '仅管理员可见',
        dataIndex: 'adminFlag',
        key: 'adminFlag',
        render: (text, record) => {
          return (
            <span>{text === 1 ? '是' : '否'}</span>
          )
        },
        width: 300,
      },
      {
        title: '二级菜单ICON图标',
        dataIndex: 'icon',
        key: 'icon',
        width: 400,
      },
      {
        title: '菜单URL路径',
        dataIndex: 'routePath',
        key: 'routePath',
        width: 400,
      },
      {
        title: '功能按钮权限字符串',
        dataIndex: 'code',
        key: 'code',
        width: 400,
      },
      {
        title: '操作',
        key: 'action',
        width: 400,
        render: (text, record) => {
          return (
            <span>
              {
                record.nameType !== '功能按钮' ?
                  <span>
                    <i style={{ color: '#1890ff', cursor: 'pointer', position: 'relative', top: '1px' }} onClick={() => this.props.tableLineAdd(record)}>添加子节点</i>
                    <Divider type="vertical" />
                  </span>
                  : null
              }
              <span>
                <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
                <Divider type="vertical" />
              </span>
              <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.tableLineDelete(record)}>删除</i>
            </span>)
        },
      }]
    return (
      <div>
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1300 }} />
      </div>
    )
  }
}
