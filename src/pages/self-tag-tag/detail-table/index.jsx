import React, { Component } from 'react'
import { Modal, Pagination, Table } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'


export default class SelfTagTagDetailTable extends Component {
  static propTypes = {
    detailVisible: PropTypes.bool,
    detailCancel: PropTypes.func,
    detailTotal: PropTypes.number,
    detailPageOrPageSizeChange: PropTypes.func,
    detailShowTotal: PropTypes.func,
    detailData: PropTypes.array
  }


  render() {
    const columns = [{
      title: '专辑Id',
      dataIndex: 'albumId',
      key: 'albumId',
      render: (text, record) =>
        (
          <a href={record.url} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
            {text}
          </a>
        )
    }, {
      title: '专辑名称',
      dataIndex: 'albumName',
      key: 'albumName',
    },
    {
      title: '声音数',
      dataIndex: 'voiceNum',
      key: 'voiceNum',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: '发布时间',
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
      >
        <div>
          <Table columns={columns} dataSource={this.props.detailData} pagination={false} />
          <div style={{ textAlign: 'right', marginTop: 30 }}>
            <Pagination
              showSizeChanger
              showQuickJumper
              defaultCurrent={1}
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
