import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

export default class SelfTagDimensionListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
    tableLineDelete: PropTypes.func,
    tableLineAdd: PropTypes.func,
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
      title: '维度名称',
      dataIndex: 'dimensionName',
      key: 'dimensionName',
    },
    {
      title: '标签数',
      dataIndex: 'tagNum',
      key: 'tagNum',
      render: (text, record) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text}</span>
      )
    },
    {
      title: '该维度下标签的名称类型',
      dataIndex: 'tagNameType',
      key: 'tagNameType',
      render: (text, record) => {
        switch (text) {
          case 'text':
            text = '文本'
            break
          case 'number':
            text = '数值'
            break
          case 'numberRange':
            text = '数值范围'
            break
          default:
            break
        }
        return <span>{text}</span>
      }
    },
    {
      title: '该维度下标签是否支持多选',
      dataIndex: 'moreTagOrSingleTag',
      key: 'moreTagOrSingleTag',
      render: (text, record) => {
        switch (text) {
          case 'more':
            text = '支持多选'
            break
          case 'single':
            text = '只能单选'
            break
          default:
            break
        }
        return <span>{text}</span>
      }
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
            <i style={{ color: '#71986a', cursor: 'pointer' }} onClick={() => this.props.tableLineAdd(record)}>添加标签</i>
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
