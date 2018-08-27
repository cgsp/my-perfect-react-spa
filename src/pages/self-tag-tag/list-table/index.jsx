import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

export default class SelfTagTagListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    tableSelect: PropTypes.func,
    selectedRowKeys: PropTypes.array,
    tableLineShowDetails: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    pageNo: PropTypes.number
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys,
      onChange: this.props.tableSelect,
    }
    const columns = [{
      title: '标签Id',
      dataIndex: 'tagId',
      key: 'tagId'
    }, {
      title: '标签名称',
      dataIndex: 'tagName',
      key: 'tagName',
    },
    {
      title: '维度',
      dataIndex: 'dimension',
      key: 'dimension',
    },
    {
      title: '主站专辑数',
      dataIndex: 'mainAlbumsNum',
      key: 'mainAlbumsNum',
      render: (text, record) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record, '主站专辑数')}>{text}</span>
      )
    },
    {
      title: '自运营专辑数',
      dataIndex: 'selfAlbumsNum',
      key: 'selfAlbumsNum',
      render: (text, record) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record, '自运营专辑数')}>{text}</span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => {
        const str = myGetStrTime(text)
        return (
          <span>{str}</span>
        )
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text, record) => {
        const str = myGetStrTime(text)
        return (
          <span>{str}</span>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
            <Divider type="vertical" />
            <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.tableLineDelete(record)}>删除</i>
          </span>)
      },
    }]
    return (
      <div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={this.props.tableData} pagination={false} />
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