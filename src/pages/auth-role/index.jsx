/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-21 17:51:03
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Modal, message } from 'antd'
import AuthRoleListTable from './list-table'
import WrapperAuthRoleAddOrEdit from './add-or-edit'
import MaskLoading from '@Components/mask-loading'
import { myTrim } from '@Utils/myTrim'
import { myCompareArr } from '@Utils/myCompareArr'
import { connect } from 'react-redux'
import { getNavBarData } from '@Redux/navBar'
import { apiAuthRoleList, apiAuthTree, authRoleAdd, authRoleDelete, authRoleGetAllAndOne, authRoleEdit } from '@Api/auth-role'
import { ERR_OK } from '@Constants'
import SortList from '@Components/sort-list'
import './style'

const FormItem = Form.Item
const confirm = Modal.confirm

@connect(
  state => state.navBarReducer,
  { getNavBarData }
)
class AuthRole extends Component {
  constructor() {
    super()
    this.state = {
      tableTotal: 0,
      tableData: [],
      checkedKeys: [],
      checkedNodes: [],
      authData: [],
      sortIndex: 1,
      sortDirection: 'down',
    }
    this.onSizeAndPageChange = this.onSizeAndPageChange.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditOnCheck = this.addOrEditOnCheck.bind(this)
    this.clickSort = this.clickSort.bind(this)
  }

  componentDidMount() {
    // 获取表格数据
    this.setState({
      page: 1,
      pageSize: 10,
      rolename: undefined
    })
    this.getListData({
      page: 1,
      pageSize: 10,
      rolename: undefined,
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

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
      page: 1
    }, () => {
      let { rolename } = this.state
      rolename = rolename ? myTrim(rolename) : undefined
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        rolename,
      })
    })
  }

  searchList(callBack) {
    this.setState({}, () => {
      let { rolename } = this.state
      rolename = rolename ? myTrim(rolename) : undefined
      const options = {
        rolename,
        page: this.state.page,
        pageSize: this.state.pageSize,
        sortIndex: this.state.sortIndex,
        sortDirection: this.state.sortDirection,
      }
      this.getListData(options, callBack)
    })
  }

  tableLineDelete(line) {
    const that = this
    confirm({
      title: '确定要删除吗？',
      content: '',
      onOk() {
        that.refs.mask.show()
        authRoleDelete(line.roleId)
          .then(res => {
            that.refs.mask.hide()
            if (res.code !== ERR_OK) {
              message.error(res.message)
              return
            }
            that.searchList(() => {
              message.success('删除角色成功')
            })
            that.props.getNavBarData()
          })
      },
      onCancel() { },
    })
  }


  onSizeAndPageChange(current, pageSize) {
    console.log(current, pageSize)
    this.setState({
      page: current,
      pageSize
    }, () => {
      this.searchList()
    })
  }

  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData(options, callBack) {
    // 处理排序的
    options.orderBy = options.sortIndex === 0 ? 'created_at' : 'updated_at'
    delete options.sortIndex
    options.desc = options.sortDirection === 'up' ? false : true
    delete options.sortDirection

    this.refs.mask.show()
    apiAuthRoleList(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.message)
          return
        }
        const data = JSON.parse(res.data)
        console.log(data)
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
        callBack && callBack()
      })
  }

  addRole() {
    this.refs.mask.show()
    apiAuthTree()
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.message)
          return
        }
        const authData = JSON.parse(res.data).childResources
        console.log(authData)
        this.setState({
          addOrEditTitle: '新增角色',
          addOrEditVisible: true,
          addOrEditInitValues: {},
          checkedKeys: [],
          checkedNodes: [],
          authData
        })
      })

  }

  // 编辑
  // tableLineEdit(line) {
  // this.refs.mask.show()
  // const { roleid, rolename, roledesc } = line
  // authRolePageNavAndAuthSomeRole({ roleid })
  //   .then(res => {
  //     this.refs.mask.hide()
  //     let checked = []
  //     let checkedAndHalf = []
  //     for (let i = 0; i < res.length; i++) {
  //       const item = res[i]
  //       if (item.checked) {
  //         checkedAndHalf.push(item.id)
  //         let itemChildrenAllChecked = true
  //         for (let j = 0; j < res.length; j++) {
  //           const ele = res[j]
  //           if (ele.pid === item.id && !ele.checked) {
  //             itemChildrenAllChecked = false
  //             break
  //           }
  //         }
  //         if (itemChildrenAllChecked) {
  //           checked.push(item.id)
  //         }
  //       }
  //     }
  //     console.log(checked)
  //     this.setState({
  //       modalTitle: '编辑角色',
  //       modalVisible: true,
  //       modalRoleName: rolename,
  //       modalRoleDesc: roledesc,
  //       modalConfirmLoading: false,
  //       checkedKeys: checked,
  //       checkedNodes: checkedAndHalf
  //     })
  //   })

  // }

  async tableLineEdit(line) {
    this.refs.mask.show()
    try {
      // 获取被勾选的数据
      const res = await authRoleGetAllAndOne(line.roleId)
      this.refs.mask.hide()
      if (res.code !== ERR_OK) {
        message.error(res.message)
        return
      }

      // 获取权限树
      const authTreeRes = await apiAuthTree()

      if (authTreeRes.code !== ERR_OK) {
        message.error(authTreeRes.message)
        return
      }
      const authData = JSON.parse(authTreeRes.data).childResources
      console.log(authData)

      const resDataResources = JSON.parse(res.data).resources
      const resDataChecked = JSON.parse(res.data).selectIds
      this.oldChecked = resDataChecked
      this.roleId = line.roleId
      console.log(resDataResources)
      console.log(resDataChecked)
      let checked = []
      let checkedAndHalf = []
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

      // console.log(checked)


      this.setState({
        addOrEditTitle: '编辑角色',
        addOrEditVisible: true,
        addOrEditInitValues: line,
        checkedKeys: checked,
        checkedNodes: checkedAndHalf,
        authData
      })
    } catch (error) {
      console.log(error)
    }
  }

  addOrEditOk(values, title) {
    this.setState({
    }, () => {
      const { checkedNodes } = this.state
      if (!checkedNodes.length) {
        message.error('请勾选权限')
        return
      }
      const options = { ...values, ...{ resourceIds: checkedNodes } }
      if (title === '新增角色') {
        this.refs.mask.show()
        authRoleAdd(options)
          .then(res => {
            this.refs.mask.hide()
            if (res.code !== ERR_OK) {
              message.error(res.message)
              return
            }
            this.searchList(() => {
              message.success('新增角色成功')
            })
            this.setState({
              addOrEditVisible: false
            })
          })
      } else {
        const oldChecked = this.oldChecked
        let newChecked = []
        for (let index = 0; index < options.resourceIds.length; index++) {
          const element = options.resourceIds[index] - 0
          newChecked.push(element)
        }
        options.addBindResourcesIds = myCompareArr(oldChecked, newChecked).addBindResourcesIds
        options.unbindResourcesIds = myCompareArr(oldChecked, newChecked).unbindResourcesIds
        delete options.resourceIds
        options.roleId = this.roleId
        // console.log(options)
        this.refs.mask.show()
        authRoleEdit(options)
          .then(res => {
            this.refs.mask.hide()
            if (res.code !== ERR_OK) {
              message.error(res.message)
              return
            }
            this.searchList(() => {
              message.success('编辑角色成功')
            })
            this.props.getNavBarData()
            this.setState({
              addOrEditVisible: false
            })
            this.oldChecked = null
          })
      }
    })
  }



  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
  }

  addOrEditOnCheck(checkedKeys, e) {
    console.log('onCheck', checkedKeys)
    console.log('halfChecked', e.halfCheckedKeys)
    this.setState(
      {
        checkedKeys,
        checkedNodes: e.halfCheckedKeys.concat(checkedKeys)
      })
  }


  render() {
    const tableOptions = {
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      onSizeAndPageChange: this.onSizeAndPageChange,
      total: this.state.tableTotal,
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      page: this.state.page
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
      checkedKeys: this.state.checkedKeys,
      authData: this.state.authData,
      addOrEditOnCheck: this.addOrEditOnCheck
    }
    return (
      <div className="auth-role">
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
                  <Input placeholder="请输入角色名称" onChange={e => this.setState({ rolename: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'left' }}>
                <Button style={{ marginTop: 14 }} type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List className="handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={() => this.addRole()}>新建角色</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <AuthRoleListTable {...tableOptions} />
        {
          this.state.addOrEditVisible ?
            <WrapperAuthRoleAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div>

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthRole)
export default WrappedAdvancedSearchForm
