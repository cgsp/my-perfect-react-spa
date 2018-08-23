import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import { myGetStrTime } from '@Utils/myGetTime'
import { PropTypes } from 'prop-types'

export default class SelfListenListTable extends Component {
  static propTypes = {
    total: PropTypes.number,
    tableLineSave: PropTypes.func,
    tableLineShowDetails: PropTypes.func,
    tableSelect: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    onChange: PropTypes.func,
    showTotal: PropTypes.func,
    tableData: PropTypes.array
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
    const columns = [{
      title: '主站Id',
      dataIndex: 'mainId',
      key: 'mainId'
    }, {
      title: '自运营Id',
      dataIndex: 'selfId',
      key: 'selfId',
    },
    {
      title: '听单名称',
      dataIndex: 'listenName',
      key: 'listenName',
    },
    {
      title: '听单封面',
      dataIndex: 'pic',
      key: 'pic',
      render: (text, record) => {
        let img
        if (!text) {
          img = (
            <span />
          )
        } else {
          img = (
            <a href={text} target="_blank" style={{ width: 50, height: 50, display: 'inline-block', cursor: 'pointer' }}>
              <img width={50} height={50} src={text} alt="听单封面" />
            </a>
          )
        }
        return img
      }
    },
    {
      title: '听单类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '分类',
      dataIndex: 'classfiy',
      key: 'classfiy',
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
      dataIndex: 'state',
      key: 'state',
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
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (<span>
          <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.tableLineSave(record)}>另存为</i>
        </span>)
      },
    }]
    return (
      <div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={this.props.tableData} pagination={false} scroll={{ x: 1500 }} />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={1}
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
