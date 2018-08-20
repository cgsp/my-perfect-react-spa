/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-20 23:04:07
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Modal } from 'antd'
import AuthRoleListTable from './list-table'
import AddOrEditRole from './add-or-edit-role'
import MaskLoading from '@Components/mask-loading'
import { myTrim } from '@Utils/myTrim'
import { apiGetAuthRolePageList, authRolePageListDelete, authRolePageListAdd, authRolePageNavAndAuthSomeRole } from '@Api'

const FormItem = Form.Item
const confirm = Modal.confirm


class AuthRole extends Component {
  constructor() {
    super()
    this.state = {
      rolename: '',
      tableTotal: 0,
      tableData: [],
      page: 1,
      pageSize: 10,
      modalTitle: '新增角色',
      modalVisible: false,
      modalConfirmLoading: false,
      modalRoleName: '',
      modalRoleDesc: '',
      modalCheckedKeys: [],
      modalCheckedNodes: [],
      modalAlertMessage: '',
      modalAlertVisible: false
    }
    this.onTableShowSizeChange = this.onTableShowSizeChange.bind(this)
    this.onTablePageChange = this.onTablePageChange.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.modalOk = this.modalOk.bind(this)
    this.modalCancel = this.modalCancel.bind(this)
    this.modalRoleNameChange = this.modalRoleNameChange.bind(this)
    this.modalRoleDescChange = this.modalRoleDescChange.bind(this)
    this.modalOnCheck = this.modalOnCheck.bind(this)
  }

  componentDidMount() {
    // 获取表格数据
    this.getListData({
      page: 1,
      pageSize: 10,
      rolename: ''
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
    }, () => {
      const rolename = myTrim(this.state.rolename)
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        rolename
      })
    })
  }

  tableLineDelete(line) {
    const that = this
    confirm({
      title: '确定要删除吗？',
      content: '',
      onOk() {
        that.refs.mask.show()
        authRolePageListDelete({ roleid: line.id })
          .then(res => {
            // 将列表页面重新刷新
            that.setState({
            }, () => {
              that.getListData({
                page: 1,
                pageSize: that.state.pageSize,
                rolename: myTrim(that.state.rolename),
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
      page: current,
      pageSize
    }, () => {
      this.getListData({
        page: 1,
        pageSize: this.state.pageSize,
        rolename: myTrim(this.state.rolename),
      })
    })
  }

  onTablePageChange(current, pageSize) {
    console.log(current, pageSize)
    this.setState({
      page: current,
      pageSize
    }, () => {
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        rolename: myTrim(this.state.rolename),
      })
    })
  }

  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData({ page, pageSize, rolename }) {
    this.refs.mask.show()
    apiGetAuthRolePageList({ page, pageSize, rolename })
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

  addRole() {
    this.setState({
      modalTitle: '新增角色',
      modalVisible: true,
      modalRoleName: '',
      modalRoleDesc: '',
      modalConfirmLoading: false,
      modalCheckedKeys: [],
      modalCheckedNodes: []
    })
  }

  // 编辑
  tableLineEdit(line) {
    this.refs.mask.show()
    const { roleid, rolename, roledesc } = line
    authRolePageNavAndAuthSomeRole({ roleid })
      .then(res => {
        this.refs.mask.hide()
        let checked = []
        let checkedAndHalf = []
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          if (item.checked) {
            checkedAndHalf.push(item.id)
            let itemChildrenAllChecked = true
            for (let j = 0; j < res.length; j++) {
              const ele = res[j]
              if (ele.pid === item.id && !ele.checked) {
                itemChildrenAllChecked = false
                break
              }
            }
            if (itemChildrenAllChecked) {
              checked.push(item.id)
            }
          }
        }
        console.log(checked)
        this.setState({
          modalTitle: '编辑角色',
          modalVisible: true,
          modalRoleName: rolename,
          modalRoleDesc: roledesc,
          modalConfirmLoading: false,
          modalCheckedKeys: checked,
          modalCheckedNodes: checkedAndHalf
        })
      })

  }

  modalOk(title) {
    this.setState({
    }, () => {
      if (!this.state.modalRoleName) {
        this.showModalTip('请输入角色名称')
        return
      }
      if (!this.state.modalRoleDesc) {
        this.showModalTip('请输入角色描述')
        return
      }
      if (!this.state.modalCheckedNodes.length) {
        this.showModalTip('请设置角色权限')
        return
      }
      const { modalRoleName, modalRoleDesc, modalCheckedNodes } = this.state
      if (title === '新增角色') {
        this.setState({
          modalConfirmLoading: true
        })
        authRolePageListAdd(
          {
            rolename: myTrim(modalRoleName),
            roledesc: myTrim(modalRoleDesc),
            checkedIds: modalCheckedNodes
          }
        )
          .then(res => {
            this.setState({
              modalVisible: false,
            }, () => {
              // 刷新列表页面
              this.getListData({
                page: 1,
                pageSize: this.state.pageSize,
                rolename: myTrim(this.state.rolename)
              })
            })

          })
      }
      if (title === '编辑角色') {
        this.setState({
          modalConfirmLoading: true
        })
        authRolePageListAdd(
          {
            rolename: myTrim(modalRoleName),
            roledesc: myTrim(modalRoleDesc),
            checkedIds: modalCheckedNodes
          }
        )
          .then(res => {
            this.setState({
              modalVisible: false,
            }, () => {
              // 刷新列表页面
              this.getListData({
                page: 1,
                pageSize: this.state.pageSize,
                rolename: myTrim(this.state.rolename)
              })
            })

          })
      }
    })
  }

  showModalTip(tip) {
    this.setState({
      modalAlertVisible: true,
      modalAlertMessage: tip
    })
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.timer = setTimeout(() => {
      this.setState({
        modalAlertVisible: false,
        modalAlertMessage: ''
      })
    }, 2000)
  }

  modalCancel() {
    this.setState({
      modalVisible: false
    })
  }

  modalRoleNameChange(e) {
    this.setState({
      modalRoleName: e.target.value
    })
  }

  modalRoleDescChange(e) {
    this.setState({
      modalRoleDesc: e.target.value
    })
  }

  modalOnCheck(checkedKeys, e) {
    console.log('onCheck', checkedKeys)
    console.log('halfChecked', e.halfCheckedKeys)
    this.setState({ modalCheckedKeys: checkedKeys, modalCheckedNodes: e.halfCheckedKeys.concat(checkedKeys) })
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
      rolename: this.state.modalRoleName,
      roleNameChange: this.modalRoleNameChange,
      roledesc: this.state.modalRoleDesc,
      roleDescChange: this.modalRoleDescChange,
      checkedKeys: this.state.modalCheckedKeys,
      onCheck: this.modalOnCheck,
      modalAlertMessage: this.state.modalAlertMessage,
      modalAlertVisible: this.state.modalAlertVisible
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
        <List style={{ marginBottom: 30 }}>
          <Row>
            <Col span={8} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={() => this.addRole()}>新建角色</Button>
            </Col>
          </Row>
        </List>
        <AuthRoleListTable {...tableOptions} />
        <AddOrEditRole {...modalOptions} />
        <MaskLoading ref="mask" />
      </div>

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthRole)
export default WrappedAdvancedSearchForm
