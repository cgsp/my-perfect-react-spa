import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { SONG_URL } from '@Constants'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'
import { hasThisButton } from '@Utils/getButton'

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
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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
        title: '封面图',
        dataIndex: 'coverUrlSmall',
        key: 'coverUrlSmall',
        render: (text, record) => {
          let img
          if (!text) {
            img = (
              <span />
            )
          } else {
            img = (
              <a href={text} target="_blank" style={{ cursor: 'pointer', position: 'relative', left: 0, top: 0, display: 'inline-block', width: 50, height: 50 }}>
                <img width={50} height={50} src={text} alt="封面图" />
                {
                  record.isPaid === 1 ?
                    <span style={{ display: 'inline-block', width: 30, height: 20, position: 'absolute', bottom: 0, right: 0, backgroundColor: 'red', textAlign: 'center', lineHeight: '20px', color: '#fff' }}>付费</span> : null
                }
              </a>
            )
          }
          return img
        }
      },
      {
        title: '是否付费',
        dataIndex: 'isPaid',
        key: 'isPaid',
        render: (text, record) => {
          return <span>{text === 1 ? '付费' : '免费'}</span>
        }
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
          return <span>{text.join()}</span>
        },
        width: 200
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
        render: (text, record) => {
          return (
            <span>
              <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
            </span>)
        },
      }]
    if (!hasThisButton('self-album', '编辑')) {
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
