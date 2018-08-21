/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-21 11:52:44
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Modal, Select } from 'antd'
import AuthRoleListTable from './list-table'
// import AddOrEditRole from './add-or-edit-role'
import MaskLoading from '@Components/mask-loading'
import { myTrim } from '@Utils/myTrim'
import { apiGetAuthMenuPageList, authMenuPageListDelete } from '@Api'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option


class AuthMenu extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      type: '',
      level: '',
      tableTotal: 0,
      tableData: [],
      page: 1,
      pageSize: 10,
    }
    this.onTableShowSizeChange = this.onTableShowSizeChange.bind(this)
    this.onTablePageChange = this.onTablePageChange.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    // this.tableLineEdit = this.tableLineEdit.bind(this)
    // this.modalOk = this.modalOk.bind(this)
    // this.modalCancel = this.modalCancel.bind(this)
    // this.modalRoleNameChange = this.modalRoleNameChange.bind(this)
    // this.modalRoleDescChange = this.modalRoleDescChange.bind(this)
    // this.modalOnCheck = this.modalOnCheck.bind(this)
  }

  componentDidMount() {
    // 获取表格数据
    this.getListData({
      page: 1,
      pageSize: 10,
      name: '',
      type: '',
      level: ''
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
    }, () => {
      const name = myTrim(this.state.name)
      const { type, level } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        name,
        type,
        level
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
        authMenuPageListDelete({ id: line.id })
          .then(res => {
            // 将列表页面重新刷新
            that.setState({
            }, () => {
              const name = myTrim(that.state.name)
              const { type, level } = that.state
              that.getListData({
                page: 1,
                pageSize: that.state.pageSize,
                name,
                type,
                level
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
      const name = myTrim(this.state.name)
      const { type, level } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        name,
        type,
        level
      })
    })
  }

  onTablePageChange(current, pageSize) {
    console.log(current, pageSize)
    this.setState({
      page: current,
      pageSize
    }, () => {
      const name = myTrim(this.state.name)
      const { type, level } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        name,
        type,
        level
      })
    })
  }

  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData({ page, pageSize, name, type, level }) {
    this.refs.mask.show()
    apiGetAuthMenuPageList({ page, pageSize, name, type, level })
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

  // addRole() {
  //   this.setState({
  //     modalTitle: '新增角色',
  //     modalVisible: true,
  //     modalRoleName: '',
  //     modalRoleDesc: '',
  //     modalConfirmLoading: false,
  //     modalCheckedKeys: [],
  //     modalCheckedNodes: []
  //   })
  // }

  // 编辑
  // tableLineEdit(line) {
  //   this.refs.mask.show()
  //   const { roleid, rolename, roledesc } = line
  //   authRolePageNavAndAuthSomeRole({ roleid })
  //     .then(res => {
  //       this.refs.mask.hide()
  //       let checked = []
  //       let checkedAndHalf = []
  //       for (let i = 0; i < res.length; i++) {
  //         const item = res[i]
  //         if (item.checked) {
  //           checkedAndHalf.push(item.id)
  //           let itemChildrenAllChecked = true
  //           for (let j = 0; j < res.length; j++) {
  //             const ele = res[j]
  //             if (ele.pid === item.id && !ele.checked) {
  //               itemChildrenAllChecked = false
  //               break
  //             }
  //           }
  //           if (itemChildrenAllChecked) {
  //             checked.push(item.id)
  //           }
  //         }
  //       }
  //       console.log(checked)
  //       this.setState({
  //         modalTitle: '编辑角色',
  //         modalVisible: true,
  //         modalRoleName: rolename,
  //         modalRoleDesc: roledesc,
  //         modalConfirmLoading: false,
  //         modalCheckedKeys: checked,
  //         modalCheckedNodes: checkedAndHalf
  //       })
  //     })

  // }

  // modalOk(title) {
  //   this.setState({
  //   }, () => {
  //     if (!this.state.modalRoleName) {
  //       this.showModalTip('请输入角色名称')
  //       return
  //     }
  //     if (!this.state.modalRoleDesc) {
  //       this.showModalTip('请输入角色描述')
  //       return
  //     }
  //     if (!this.state.modalCheckedNodes.length) {
  //       this.showModalTip('请设置角色权限')
  //       return
  //     }
  //     const { modalRoleName, modalRoleDesc, modalCheckedNodes } = this.state
  //     if (title === '新增角色') {
  //       this.setState({
  //         modalConfirmLoading: true
  //       })
  //       authRolePageListAdd(
  //         {
  //           rolename: myTrim(modalRoleName),
  //           roledesc: myTrim(modalRoleDesc),
  //           checkedIds: modalCheckedNodes
  //         }
  //       )
  //         .then(res => {
  //           this.setState({
  //             modalVisible: false,
  //           }, () => {
  //             // 刷新列表页面
  //             this.getListData({
  //               page: 1,
  //               pageSize: this.state.pageSize,
  //               rolename: myTrim(this.state.rolename)
  //             })
  //           })

  //         })
  //     }
  //     if (title === '编辑角色') {
  //       this.setState({
  //         modalConfirmLoading: true
  //       })
  //       authRolePageListAdd(
  //         {
  //           rolename: myTrim(modalRoleName),
  //           roledesc: myTrim(modalRoleDesc),
  //           checkedIds: modalCheckedNodes
  //         }
  //       )
  //         .then(res => {
  //           this.setState({
  //             modalVisible: false,
  //           }, () => {
  //             // 刷新列表页面
  //             this.getListData({
  //               page: 1,
  //               pageSize: this.state.pageSize,
  //               rolename: myTrim(this.state.rolename)
  //             })
  //           })

  //         })
  //     }
  //   })
  // }

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
                <FormItem label="权限名称" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Input placeholder="请输入权限名称" onChange={e => this.setState({ name: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="权限类型" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择权限类型"
                    style={{ width: 200 }}
                    allowClear
                    onChange={value => {
                      let type
                      let level
                      if (!value) {
                        type = ''
                        level = ''
                      } else if (value === '1级菜单') {
                        type = '菜单'
                        level = '1'
                      } else if (value === '2级菜单') {
                        type = '菜单'
                        level = '2'
                      } else if (value === '3级菜单') {
                        type = '菜单'
                        level = '3'
                      } else if (value === '功能') {
                        type = '功能'
                        level = ''
                      }
                      this.setState({
                        type,
                        level
                      })
                    }}
                  >
                    <Option value="1级菜单">1级菜单</Option>
                    <Option value="2级菜单">2级菜单</Option>
                    <Option value="3级菜单">3级菜单</Option>
                    <Option value="功能">功能</Option>
                  </Select>
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
        <MaskLoading ref="mask" />
      </div>

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthMenu)
export default WrappedAdvancedSearchForm
