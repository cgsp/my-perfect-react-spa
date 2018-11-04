import React, { Component } from 'react'
import { Form, Input, Table, Pagination } from 'antd'
import './style.scss'
// import { toJS } from 'mobx'
import CashSearch from './CashSearch'
import SettingModal from '@Components/Setting/SettingModal'
// import { inject, observer } from 'mobx-react'
// const { Option } = Select
const { TextArea } = Input
const { Item } = Form
const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}
const data = [{
  id: '什么值得买',
  name: '3743894392721',
  desc: '金融线',
  action: '操作',
  key: 1,
  money: '¥10000.0',
  middle: '¥0.00',
  status: '停用',
  time: '2028-05-09 18:00:00'
}]

// @inject('cashAccount')
// @observer
export default class CashManage extends Component {
  state = {
    addModal: false,
    editModal: false,
    addUserModal: false,
    deleteModal: false,
    editInitData: {
      name: '',
      desc: ''
    },
    pageCurrent: 1,
  }

  componentDidMount() {
    // this.props.cashAccount.fetchCashList()
  }


  handleConfirm = () => {
    this.suggestModal.validateFieldsAndScroll((errors, values) => {
      if (errors) return

      if (values.auditFailReason) {
        console.log('调取停用接口')
        this.setState({ editModal: false })
      }


    })
  }

  handleEdit = (record) => {
    this.setState({ editModal: true, editInitData: { name: record.name, desc: record.desc } })
    console.log('编辑数据', record, this.state.editInitData)
  }

  closeEditModal = () => {
    this.setState({ editModal: false })
  }

  handleDetail = (record) => {
    this.props.history.push(`/!F1-fee/!S2-cash/!T3-account/!F4-detail/${1}`)
  }


  render() {
    const context = this
    const columns = [
      {

        dataIndex: 'id',
        title: '开发者名称'
      },
      {

        dataIndex: 'name',
        title: '开发者ID'
      },
      {

        dataIndex: 'desc',
        title: '所属渠道'
      },
      {

        dataIndex: 'money',
        title: '现金账户余额'
      },
      {

        dataIndex: 'middle',
        title: '提现中金额'
      },
      {

        dataIndex: 'time',
        title: '创建时间',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        dataIndex: 'status',
        title: '状态'
      },
      {
        key: 'action',
        title: '操作',
        render(_, record, index) {
          return (
            <div>
              <a style={{ marginRight: '20px' }} onClick={() => context.handleEdit(record, index)}>停用 </a>
              <a onClick={() => context.handleDetail(record, index)}>账户详情 </a>
            </div>
          )
        }
      }
    ]

    return (
      <div className="role-content-container">
        <p className="role-title">现金账户管理</p>
        <CashSearch />
        <Table className="table"
          columns={columns}
          dataSource={data}
          scroll={{ x: 2000 }}
          pagination={false}
        />
        <div style={{ textAlign: 'right', marginTop: 30 }}>
          <Pagination
            showSizeChanger
            showQuickJumper
            defaultCurrent={this.state.current}
            total={10}
            showTotal={total => `共 ${total} 条`}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.pageChange}
            current={this.state.pageCurrent}
          />
        </div>
        <SettingModal
          title="停用现金账户"
          handleCancel={this.closeEditModal}
          visible={this.state.editModal}
          handleOk={this.handleConfirm}
          content={<SuggestForm ref={ref => (this.suggestModal = ref)} />}
        />
      </div>
    )
  }
}

const SuggestForm = Form.create()(props => {
  const { getFieldDecorator } = props.form
  return (
    <Form layout="inline">
      <Item {...formLayout} label="停用意见" className="reject-textArea">
        {getFieldDecorator('auditFailReason', {
          rules: [
            {
              required: true,
              message: '请填写停用意见'
            }
          ]
        })(<TextArea id="taContent" rows={4}
          maxLength="100"
          placeholder="请输入停用意见,最多可输入100个字符"
        />)}
      </Item>
    </Form>)
})

