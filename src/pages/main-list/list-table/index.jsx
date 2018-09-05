import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { SONG_URL } from '@Constants'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

const DEV = process.env.NODE_ENV !== 'production'
// console.log(process.env.NODE_ENV)
let songUrlObj
if (DEV) {
  songUrlObj = SONG_URL.dev
} else {
  songUrlObj = SONG_URL.pro
}

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
      },
      {
        title: '榜单ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '榜单标题',
        dataIndex: 'rankTitle',
        key: 'rankTitle',
      },
      {
        title: '榜单副标题',
        dataIndex: 'rankSubTitle',
        key: 'rankSubTitle',
      },
      {
        title: '周期类型',
        dataIndex: 'periodType',
        key: 'periodType',
      },
      {
        title: '内容数',
        dataIndex: 'itemNum',
        key: 'itemNum',
        render(text, record) {
          return <span>{text}</span>
        }
      },
      {
        title: '内容类型',
        dataIndex: 'contentType',
        key: 'contentType',
        render(text, record) {
          return <span>{text === 1 ? '声音榜单' : '专辑榜单'}</span>
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
      }]
    return (
      <div>
        <Table columns={columns} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1400 }} />
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
