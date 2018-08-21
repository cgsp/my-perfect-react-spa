/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-21 16:39:59
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Modal, Select } from 'antd'
import { connect } from 'react-redux'
import { getNodeSort } from '@Utils/getNodeSort'
import AuthMenuListTable from './list-table'
import AddOrEditMenu from './add-or-edit-menu'
import MaskLoading from '@Components/mask-loading'
import { myTrim } from '@Utils/myTrim'
import { apiGetAuthMenuPageList, authMenuPageListDelete, authMenuPageListAddorEdit } from '@Api'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option

@connect(
  state => state.navBarAndAuthReducer,
  {}
)
class AuthMenu extends Component {
  constructor() {
    super()
    this.state = {
      searchname: '',
      searchtype: '',
      searchlevel: '',
      tableTotal: 0,
      tableData: [],
      page: 1,
      pageSize: 10,
      modalTitle: '',
      modalVisible: false,
      modalRoleName: '',
      modalRoleDesc: '',
      modalConfirmLoading: false,
    }
    this.onTableShowSizeChange = this.onTableShowSizeChange.bind(this)
    this.onTablePageChange = this.onTablePageChange.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.modalOk = this.modalOk.bind(this)
    this.modalCancel = this.modalCancel.bind(this)
    // this.modalOnCheck = this.modalOnCheck.bind(this)
    this.urlChange = this.urlChange.bind(this)
    this.codeChange = this.codeChange.bind(this)
    this.iconChange = this.iconChange.bind(this)
    this.newnameChange = this.newnameChange.bind(this)
  }

  componentDidMount() {
    // 获取表格数据
    this.getListData({
      page: 1,
      pageSize: 10,
      searchname: '',
      searchtype: '',
      searchlevel: ''
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
    }, () => {
      const searchname = myTrim(this.state.searchname)
      const { searchtype, searchlevel } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        searchname,
        searchtype,
        searchlevel
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
              const searchname = myTrim(that.state.searchname)
              const { searchtype, searchlevel } = that.state
              that.getListData({
                page: 1,
                pageSize: that.state.pageSize,
                searchname,
                searchtype,
                searchlevel
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
      const searchname = myTrim(this.state.searchname)
      const { searchtype, searchlevel } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        searchname,
        searchtype,
        searchlevel
      })
    })
  }

  onTablePageChange(current, pageSize) {
    console.log(current, pageSize)
    this.setState({
      page: current,
      pageSize
    }, () => {
      const searchname = myTrim(this.state.searchname)
      const { searchtype, searchlevel } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        searchname,
        searchtype,
        searchlevel
      })
    })
  }

  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData({ page, pageSize, searchname, searchtype, searchlevel }) {
    this.refs.mask.show()
    apiGetAuthMenuPageList({ page, pageSize, searchname, searchtype, searchlevel })
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

  addLevel1Menu() {
    this.setState({
      newname: '',
      url: '',
      icon: '',
      code: '',
      pid: '0',
      modalTitle: '一级菜单',
      modalVisible: true,
      modalConfirmLoading: false,
    })
  }

  // 编辑
  tableLineEdit(line) {
    this.refs.mask.show()
    const { roleid, rolename, roledesc } = line
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
    //       modalCheckedKeys: checked,
    //       modalCheckedNodes: checkedAndHalf
    //     })
    //   })

  }

  modalOk(title) {
    this.setState({
    }, () => {
      if (!this.state.newname) {
        this.showModalTip(`请输入${title}名称`)
        return
      }
      if (!this.state.icon && title === '一级菜单') {
        this.showModalTip('请输入一级菜单图标')
        return
      }
      if (!this.state.url && title !== '功能') {
        this.showModalTip('请输入url路径')
        return
      }

      if (!this.state.code && title === '功能') {
        this.showModalTip('请输入权限字符串')
        return
      }

      const { newname, icon, url, code, pid } = this.state
      // 写一个函数根据pid来获取sort
      const sort = getNodeSort(pid, this.props.appNavAndAuthPlain)
      let type
      let level
      if (title === '一级菜单') {
        type = '菜单'
        level = '1'
      } else if (title === '二级菜单') {
        type = '菜单'
        level = '2'
      } else if (title === '三级菜单') {
        type = '菜单'
        level = '3'
      } else if (title === '功能') {
        type = '功能'
        level = ''
      }

      console.log({ newname, icon, url, code, type, level, sort })
      this.setState({
        modalConfirmLoading: true
      })
      authMenuPageListAddorEdit(
        {
          pid,
          newname: myTrim(newname),
          icon: myTrim(icon),
          url: myTrim(url),
          code: myTrim(code),
          type,
          level,
          sort
        }
      )
        .then(res => {
          this.setState({
            modalVisible: false,
          }, () => {
            const searchname = myTrim(this.state.searchname)
            const { searchtype, searchlevel } = this.state
            this.getListData({
              page: this.state.page,
              pageSize: this.state.pageSize,
              searchname,
              searchtype,
              searchlevel
            })
          })

        })
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

  newnameChange(e) {
    this.setState({
      newname: e.target.value
    })
  }
  codeChange(e) {
    this.setState({
      code: e.target.value
    })
  }

  iconChange(e) {
    this.setState({
      icon: e.target.value
    })
  }

  urlChange(e) {
    this.setState({
      url: e.target.value
    })
  }


  // modalOnCheck(checkedKeys, e) {
  //   console.log('onCheck', checkedKeys)
  //   console.log('halfChecked', e.halfCheckedKeys)
  //   this.setState({ modalCheckedKeys: checkedKeys, modalCheckedNodes: e.halfCheckedKeys.concat(checkedKeys) })
  // }


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
      newname: this.state.newname,
      newnameChange: this.newnameChange,
      url: this.state.url,
      urlChange: this.urlChange,
      icon: this.state.icon,
      iconChange: this.iconChange,
      code: this.state.code,
      codeChange: this.codeChange,
      modalAlertVisible: this.state.modalAlertVisible,
      modalAlertMessage: this.state.modalAlertMessage
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
                  <Input placeholder="请输入权限名称" onChange={e => this.setState({ searchname: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="权限类型" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择权限类型"
                    style={{ width: 200 }}
                    allowClear
                    onChange={value => {
                      let searchtype
                      let searchlevel
                      if (!value) {
                        searchtype = ''
                        searchlevel = ''
                      } else if (value === '1级菜单') {
                        searchtype = '菜单'
                        searchlevel = '1'
                      } else if (value === '2级菜单') {
                        searchtype = '菜单'
                        searchlevel = '2'
                      } else if (value === '3级菜单') {
                        searchtype = '菜单'
                        searchlevel = '3'
                      } else if (value === '功能') {
                        searchtype = '功能'
                        searchlevel = ''
                      }
                      this.setState({
                        searchtype,
                        searchlevel
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
              <Button type="primary" onClick={() => this.addLevel1Menu()}>新增一级菜单</Button>
            </Col>
          </Row>
        </List>
        <AuthMenuListTable {...tableOptions} />
        <AddOrEditMenu {...modalOptions} />
        <MaskLoading ref="mask" />
      </div>

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthMenu)
export default WrappedAdvancedSearchForm
