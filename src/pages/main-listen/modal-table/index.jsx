import React, { Component } from 'react'
import { Modal, Pagination, Table } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'


export default class MainListenModalTable extends Component {
  static propTypes = {
    modalTableVisible: PropTypes.bool,
    modalTableCancel: PropTypes.func,
    modalTableTotal: PropTypes.number,
    modalTableOnShowSizeChange: PropTypes.func,
    modalTableOnChange: PropTypes.func,
    modalTableShowTotal: PropTypes.func,
    modalTableData: PropTypes.array,
    modalTableTitile: PropTypes.string,
  }


  render() {
    let columns
    if (this.props.modalTableTitile === '专辑列表') {
      columns = [{
        title: '专辑Id',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text, record) =>
          (
            <a href={record.url} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
              {text}
            </a>
          )
      }, {
        title: '专辑名称',
        dataIndex: 'title',
        key: 'title',
        width: 150
      },
      {
        title: '声音数',
        dataIndex: 'tracksNum',
        key: 'tracksNum',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        width: 100,
        render: (text, record) => {
          switch (text) {
            case 1:
              text = '已上架'
              break
            case 2:
              text = '已下架'
              break
            default:
              break
          }
          return <span>{text}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
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
        width: 100,
        render: (text, record) => {
          const str = myGetStrTime(text)
          return (
            <span>{str}</span>
          )
        }
      }]
    } else {
      columns = [{
        title: '声音Id',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text, record) =>
          (
            <a href={record.url} target="_blank" style={{ display: 'inline-block', cursor: 'pointer' }}>
              {text}
            </a>
          )
      }, {
        title: '声音名称',
        dataIndex: 'title',
        key: 'title',
        width: 150
      },
      {
        title: '状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        width: 100,
        render: (text, record) => {
          switch (text) {
            case 1:
              text = '已上架'
              break
            case 2:
              text = '已下架'
              break
            default:
              break
          }
          return <span>{text}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
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
        width: 100,
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
        title={this.props.modalTableTitile}
        visible={this.props.modalTableVisible}
        onCancel={this.props.modalTableCancel}
        width={1100}
        footer={null}
      >
        <div>
          <Table columns={columns}
            dataSource={this.props.modalTableData}
            pagination={false}
            scroll={{ x: 700, y: 400 }}
          />
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
