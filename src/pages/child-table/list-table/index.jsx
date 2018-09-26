import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'
import { hasThisButton } from '@Utils/getButton'

export default class MainClassfiyListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
    tableLineSave: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    pageNo: PropTypes.number
  }

  render() {
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '子站名称',
        dataIndex: 'siteName',
        key: 'siteName',
        render: (text, record) => {
          let aurl
          if (!text) {
            aurl = (
              <span />
            )
          } else {
            aurl = (
              <a href={record.siteUrl} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
                {text}
              </a>
            )
          }
          return aurl
        },
      },
      {
        title: '合作方应用',
        dataIndex: 'appName',
        key: 'appName',
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
        },
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
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              {
                hasThisButton('child-table', '编辑') ?
                  <span>
                    <i style={{ color: '#1585ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
                    <Divider type="vertical" />
                  </span>
                  : null
              }
              {
                hasThisButton('child-table', '另存为') ?
                  <i style={{ color: 'green', cursor: 'pointer' }} onClick={() => this.props.tableLineSave(record)}>另存为</i>
                  : null
              }
            </span>)
        },
      }]
    if (!hasThisButton('child-table', '编辑') && !hasThisButton('child-table', '另存为')) {
      columns.pop(columns.length - 1)
    }
    return (
      <div>
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} />
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
