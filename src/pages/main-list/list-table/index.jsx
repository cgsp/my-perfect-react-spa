import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

export default class MainListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineShowDetails: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    pageNo: PropTypes.number
  }

  render() {
    const columns = [
      {
        title: '主站ID',
        dataIndex: 'rankingListId',
        key: 'rankingListId',
        width: 60
      },
      {
        title: '榜单ID',
        dataIndex: 'id',
        key: 'id',
        width: 60
      },
      {
        title: '榜单标题',
        dataIndex: 'rankTitle',
        key: 'rankTitle',
        width: 100
      },
      {
        title: '榜单副标题',
        dataIndex: 'rankSubTitle',
        key: 'rankSubTitle',
        width: 100
      },
      {
        title: '周期类型',
        dataIndex: 'periodType',
        key: 'periodType',
        width: 100
      },
      {
        title: '内容数',
        dataIndex: 'itemNum',
        key: 'itemNum',
        render: (text, record) => {
          return <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text}</span>
        },
        width: 100
      },
      {
        title: '内容类型',
        dataIndex: 'contentType',
        key: 'contentType',
        render(text, record) {
          return <span>{text === 1 ? '声音榜单' : '专辑榜单'}</span>
        },
        width: 100
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
        width: 80
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
        width: 80
      }]
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
