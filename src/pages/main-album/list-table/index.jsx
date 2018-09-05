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

export default class SelfAlbumListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineEdit: PropTypes.func,
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
    const columns = [
      {
        title: '自运营专辑ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '主站专辑ID',
        dataIndex: 'sourceId',
        key: 'sourceId',
        render: (text, record) =>
          (
            <a href={songUrlObj.album + '/' + text} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
              {text}
            </a>
          )
      },
      {
        title: '专辑名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '是否付费',
        dataIndex: 'isPaid',
        key: 'isPaid',
        render: (text, record) => {
          return <span>{text === 1 ? '付费' : '收费'}</span>
        }
      },
      {
        title: '价格类型',
        dataIndex: 'priceType',
        key: 'priceType',
        render: (text, record) => {
          return <span>{text === 1 ? '单集购买' : '整张购买'}</span>
        }
      },
      {
        title: '分类来源',
        dataIndex: 'categorySource',
        key: 'categorySource',
        render: (text, record) => {
          if (text === null) {
            return <span />
          }
          return <span>{text === 1 ? '主站' : '自运营'}</span>
        }
      },
      {
        title: '分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '声音数',
        dataIndex: 'trackIds',
        key: 'trackIds',
        render: (text, record) => {
          return <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text.length}</span>
        }
      },
      {
        title: '自运营标签',
        dataIndex: 'ctagNames',
        key: 'ctagNames',
        render: (text, record) => {
          return <span>{text}</span>
        }
      },
      {
        title: '状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        render: (text, record) => {
          return <span>{text === 1 ? '已上架' : '已下架'}</span>
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
        key: 'creator',
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => {
          return (
            <span>
              <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
            </span>)
        },
      }]
    return (
      <div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1400 }} />
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
