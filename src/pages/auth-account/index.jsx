/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-20 23:13:34
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Select, Modal } from 'antd'
import AuthAccountListTable from './list-table'
import AddOrEditAccount from './add-or-edit-account'
import MaskLoading from '@Components/mask-loading'
import { myTrim } from '@Utils/myTrim'
import { apiGetUserList, apiGetAuthAccountPageRolesList, apiGetAuthAccountList, apiGetAuthAccountPageDeleteLine, apiGetAuthAccountPageAddLine } from '@Api'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm


class AuthAccount extends Component {
  constructor() {
    super()
    this.state = {
      userValue: undefined,
      userSelectOptionsData: [],
      roleValue: undefined,
      roleSelectOptionsData: [],
      tableTotal: 0,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      modalTitle: '新增用户',
      modalVisible: false,
      modalConfirmLoading: false,
      modalUserValue: undefined,
      modalUserSelectOptionsData: [],
      modalRoleValue: undefined,
      modalRoleSelectOptionsData: [],
    }
    this.timeout = null
    this.currentUserValue = ''
    this.modalTimeout = null
    this.modalCurrentUserValue = ''
    this.handleRoleSelectChange = this.handleRoleSelectChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSelectSearch = this.handleSelectSearch.bind(this)
    this.onTableShowSizeChange = this.onTableShowSizeChange.bind(this)
    this.onTablePageChange = this.onTablePageChange.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.modalOk = this.modalOk.bind(this)
    this.modalCancel = this.modalCancel.bind(this)
    this.modalHandleSelectChange = this.modalHandleSelectChange.bind(this)
    this.modalHandleSelectSearch = this.modalHandleSelectSearch.bind(this)
    this.modalHandleRoleSelectChange = this.modalHandleRoleSelectChange.bind(this)
  }

  componentDidMount() {
    // 获取表格数据
    this.getListData({
      page: 1,
      pageSize: 10,
      rolename: '',
      username: '',
    })
    // 获取角色数据
    this.getRolesList()
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
        }, () => {
          this.getListData({
            page: this.state.currentPage,
            pageSize: this.state.pageSize,
            rolename: this.state.roleValue === undefined ? '' : myTrim(this.state.roleValue),
            username: this.state.userValue === undefined ? '' : myTrim(this.state.userValue)
          })
        })
      } else {
        // 处理错误
      }
    })
  }

  getSelectUserList(value, callback) {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.currentUserValue = value
    this.timeout = setTimeout(() => {
      apiGetUserList(value)
        .then(res => res.json())
        .then(d => {
          if (this.currentUserValue === value) {
            const result = d.result
            const arr = []
            result.forEach(item => {
              arr.push({
                value: item[1],
                text: item[0]
              })
            })
            callback(arr)
          }
        })
    }, 300)

  }

  handleSelectSearch(value) {
    // console.log(value)
    this.getSelectUserList(value, data => this.setState({ userSelectOptionsData: data }))
  }

  handleSelectChange(value) {
    this.setState({
      userValue: value,
    })
  }

  handleRoleSelectChange(value) {
    this.setState({
      roleValue: value,
    })
  }



  tableLineDelete(line) {
    const that = this
    confirm({
      title: '确定要删除吗？',
      content: '',
      onOk() {
        that.refs.mask.show()
        apiGetAuthAccountPageDeleteLine({ id: line.id })
          .then(res => {
            // 将列表页面重新刷新
            that.setState({
            }, () => {
              that.getListData({
                page: 1,
                pageSize: that.state.pageSize,
                rolename: that.state.roleValue === undefined ? '' : myTrim(that.state.roleValue),
                username: that.state.userValue === undefined ? '' : myTrim(that.state.userValue)
              })
            })
          })
      },
      onCancel() { },
    })
  }


  onTableShowSizeChange(current, pageSize) {
    console.log(current, pageSize)
    this.setState({
      currentPage: current,
      pageSize
    }, () => {
      this.getListData({
        page: this.state.currentPage,
        pageSize: this.state.pageSize,
        rolename: this.state.roleValue,
        username: this.state.userValue === undefined ? '' : myTrim(this.state.userValue)
      })
    })
  }

  onTablePageChange(current, pageSize) {
    console.log(current, pageSize)
    this.setState({
      currentPage: current,
      pageSize
    }, () => {

      this.getListData({
        page: this.state.currentPage,
        pageSize: this.state.pageSize,
        rolename: this.state.roleValue,
        username: this.state.userValue === undefined ? '' : myTrim(this.state.userValue)
      })
    })
  }

  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData({ page, pageSize, rolename, username }) {
    this.refs.mask.show()
    apiGetAuthAccountList({ page, pageSize, rolename, username })
      .then(res => {
        this.refs.mask.hide()
        const tableData = res.map(item => {
          item.key = item.id
          return item
        })
        this.setState({
          tableData: tableData,
          tableTotal: tableData.length
        })
      })
  }

  // 获取角色数据
  getRolesList() {
    this.refs.mask.show()
    apiGetAuthAccountPageRolesList()
      .then(res => {
        this.refs.mask.hide()
        this.setState({
          roleSelectOptionsData: res,
          modalRoleSelectOptionsData: res
        })
      })
  }

  addAccount() {
    this.setState({
      modalVisible: true,
      modalRoleValue: undefined,
      modalUserValue: undefined
    })
  }

  // 编辑
  tableLineEdit(line) {
    console.log(line)
    this.setState({
      modalTitle: '修改用户',
      modalVisible: true,
      modalRoleValue: line.rolename.split(','),
      modalUserValue: line.username
    })
  }

  modalOk(title) {
    this.setState({
      modalConfirmLoading: true
    })
    if (title === '新增用户') {
      this.setState({},
        () => {
          const username = this.state.modalUserValue === undefined ? '' : this.state.modalUserValue
          const roleArr = this.state.modalRoleValue === undefined ? [] : this.state.modalRoleValue
          // console.log(username)
          // console.log(roleArr)
          apiGetAuthAccountPageAddLine({ username, roleArr })
            .then(res => {
              this.setState({
                modalVisible: false,
                modalConfirmLoading: false,
              })
              // 刷新列表页面
              this.getListData({
                page: 1,
                pageSize: this.state.pageSize,
                rolename: this.state.roleValue === undefined ? '' : myTrim(this.state.roleValue),
                username: this.state.userValue === undefined ? '' : myTrim(this.state.userValue)
              })
            })
        }
      )
    }

    if (title === '修改用户') {
      this.setState({},
        () => {
          const username = this.state.modalUserValue === undefined ? '' : this.state.modalUserValue
          const roleArr = this.state.modalRoleValue === undefined ? [] : this.state.modalRoleValue
          // console.log(username)
          // console.log(roleArr)
          apiGetAuthAccountPageAddLine({ username, roleArr })
            .then(res => {
              this.setState({
                modalVisible: false,
                modalConfirmLoading: false,
              })
              // 刷新列表页面
              this.getListData({
                page: 1,
                pageSize: this.state.pageSize,
                rolename: this.state.roleValue === undefined ? '' : myTrim(this.state.roleValue),
                username: this.state.userValue === undefined ? '' : myTrim(this.state.userValue)
              })
            })
        }
      )
    }
  }

  modalCancel() {
    this.setState({
      modalVisible: false,
    })
  }

  getModalSelectUserList(value, callback) {
    if (this.modalTimeout) {
      clearTimeout(this.modalTimeout)
      this.modalTimeout = null
    }
    this.modalCurrentUserValue = value
    this.modalTimeout = setTimeout(() => {
      apiGetUserList(value)
        .then(res => res.json())
        .then(d => {
          if (this.modalCurrentUserValue === value) {
            const result = d.result
            const arr = []
            result.forEach(item => {
              arr.push({
                value: item[1],
                text: item[0]
              })
            })
            callback(arr)
          }
        })
    }, 300)
  }

  modalHandleSelectSearch(value) {
    // console.log(value)
    this.getModalSelectUserList(value, data => this.setState({ modalUserSelectOptionsData: data }))
  }

  modalHandleSelectChange(value) {
    console.log(value)
    this.setState({
      modalUserValue: value,
    })
  }

  modalHandleRoleSelectChange(value) {
    this.setState({
      modalRoleValue: value,
    })
  }


  render() {
    const tableOptions = {
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      onShowSizeChange: this.onTableShowSizeChange,
      onChange: this.onTablePageChange,
      total: this.state.tableTotal,
      showTotal: this.showTableTotal,
      tableData: this.state.tableData
    }

    const modalOptions = {
      modalTitle: this.state.modalTitle,
      modalVisible: this.state.modalVisible,
      modalOk: this.modalOk,
      modalConfirmLoading: this.state.modalConfirmLoading,
      modalCancel: this.modalCancel,
      modalHandleSelectChange: this.modalHandleSelectChange,
      modalHandleSelectSearch: this.modalHandleSelectSearch,
      modalHandleRoleSelectChange: this.modalHandleRoleSelectChange,
      modalRoleSelectOptionsData: this.state.modalRoleSelectOptionsData,
      modalUserSelectOptionsData: this.state.modalUserSelectOptionsData,
      modalUserValue: this.state.modalUserValue,
      modalRoleValue: this.state.modalRoleValue,

    }
    return (
      <div>
        {/* 搜索 */}
        <List bordered style={{ paddingLeft: 10, marginBottom: 30 }}>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="inline"
          >
            <Row>
              <Col span={8}>
                <FormItem label="角色名称" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    style={{ width: 200, marginTop: 4 }}
                    placeholder="请选择角色"
                    allowClear={true}
                    onChange={this.handleRoleSelectChange}
                  >
                    {
                      this.state.roleSelectOptionsData.map(item => (
                        <Option key={item.key}>{item.text}</Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="用户名称" style={{ marginBottom: 0, marginTop: 10 }}>
                  <Select
                    showSearch
                    style={{ width: 200, marginTop: 4 }}
                    placeholder="请输入搜索关键字"
                    allowClear={true}
                    value={this.state.userValue}
                    onSearch={this.handleSelectSearch}
                    onChange={this.handleSelectChange}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={'根据此关键字，无法搜索'}
                  >
                    {
                      this.state.userSelectOptionsData.map(item => (
                        <Option key={item.value}>{item.text}</Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'left', marginTop: 14 }}>
                <Button type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List style={{ marginBottom: 30 }}>
          <Row>
            <Col span={8} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={() => this.addAccount()}>新增用户</Button>
            </Col>
          </Row>
        </List>
        <AuthAccountListTable {...tableOptions} />
        <AddOrEditAccount {...modalOptions} />
        <MaskLoading ref="mask" />
      </div>

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthAccount)
export default WrappedAdvancedSearchForm
