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
      width: 100,
    },
    {
      title: '标签数',
      dataIndex: 'tagsNum',
      key: 'tagsNum',
      width: 80,
      render: (text, record) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text}</span>
      )
    },
    {
      title: '标签名称类型',
      dataIndex: 'valueType',
      key: 'valueType',
      width: 100,
      render: (text, record) => {
        switch (text) {
          case 1:
            text = '文本'
            break
          case 2:
            text = '数值'
            break
          case 3:
            text = '数值范围'
            break
          default:
            break
        }
        return <span>{text}</span>
      }
    },
    {
      title: '标签支持多选',
      dataIndex: 'choiceType',
      key: 'choiceType',
      width: 100,
      render: (text, record) => {
        switch (text) {
          case 2:
            text = '支持多选'
            break
          case 1:
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
      title: '创建人',
      dataIndex: 'operator',
      key: 'operator'
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
