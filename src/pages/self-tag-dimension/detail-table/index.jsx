import React, { Component } from 'react'
import { Modal, Pagination, Table, Divider } from 'antd'
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
    const columns = [{
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
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
    }, {
      title: '创建人',
      dataIndex: 'operator',
      key: 'operator'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <i style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.props.detailLineEditOrDelete(record, '编辑')}>编辑</i>
            <Divider type="vertical" />
            <i style={{ color: 'red', cursor: 'pointer' }} onClick={() => this.props.detailLineEditOrDelete(record, '删除')}>删除</i>
          </span>)
      },
    }]
    return (
      <Modal
        title={`标签列表（维度名称：${this.props.detailTitleObj.title}）`}
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
