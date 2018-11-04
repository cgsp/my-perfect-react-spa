/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-10-31 11:30:23
 */
import React, { Component } from 'react'
import { Form, Row, Col, Button, Input, message, Select, Modal } from 'antd'
import { inject, observer } from 'mobx-react'
// import moment from 'moment'
import TimeControlHoc from '@Components/time-control-hoc'
import { SUCCESS_OK } from '@Constants'
import { http } from '@Service'
// import { myTransTimeObjToStampTime } from '@Utils/my-get-time'
import { apiAllUserList, apiGetRoles, apiCleanUserRoles, apiFirstBusChannel, apiUserBindRoles } from '@Service/setting'
import ListTable from './list-table'
import AddOrEdit from './add-or-edit'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

@inject('SettingAuthNavBar')
@observer
@TimeControlHoc
class SettingAuthAccount extends Component {
  constructor() {
    super()
    this.state = {
      tableTotal: 0,
      tableData: [],
      current: 1,
      pageSize: 10,
      orderBy: 'updated_at',
      desc: true,
      addOrEditVisible: false,
      addOrEditInitValues: {},
      roleSelectData: [],
      expand: false,
      expandName: '展开'
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.searchList({})
    this.getAllRoles()
  }

  // 列表的排序
  clickSort(orderBy, desc) {
    this.setState({
      orderBy, desc
    })
    this.searchList({})
  }

  // 列表页面翻页或者每页尺寸改变
  pageOrPageSizeChange(current, pageSize) {
    this.setState({
      current,
      pageSize
    })
    this.searchList({})
  }

  // 列表页面展示total
  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData(options) {
    const tip = options.tip
    if (options.tip) {
      delete options.tip
    }
    http.get(apiAllUserList, options)
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }
        const data = res.data
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
        if (tip) {
          message.success(`${tip}成功`)
        }
      })
  }

  searchList(values) {
    this.setState({}, () => {
      const { pageSize, current, orderBy, desc } = this.state
      let searchFormValues = this.props.form.getFieldsValue()
      values = {
        ...values,
        ...searchFormValues,
        pageSize, current, orderBy, desc
      }
      this.getListData(values)
    })
  }

  // 获取所有的角色
  getAllRoles() {
    http.get(apiGetRoles)
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }
        if (res.data.total) {
          this.setState({
            roleSelectData: res.data.data
          })
        }
      })
  }

  // 列表页面的编辑
  async tableLineEdit(line) {
    try {
      let roleIds = []
      let rolesIdAndNames = []
      this.editUserId = line.userId
      const roles = line.roles.slice()
      roles.forEach(item => {
        roleIds.push(item.roleId)
        rolesIdAndNames.push(`${item.roleId}~~${item.roleName}`)
      })

      line.oldRolesIds = roleIds
      line.oldRolesIdAndNames = rolesIdAndNames

      const roleRes = await http.get(apiGetRoles)
      if (roleRes.code !== SUCCESS_OK) {
        message.error(roleRes.message)
        return
      }
      const firstBusinessRes = await http.get(apiFirstBusChannel)
      if (firstBusinessRes.code !== SUCCESS_OK) {
        message.error(firstBusinessRes.message)
        return
      }
      this.setState({
        addOrEditTitle: '编辑',
        addOrEditVisible: true,
        addOrEditInitValues: {
          ...line,
          ...{ roleList: roleRes.data.data, businessList: firstBusinessRes.data }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 删除的逻辑
  tableLineDelete(line) {
    console.log(line)
    const that = this
    confirm({
      title: '确定要清空吗？',
      content: '',
      onOk() {
        http.post(apiCleanUserRoles, {
          userId: line.userId
        })
          .then(res => {
            if (res.code !== SUCCESS_OK) {
              message.error(res.message)
              return
            }
            that.props.SettingAuthNavBar.geteUserNavBarData(() => {
              that.searchList({
                tip: '清空角色'
              })
            })
          })
      },
      onCancel() { },
    })
  }

  // 新增或者编辑自运营专辑，添加标签，点击弹框的确定
  async addOrEditOk(values) {
    try {
      values.userId = this.editUserId
      const res = await http.post(apiUserBindRoles, values)
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }
      this.props.SettingAuthNavBar.geteUserNavBarData(() => {
        this.searchList({
          tip: '编辑'
        })
        this.editUserId = null
        this.setState({
          addOrEditVisible: false
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.editUserId = null
    this.setState({
      addOrEditVisible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
      current: 1
    })
    this.props.form.validateFields((err, values) => {
      this.searchList(values)
    });
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  // 初始化表格的搜索框
  getSearchFields() {
    const show = true
    const { roleSelectData } = this.state
    const { getFieldDecorator } = this.props.form;
    const searchField =
      [
        <Col span={8} key={1}>
          <FormItem label={'真实姓名'}>
            {getFieldDecorator('realName', {
              rules: [],
            })(
              <Input placeholder="请输入真实姓名" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={2} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'角色名'}
          >
            {getFieldDecorator('roleId', {
              rules: [],
            })(
              <Select
                placeholder="请选择角色名"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="数据加载中..."
              >
                {
                  roleSelectData.map(item => [
                    <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>,
                  ])
                }
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={3} style={{ textAlign: 'right', paddingTop: 6 }}>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
        </Col>
      ]
    return searchField
  }

  render() {
    const tableOptions = {
      orderBy: this.state.orderBy,
      desc: this.state.desc,
      clickSort: this.clickSort,
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      current: this.state.current
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    return (
      <div className="setting-auth-account">
        <div className="app-content-title">
          账号管理
        </div>
        {/* 搜索区域 */}
        <Form
          className="ant-advanced-search-form app-serach-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={5}>{this.getSearchFields()}</Row>
        </Form>
        {/* 表格区域 */}
        <ListTable {...tableOptions} />
        {/* 编辑弹框 */}
        {
          this.state.addOrEditVisible
            ?
            <AddOrEdit {...addOrEditOptions} />
            : null
        }
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SettingAuthAccount)
export default WrappedAdvancedSearchForm
