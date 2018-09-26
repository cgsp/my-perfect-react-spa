/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-26 10:03:37
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, message, Select, Modal } from 'antd'

import { myTrim } from '@Utils/myTrim'
import { ERR_OK } from '@Constants'
import { hasThisButton } from '@Utils/getButton'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import { connect } from 'react-redux'
import { getNavBarData } from '@Redux/navBar'

import { apiAuthAccountList, apiAuthAllUser, apiAuthAccountGetRoles, apiAuthAccountDeleteRole, apiAuthAccountUpdateRole, apiAuthAllRole } from '@Api/auth-account'

import AuthAccountListTable from './list-table'
import WrapperAuthAccountAddOrEdit from './add-or-edit'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

@connect(
  state => state.navBarReducer,
  { getNavBarData }
)
class AuthAccount extends Component {
  constructor() {
    super()
    this.state = {
      sortIndex: 1,
      sortDirection: 'down',
      tableTotal: 0,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      addOrEditVisible: false,
      addOrEditInitValues: {},
      userSelectData: [],
      roleSelectData: []
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
    // 模糊匹配
    this.handleAccountSelectChange = this.handleAccountSelectChange.bind(this)
    this.handleAccountSelectSearch = this.handleAccountSelectSearch.bind(this)
    this.timeout = null
    this.currentAccount = ''

    this.handleRoleSelectChange = this.handleRoleSelectChange.bind(this)
    this.handleRoleSelectSearch = this.handleRoleSelectSearch.bind(this)
    this.timeoutRole = null
    this.currentRole = ''
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.getListData({
      pageNo: 1,
      pageSize: 10,
      sortIndex: 1,
      sortDirection: 'down',
    })
  }

  // 点击排序
  clickSort(sortIndex, sortDirection) {
    this.setState({
      sortIndex,
      sortDirection
    })
    this.searchList()
  }

  // 点击查询
  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
      pageNo: 1
    }, () => {
      this.searchList()
    })
  }

  // 翻页或者每页尺寸改变
  pageOrPageSizeChange(current, pageSize) {
    this.setState({
      pageNo: current,
      pageSize
    }, () => {
      this.searchList()
    })
  }

  // 展示total
  showTableTotal(total) {
    return `共 ${total} 条`
  }


  // 查询列表的配套函数
  searchList(tip, callBack) {
    this.setState({
    }, () => {
      const state = this.state
      const {
        pageSize,
        pageNo,
        roleId,
        roleName,
        userIdAndName,
        userName,
        sortIndex,
        sortDirection,
      } = state
      const realName = userIdAndName ? userIdAndName.split('~~~~++++')[1] : undefined

      this.getListData({
        pageSize,
        pageNo,
        roleId,
        roleName,
        realName,
        userName,
        sortIndex,
        sortDirection,
        tip
      })
    })
  }

  // 处理导出options或者搜索options的配套函数
  handleSearchOrExportOptions(options) {
    // 去掉空格
    options.roleName = !options.roleName ? undefined : myTrim(options.roleName)
    options.userName = !options.userName ? undefined : myTrim(options.userName)

    // 处理排序的
    options.orderBy = options.sortIndex === 0 ? 'created_at' : 'updated_at'
    delete options.sortIndex
    options.desc = options.sortDirection === 'up' ? true : false
    delete options.sortDirection

    return options
  }

  // 获取列表页面的数据
  getListData(options) {
    this.refs.mask.show()
    options = this.handleSearchOrExportOptions(options)
    apiAuthAccountList(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.message)
          return
        }
        const data = JSON.parse(res.data)
        // console.log(data)
        let tableData
        if (data.total === 0) {
          tableData = []
        } else {
          tableData = data.data.map(item => {
            item.key = item.userId
            return item
          })
        }
        this.setState({
          tableData,
          tableTotal: data.total
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (options.tip) {
          message.success(`${options.tip}成功`)
        }
      })
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    console.log('编辑', line)
    let roleIds = []

    this.editUserId = line.userId

    const roles = line.roles.slice()
    roles.forEach(item => {
      roleIds.push(item.roleId)
    })

    line.oldRoles = roleIds

    this.refs.mask.show()
    apiAuthAccountGetRoles()
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.message)
          return
        }
        const data = JSON.parse(res.data).data
        // 获取角色的数据，然后传递给编辑的组件
        // 打开编辑组件
        this.setState({
          addOrEditTitle: '编辑角色',
          roleList: data,
          addOrEditVisible: true,
          addOrEditInitValues: { ...line, ...{ roleList: data } }
        })
      })
  }

  // 删除的逻辑
  tableLineDelete(line) {
    console.log(line)
    const that = this
    confirm({
      title: '确定要删除吗？',
      content: '',
      onOk() {
        that.refs.mask.show()
        apiAuthAccountDeleteRole(line.userId)
          .then(res => {
            that.refs.mask.hide()
            if (res.code !== ERR_OK) {
              message.error(res.message)
              return
            }
            that.refs.mask.show()
            that.props.getNavBarData(() => {
              that.refs.mask.hide()
              that.searchList('删除用户')
            })
          })
      },
      onCancel() { },
    })
  }

  // 新增或者编辑自运营专辑，添加标签，点击弹框的确定
  addOrEditOk(values) {
    values.userId = this.editUserId
    this.handleSelfTagAddOrEdit(values, () => {
      this.refs.mask.show()
      this.props.getNavBarData(() => {
        this.refs.mask.hide()
        this.setState({
          addOrEditVisible: false
        })
        // 刷新维度列表页面
        this.searchList('编辑')
      })
    })
  }

  handleSelfTagAddOrEdit(values, callback) {
    this.refs.mask.show()
    // 编辑的api
    apiAuthAccountUpdateRole(values)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.message)
          return
        }
        callback && callback()
      })
  }

  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.editUserId = null
    this.setState({
      addOrEditVisible: false
    })
  }

  // 真实姓名的模糊匹配
  handleAccountSelectSearch(value) {
    // console.log(value)
    this.getSelectUserList(value, data => this.setState({ userSelectData: data }))
  }

  // 角色的模糊匹配
  handleRoleSelectSearch(value) {
    // console.log(value)
    this.getSelectRoleList(value, data => this.setState({ roleSelectData: data }))
  }

  // 真实姓名的模糊匹配
  getSelectUserList(value, callback) {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.currentAccount = value

    const options = {
      realName: value
    }
    this.timeout = setTimeout(() => {
      this.refs.mask.show()
      apiAuthAllUser(options)
        .then(res => {
          this.refs.mask.hide()
          if (this.currentAccount === value) {
            if (res.code !== ERR_OK) {
              message.error(res.msg)
              return
            }
            // 只取前面的20条
            let result = JSON.parse(res.data).slice(0, 20)
            if (!result) {
              result = []
            }
            const arr = []
            result.forEach(item => {
              arr.push({
                value: item.userCode,
                text: item.realName
              })
            })
            console.log(res)
            callback(arr)
          }
        })
    }, 300)

  }

  // 角色的模糊匹配
  getSelectRoleList(value, callback) {
    this.timeoutRole = null
    if (this.timeoutRole) {
      clearTimeout(this.timeoutRole)
      this.timeoutRole = null
    }
    this.currentRole = value

    const options = {
      roleName: value
    }
    this.timeout = setTimeout(() => {
      this.refs.mask.show()
      apiAuthAllRole(options)
        .then(res => {
          this.refs.mask.hide()
          if (this.currentRole === value) {
            if (res.code !== ERR_OK) {
              message.error(res.msg)
              return
            }
            // 只取前面的20条
            let result = JSON.parse(res.data).data
            console.log(result)
            if (!result) {
              result = []
            }

            const arr = []
            result.forEach(item => {
              arr.push({
                value: item.roleId,
                text: item.roleName
              })
            })
            console.log(res)
            callback(arr)
          }
        })
    }, 300)

  }


  // 真实姓名的模糊匹配
  handleAccountSelectChange(value) {
    this.setState({
      userIdAndName: value,
    }, () => {
      console.log(this.state.userIdAndName)
    })
  }

  // 角色的模糊匹配
  handleRoleSelectChange(value) {
    this.setState({
      roleId: value,
    }, () => {
      console.log(this.state.roleId)
    })
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    return (
      <div className="auth-account">
        {/* 搜索 */}
        {
          hasThisButton('auth-account', '查询') ?
            <List className="search-list" bordered>
              <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
                layout="inline"
              >
                <Col span={8}>
                  <FormItem
                    className="form-item"
                    label={<span className="form-label">角色姓名:</span>}
                    colon={false}
                  >
                    <Select
                      showSearch
                      style={{ width: 190 }}
                      placeholder="请输入真实姓名"
                      allowClear={true}
                      value={this.state.roleId}
                      onSearch={this.handleRoleSelectSearch}
                      onChange={this.handleRoleSelectChange}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={'根据此关键字，无法搜索'}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {
                        this.state.roleSelectData.map(item => (
                          <Option key={item.value}>{item.text}</Option>
                        ))
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    className="form-item"
                    label={<span className="form-label">用户名:</span>}
                    colon={false}
                  >
                    <Input style={{ width: 190 }} placeholder="请输入用户名" onChange={e => this.setState({ userName: e.target.value })} />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    className="form-item"
                    label={<span className="form-label">真实姓名:</span>}
                    colon={false}
                  >
                    <Select
                      showSearch
                      style={{ width: 190 }}
                      placeholder="请输入真实姓名"
                      allowClear={true}
                      value={this.state.userIdAndName}
                      onSearch={this.handleAccountSelectSearch}
                      onChange={this.handleAccountSelectChange}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={'根据此关键字，无法搜索'}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {
                        this.state.userSelectData.map(item => (
                          <Option key={`${item.value}~~~~++++${item.text}`}>{item.text}</Option>
                        ))
                      }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8} className="search-btn">
                  <Button className="searchBtn" type="primary" htmlType="submit">查询</Button>
                </Col>
              </Form>
            </List>
            : null
        }
        {/* 表头功能按钮 */}
        <List className="handle-buttons">
          <Row>
            <Col span={24} className="line">
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <AuthAccountListTable {...tableOptions} />
        {
          this.state.addOrEditVisible
            ?
            <WrapperAuthAccountAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthAccount)
export default WrappedAdvancedSearchForm
