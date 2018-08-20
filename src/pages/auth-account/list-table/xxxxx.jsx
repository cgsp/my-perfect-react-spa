import React, { Component } from 'react'
import { Table, Icon, Divider } from 'antd'

const columns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="javascript:">{text}</a>,
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => {
    // console.log(record)
    return (<span>
      <a href="javascript:">Action 一 {record.age}</a>
      <Divider type="vertical" />
      <a href="javascript:">Delete</a>
      <Divider type="vertical" />
      <a href="javascript:" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>)
  },
}]

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}]


export default class AuthAccountListTable extends Component {

  constructor() {
    super()
    this.state = {
      selectedRowKeys: []
    }
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }


  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }

    return (
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    )
  }
}
