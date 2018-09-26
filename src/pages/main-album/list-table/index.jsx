import React, { Component } from 'react'
import { Table, Pagination, Divider } from 'antd'
import { SONG_URL } from '@Constants'
import { myGetStrTime } from '@Utils/myGetTime'
import { hasThisButton } from '@Utils/getButton'
import { PropTypes } from 'prop-types'

const DEV = process.env.NODE_ENV !== 'production'
// console.log(process.env.NODE_ENV)
let songUrlObj
if (DEV) {
  songUrlObj = SONG_URL.dev
} else {
  songUrlObj = SONG_URL.pro
}

export default class SelfAlbumListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineTag: PropTypes.func,
    tableLineSave: PropTypes.func,
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
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) =>
          (
            <a href={songUrlObj.album + '/' + text} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
              {text}
            </a>
          ),
        // width: 100
      },
      {
        title: '专辑名称',
        dataIndex: 'title',
        key: 'title',
        // width: 90
      },
      {
        title: '是否付费',
        dataIndex: 'isPaid',
        key: 'isPaid',
        render: (text, record) => {
          return <span>{text === 1 ? '付费' : '免费'}</span>
        },
        // width: 60
      },
      {
        title: '价格类型',
        dataIndex: 'priceType',
        key: 'priceType',
        render: (text, record) => {
          let str
          if (text === 1) {
            str = '单集购买'
          } else if (text === 2) {
            str = '整张购买'
          } else {
            str = ''
          }
          return <span>{str}</span>
        },
        // width: 60
      },
      {
        title: '分类',
        dataIndex: 'categoryTitle',
        key: 'categoryTitle',
        // width: 60
      },
      {
        title: '声音数',
        dataIndex: 'trackIds',
        key: 'trackIds',
        render: (text, record) => {
          return <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text ? text.length : 0}</span>
        },
        // width: 60
      },
      {
        title: '主站标签',
        dataIndex: 'tags',
        key: 'tags',
        render: (text, record) => {
          return <span>{text}</span>
        },
        // width: 100
      },
      {
        title: '自运营标签',
        dataIndex: 'ctagNames',
        key: 'ctagNames',
        render: (text, record) => {
          return <span>{text}</span>
        },
        width: 200
      },
      {
        title: '播放数',
        dataIndex: 'playCount',
        key: 'playCount',
        // width: 60
      },
      {
        title: '状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        render: (text, record) => {
          return <span>{text === 1 ? '已上架' : '已下架'}</span>
        },
        // width: 60
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: (text, record) => {
          const str = myGetStrTime(text)
          return (
            <span>{str}</span>
          )
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        key: 'updatedTime',
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
                hasThisButton('main-album', '打标签') ?
                  <span>
                    <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineTag(record)}>打标签</i>
                    <Divider type="vertical" />
                  </span>
                  : null
              }
              {
                hasThisButton('main-album', '另存为') ?
                  <i style={{ color: 'green', cursor: 'pointer' }} onClick={() => this.props.tableLineSave(record)}>另存为</i>
                  : null
              }
            </span>)
        },
      }]

    if (!hasThisButton('main-album', '打标签') && !hasThisButton('main-album', '另存为')) {
      columns.pop(columns.length - 1)
    }
    return (
      <div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={this.props.tableData} pagination={false} scroll={{ x: 2000 }} />
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
