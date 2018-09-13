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


export default class MainClassfiyDimensionDetailTable extends Component {
  static propTypes = {
    detailTitle: PropTypes.string,
    detailVisible: PropTypes.bool,
    detailCancel: PropTypes.func,
    detailTotal: PropTypes.number,
    detailPageNo: PropTypes.number,
    detailPageOrPageSizeChange: PropTypes.func,
    detailShowTotal: PropTypes.func,
    detailData: PropTypes.array,
  }


  render() {
    const detailTitle = this.props.detailTitle
    let columns
    if (detailTitle === '专辑列表') {
      columns = [
        {
          title: '专辑Id',
          dataIndex: 'id',
          key: 'id',
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
          key: 'title'
        },
        {
          title: '声音数',
          dataIndex: 'trackCount',
          key: 'trackCount'
        },
        {
          title: '状态',
          dataIndex: 'onlineStatus',
          key: 'onlineStatus',
          render: (text, record) => {
            if (text === 1) {
              text = '已上架'
            } else if (text === 2) {
              text = '已下架'
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
        }]
    } else {
      columns = [
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
          title: '状态',
          dataIndex: 'onlineStatus',
          key: 'onlineStatus',
          render: (text, record) => {
            if (text === 1) {
              text = '已上架'
            } else if (text === 2) {
              text = '已下架'
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
        }]
    }

    return (
      <Modal
        title={this.props.detailTitle}
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
