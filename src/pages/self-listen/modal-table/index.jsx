import React, { Component } from 'react'
import { Modal, Pagination, Table } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'


export default class SelfListenModalTable extends Component {
  static propTypes = {
    modalTableVisible: PropTypes.bool,
    modalTableCancel: PropTypes.func,
    modalTableTotal: PropTypes.number,
    modalTableOnShowSizeChange: PropTypes.func,
    modalTableOnChange: PropTypes.func,
    modalTableShowTotal: PropTypes.func,
    modalTableData: PropTypes.array
  }


  render() {
    const columns = [{
      title: '专辑Id',
      dataIndex: 'albumId',
      key: 'albumId',
      render: (text, record) =>
        (
          <a href={record.url} target="_blank" style={{ width: 30, display: 'inline-block', cursor: 'pointer' }}>
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
      dataIndex: 'voiceName',
      key: 'voiceName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state'
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
        visible={this.props.modalTableVisible}
        onCancel={this.props.modalTableCancel}
        width={1100}
        footer={null}
      >
        <div>
          <Table columns={columns} dataSource={this.props.modalTableData} pagination={false} />
          <div style={{ textAlign: 'right', marginTop: 30 }}>
            <Pagination
              showSizeChanger
              showQuickJumper
              defaultCurrent={1}
              onShowSizeChange={this.props.modalTableOnShowSizeChange}
              onChange={this.props.modalTableOnChange}
              total={this.props.modalTableTotal}
              showTotal={this.props.modalTableShowTotal}
            />
          </div>
        </div>
      </Modal >
    )
  }
}
