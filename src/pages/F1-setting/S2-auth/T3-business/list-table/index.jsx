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
        key: 'name'
      },
      {
        title: '操作',
        key: 'action',
        width: 300,
        render: (text, record) => {
          return (
            <span>
              {
                record.type !== '四级渠道' ?
                  <span>
                    <i style={{ color: '#1890ff', cursor: 'pointer', position: 'relative', top: '1px' }} onClick={() => this.props.tableLineAdd(record)}>添加下级渠道</i>
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
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1000 }} />
      </div>
    )
  }
}
