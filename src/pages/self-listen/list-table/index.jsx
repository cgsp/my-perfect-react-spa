import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'
import { hasThisButton } from '@Utils/getButton'

export default class SelfListenListTable extends Component {
  static propTypes = {
    total: PropTypes.number,
    tableLineEdit: PropTypes.func,
    tableLineShowDetails: PropTypes.func,
    tableSelect: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    onChange: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array,
    pageNo: PropTypes.number,
  }

  // onSelectChange = (selectedRowKeys) => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   this.setState({ selectedRowKeys });
  // }



  render() {
    const rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys,
      onChange: this.props.tableSelect,
    }
    let columns = [{
      title: '自运营Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '听单名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        const old = text
        let newtext
        if (text.length > 15) {
          newtext = text.substr(0, 14) + '...'
        } else {
          newtext = text
        }
        return <span style={{ cursor: 'pointer' }} title={old}>{newtext}</span>
      }
    },
    {
      title: '听单封面',
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
              <img width={50} height={50} src={record.coverUrlLarge} alt="听单封面" />
            </a>
          )
        }
        return img
      }
    },
    {
      title: '听单类型',
      dataIndex: 'contentType',
      key: 'contentType',
      render: (text, record) => {
        switch (text) {
          case 1:
            text = '专辑'
            break
          case 2:
            text = '声音'
          default:
            break
        }
        return <span>{text}</span>
      }
    },
    {
      title: '分类来源',
      dataIndex: 'source',
      key: 'source',
      render: (text, record) => (
        <span>{text === 1 ? '主站' : '自运营'}</span>
      )
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '内容数',
      dataIndex: 'contentNum',
      key: 'contentNum',
      render: (text, record) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineShowDetails(record)}>{text}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
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
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (<span>
          <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineEdit(record)}>编辑</i>
        </span>)
      },
    }]
    if (!hasThisButton('self-listen', '编辑')) {
      columns.pop(columns.length - 1)
    }
    return (
      <div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1300 }} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={1}
            current={this.props.pageNo}
            onShowSizeChange={this.props.onShowSizeChange}
            onChange={this.props.onChange}
            total={this.props.total}
            showTotal={this.props.showTotal}
          />
        </div>
      </div>
    )
  }
}
