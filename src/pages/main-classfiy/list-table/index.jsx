import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'
import { hasThisButton } from '@Utils/getButton'


export default class MainClassfiyListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineSave: PropTypes.func,
    tableLineShowDetails: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    pageNo: PropTypes.number
  }

  render() {
    let columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '主站分类ID',
        dataIndex: 'sourceId',
        key: 'sourceId'
      },
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '分类封面',
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
              <a href={text} target="_blank" style={{ width: 50, height: 50, display: 'inline-block', cursor: 'pointer' }}>
                <img width={50} height={50} src={text} alt="分类封面" />
              </a>
            )
          }
          return img
        }
      },
      {
        title: '内容类型',
        dataIndex: 'contentType',
        key: 'contentType',
        render: (text, record) => {
          if (text === 1) {
            text = '专辑'
          } else if (text === 2) {
            text = '声音'
          }
          return <span>{text}</span>
        }
      },
      {
        title: '内容数',
        dataIndex: 'contentsNum',
        key: 'contentsNum',
        render: (text, record) => (
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text}</span>
        )
      },
      {
        title: '状态',
        dataIndex: 'onlineStatus',
        key: 'onlineStatus',
        render: (text, record) => {
          return <span>{text === 1 ? '已上架' : '已下架'}</span>
        },
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
        },
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
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <i style={{ color: 'green', cursor: 'pointer' }} onClick={() => this.props.tableLineSave(record)}>另存为</i>
            </span>)
        },
      }]
    if (!hasThisButton('main-classfiy', '另存为')) {
      columns.pop(columns.length - 1)
    }
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
