import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

export default class MainFocusListTable extends Component {
  static propTypes = {
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    tableLineSave: PropTypes.func,
    pageOrPageSizeChange: PropTypes.func,
    total: PropTypes.number,
    pageNo: PropTypes.number
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '主站ID',
        dataIndex: 'bannerId',
        key: 'bannerId'
      },
      {
        title: '焦点图名称',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '分类',
        dataIndex: 'categoryTitle',
        key: 'categoryTitle'
      },
      {
        title: '焦点图',
        dataIndex: 'bannerUrl',
        key: 'bannerUrl',
        render: (text, record) => {
          let img
          if (!text) {
            img = (
              <span />
            )
          } else {
            img = (
              <a href={text} target="_blank" style={{ width: 50, height: 50, display: 'inline-block', cursor: 'pointer' }}>
                <img width={50} height={50} src={text} alt="焦点图" />
              </a>
            )
          }
          return img
        }
      },
      {
        title: '跳转对象',
        dataIndex: 'contentTitle',
        key: 'contentTitle',
        render: (text, record) => {
          let url
          if (!text) {
            url = (
              <span />
            )
          } else {
            url = (
              <a href={record.contentUrl} target="_blank" style={{ display: 'block', cursor: 'pointer' }}>
                {text}
              </a>
            )
          }
          return url
        }
      },
      {
        title: '是否外链地址',
        dataIndex: 'isExternalUrl',
        key: 'isExternalUrl',
        render: (text, record) => {
          if (text === false) {
            text = '否'
          } else if (text === true) {
            text = '是'
          }
          return <span>{text}</span>
        }
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
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.props.tableData}
          pagination={false}
          scroll={{ x: 1400 }}
        />
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
