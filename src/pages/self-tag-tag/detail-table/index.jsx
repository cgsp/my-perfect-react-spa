import React, { Component } from 'react'
import { Modal, Pagination, Table } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'


export default class SelfTagDimensionDetailTable extends Component {
  static propTypes = {
    detailVisible: PropTypes.bool,
    detailCancel: PropTypes.func,
    detailTotal: PropTypes.number,
    detailPageNo: PropTypes.number,
    detailPageOrPageSizeChange: PropTypes.func,
    detailShowTotal: PropTypes.func,
    detailData: PropTypes.array,
    detailLineEditOrDelete: PropTypes.func,
  }


  render() {
    const columns = [
      {
        title: '专辑Id',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) =>
          (
            <a href={record.url} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
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
        title: '状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        render: (text, record) =>
          (
            <span>{text === 1 ? '已上架' : '已下架'}</span>
          )
      },
      {
        title: '声音数',
        dataIndex: 'tracksNum',
        key: 'tracksNum'
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
      <Modal
        title="专辑列表"
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
