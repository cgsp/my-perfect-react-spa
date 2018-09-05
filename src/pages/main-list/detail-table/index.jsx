import React, { Component } from 'react'
import { Modal, Pagination, Table } from 'antd'
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


export default class MainListDetailTable extends Component {
  static propTypes = {
    detailVisible: PropTypes.bool,
    detailCancel: PropTypes.func,
    detailTotal: PropTypes.number,
    detailPageNo: PropTypes.number,
    detailPageOrPageSizeChange: PropTypes.func,
    detailShowTotal: PropTypes.func,
    detailData: PropTypes.array,
  }


  render() {
    const columns = [
      {
        title: '声音Id',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) =>
          (
            <a href={songUrlObj.track + '/' + text} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
              {text}
            </a>
          )
      },
      {
        title: '声音名称',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '是否付费',
        dataIndex: 'isPaid',
        key: 'isPaid',
        render: (text, record) => {
          if (!text && text !== 0) {
            return <span />
          }
          return <span>{text === 1 ? '付费' : '免费'}</span>
        }
      },
      {
        title: '发布时间',
        dataIndex: 'publishedTime',
        key: 'publishedTime',
        render: (text, record) => {
          const str = myGetStrTime(text)
          return (
            <span>{str}</span>
          )
        }
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
        }
      }]
    return (
      <Modal
        title="声音列表"
        visible={this.props.detailVisible}
        onCancel={this.props.detailCancel}
        width={1100}
        footer={null}
        destroyOnClose={true}
        zIndex={1000}
      >
        <div>
          <Table columns={columns} dataSource={this.props.detailData} pagination={false} />
          <div style={{ textAlign: 'right', marginTop: 30 }}>
            <Pagination
              showSizeChanger
              showQuickJumper
              defaultCurrent={1}
              current={this.props.detailPageNo}
              onShowSizeChange={this.props.detailPageOrPageSizeChange}
              onChange={this.props.detailPageOrPageSizeChange}
              total={this.props.detailTotal}
              showTotal={this.props.detailShowTotal}
            />
          </div>
        </div>
      </Modal >
    )
  }
}
