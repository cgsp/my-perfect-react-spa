/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-10-30 15:46:32
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, message, Modal } from 'antd'
import { inject, observer } from 'mobx-react'
import MaskLoading from '@Components/my-mask'
import TimeControlHoc from '@Components/time-control-hoc'
import { SUCCESS_OK } from '@Constants'
import { http } from '@Service'
import { myGetPingFromTree } from '@Utils/my-get-ping-form-tree'
import { myCompareArr } from '@Utils/my-compare-arr'
import { apiGetRoles, apiDeleteRole, apiRoleUpdate, apiRoleAdd, apiGetOneRoleMenuAndButtonIds, apiGetAuthTree } from '@Service/setting'
import ListTable from './list-table'
import AddOrEdit from './add-or-edit'
import Auth from './auth'
import './style.scss'

const FormItem = Form.Item
// const Option = Select.Option
const confirm = Modal.confirm

@inject('SettingAuthNavBar')
@observer
@TimeControlHoc
class SettingAuthRole extends Component {
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
      expand: false,
      expandName: '展开',
      checkedKeys: [],
      checkedNodes: [],
      authDataTree: [],
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineAuth = this.tableLineAuth.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
    this.addRole = this.addRole.bind(this)
    this.authTreeOnCheck = this.authTreeOnCheck.bind(this)
    this.authCancel = this.authCancel.bind(this)
    this.authOk = this.authOk.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.searchList({})
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
    http.get(apiGetRoles, options)
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
            item.key = item.roleId
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

  // 删除的逻辑
  tableLineDelete(line) {
    const that = this
    confirm({
      title: '确定要删除吗？',
      content: '',
      onOk() {
        http.post(apiDeleteRole, [line.roleId])
          .then(res => {
            if (res.code !== SUCCESS_OK) {
              message.error(res.message)
              return
            }
            that.props.SettingAuthNavBar.geteUserNavBarData(() => {
              that.searchList({
                tip: '删除角色'
              })
            })
          })
      },
      onCancel() { },
    })
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    this.editRoleId = line.roleId
    this.setState({
      addOrEditTitle: '编辑角色',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
  }

  addRole() {
    this.setState({
      addOrEditVisible: true,
      addOrEditTitle: '新增角色',
      addOrEditInitValues: {}
    })
  }

  // 新增或者编辑自运营专辑，添加标签，点击弹框的确定
  async addOrEditOk(values, title) {
    try {
      let res
      if (title === '编辑角色') {
        values.roleId = this.editRoleId
        values.addBindResourcesIds = []
        values.unbindResourcesIds = []
        res = await http.post(apiRoleUpdate, values)
      } else {
        values.resourceIds = []
        res = await http.post(apiRoleAdd, values)
      }
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }

      this.searchList({
        tip: title
      })
      this.editRoleId = null
      this.setState({
        addOrEditVisible: false
      })

    } catch (error) {
      console.log(error)
    }
  }

  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.editRoleId = null
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
    // const show = true
    const { getFieldDecorator } = this.props.form;
    const searchField =
      [
        <Col span={8} key={1}>
          <FormItem label={'角色名'}>
            {getFieldDecorator('roleName', {
              rules: [],
            })(
              <Input placeholder="请输入角色名" autoComplete="off" />
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

  authTreeOnCheck(checkedKeys, e) {
    // console.log('onCheck', checkedKeys)
    // console.log('halfChecked', e.halfCheckedKeys)
    this.setState(
      {
        checkedKeys,
        checkedNodes: e.halfCheckedKeys.concat(checkedKeys)
      })
  }

  // 权限设置，其实也就是权限的编辑
  async tableLineAuth(line) {
    try {
      // 获取当前账号被勾选的节点（包含半勾与全勾的），同时获取整个树形的，平铺的节点
      const oneRes = await http.get(apiGetOneRoleMenuAndButtonIds, {
        roleId: line.roleId
      })
      if (oneRes.code !== SUCCESS_OK) {
        message.error(oneRes.message)
        return
      }
      const treeRes = await http.get(apiGetAuthTree, {
        isShowAdminResource: false
      })
      if (treeRes.code !== SUCCESS_OK) {
        message.error(treeRes.message)
        return
      }
      // 树形的全部菜单与按钮
      const authDataTree = JSON.parse(treeRes.data).childResources

      this.refs.mask.show()

      // 平铺的树形全部的数据
      // const resDataResources = oneRes.data.resources
      const resDataResources = myGetPingFromTree(authDataTree)
      // console.log(resDataResources)
      // console.log(authDataTree)

      // 旧的被勾选的数据，包括半勾的和全勾的
      const resDataChecked = oneRes.data.selectIds
      // 旧的被勾选的数据，包括半勾的和全勾的--保存一下
      this.oldSelectIds = resDataChecked
      // 旧的被勾选的数据，roleId--保存一下
      this.authRoleId = line.roleId
      this.authRoleName = line.roleName
      this.authRoleCode = line.roleCode
      this.authDesc = line.desc
      let checked = []
      let checkedAndHalf = []

      // 循环获取全勾的数据
      for (let i = 0; i < resDataResources.length; i++) {
        const item = resDataResources[i]
        if (resDataChecked.indexOf(item.resourceId) > -1) {
          checkedAndHalf.push(item.resourceId)

          let itemChildrenAllChecked = true

          // 如果这个节点，是四级，也就是按钮的话，直接要
          if (item.type === 4 && resDataChecked.indexOf(item.resourceId) > -1) {
            itemChildrenAllChecked = true
          }

          // 如果这个节点是三级菜单，需要看下其下面的四级节点，是否全部被勾选
          if (item.type === 3 && item.level === 3 && resDataChecked.indexOf(item.resourceId) > -1) {
            for (let j = 0; j < resDataResources.length; j++) {
              const ele = resDataResources[j]
              if (ele.parentId === item.resourceId && resDataChecked.indexOf(ele.resourceId) === -1) {
                itemChildrenAllChecked = false
                break
              }
            }
          }

          // 如果这个节点是二级菜单，首先看下其下面的三级菜单或者按钮有没有全部被勾选，再看下其下面的按钮有没有全部被勾选，没得话，不要
          if (item.type === 3 && item.level === 2 && resDataChecked.indexOf(item.resourceId) > -1) {
            for (let j = 0; j < resDataResources.length; j++) {
              const ele = resDataResources[j]
              if (ele.parentId === item.resourceId && resDataChecked.indexOf(ele.resourceId) === -1) {
                itemChildrenAllChecked = false
                break
              }
            }
          }
          // 这个节点是二级，下面的三级都被勾选了，那么看看，三级下面的按钮，有没有被勾选
          if (item.type === 3 && item.level === 2 && resDataChecked.indexOf(item.resourceId) > -1 && itemChildrenAllChecked) {
            for (let j = 0; j < resDataResources.length; j++) {
              const ele = resDataResources[j]
              if (ele.parentId === item.resourceId) {
                for (let x = 0; x < resDataResources.length; x++) {
                  const xe = resDataResources[x]
                  if (xe.parentId === ele.resourceId && resDataChecked.indexOf(xe.resourceId) === -1) {
                    itemChildrenAllChecked = false
                    break
                  }
                }
              }
            }
          }

          // 如果这个节点是一级，且这个一级节点有孩子，那么直接不要
          // 如果这个节点是一级，且没孩子，那么直接要
          if (item.type === 3 && item.level === 1 && resDataChecked.indexOf(item.resourceId) > -1) {
            let noChild = true
            for (let j = 0; j < resDataResources.length; j++) {
              const ele = resDataResources[j]
              if (ele.parentId === item.resourceId) {
                noChild = false
                break
              }
            }
            if (noChild) {
              itemChildrenAllChecked = true
            } else {
              itemChildrenAllChecked = false
            }
          }


          // for (let j = 0; j < resDataResources.length; j++) {
          //   const ele = resDataResources[j]
          //   // 对一层的节点进行遍历
          //   if (ele.parentId === item.resourceId && resDataChecked.indexOf(ele.resourceId) === -1) {
          //     itemChildrenAllChecked = false
          //   }
          // }
          // 对第二层的节点进行遍历
          if (itemChildrenAllChecked) {
            checked.push(item.resourceId)
          }
        }
      }

      this.refs.mask.hide()
      this.setState({
        authTitle: `权限管理-${line.roleName}`,
        authVisible: true,
        checkedKeys: checked,
        checkedNodes: checkedAndHalf,
        authDataTree
      })
    } catch (error) {
      console.log(error)
    }
  }

  authCancel() {
    this.setState({
      authVisible: false,
      checkedKeys: [],
      checkedNodes: [],
      authDataTree: []
    })
    this.oldSelectIds = null
    this.authRoleId = null
    this.authRoleName = null
    this.authRoleCode = null
    this.authDesc = null
  }

  async authOk() {
    const { checkedNodes } = this.state
    if (!checkedNodes.length) {
      message.error('请勾选权限')
      return
    }
    let options = {
      resourceIds: checkedNodes
    }
    const oldSelectIds = this.oldSelectIds
    let newChecked = []
    for (let index = 0; index < options.resourceIds.length; index++) {
      const element = options.resourceIds[index] - 0
      newChecked.push(element)
    }
    options.addBindResourcesIds = myCompareArr(oldSelectIds, newChecked).addBindResourcesIds
    options.unbindResourcesIds = myCompareArr(oldSelectIds, newChecked).unbindResourcesIds
    delete options.resourceIds
    options.roleId = this.authRoleId
    options.roleName = this.authRoleName
    options.roleCode = this.authRoleCode
    options.desc = this.authDesc
    console.log(options)
    // return
    const res = await http.post(apiRoleUpdate, options)
    if (res.code !== SUCCESS_OK) {
      message.error(res.message)
      return
    }
    this.props.SettingAuthNavBar.geteUserNavBarData(() => {
      this.searchList({
        tip: '权限设置'
      })
    })
    this.authCancel()
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
      tableLineAuth: this.tableLineAuth,
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

    const authOptions = {
      authTitle: this.state.authTitle,
      authVisible: this.state.authVisible,
      checkedKeys: this.state.checkedKeys,
      authDataTree: this.state.authDataTree,
      authOk: this.authOk,
      authCancel: this.authCancel,
      authTreeOnCheck: this.authTreeOnCheck,
    }

    return (
      <div className="setting-auth-role">
        <div className="app-content-title">
          角色管理
        </div>
        {/* 搜索区域 */}
        <Form
          className="ant-advanced-search-form app-serach-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={5}>{this.getSearchFields()}</Row>
        </Form>
        {/* 功能按钮区域 */}
        <List className="app-handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={this.addRole}>新增角色</Button>
            </Col>
          </Row>
        </List>
        {/* 表格区域 */}
        <ListTable {...tableOptions} />
        {/* 编辑弹框 */}
        {
          this.state.addOrEditVisible
            ?
            <AddOrEdit {...addOrEditOptions} />
            : null
        }
        {/* 权限设置的弹框 */}
        {
          this.state.authVisible
            ?
            <Auth {...authOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SettingAuthRole)
export default WrappedAdvancedSearchForm
