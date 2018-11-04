/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-10-29 16:02:15
 */
import React, { Component } from 'react'
import { List, Row, Col, Button, message, Modal } from 'antd'
// import { myTrim } from '@Utils/myTrim'
import { inject, observer } from 'mobx-react'
import { SUCCESS_OK } from '@Constants'
import { apiAllMenuAndButton, apiAddMenuOrButton, apiDeleteMenuOrButton, apiGetChildMenuOrButton, apiEditMenuOrButton } from '@Service/setting'
import { http } from '@Service'
import ListTable from './list-table'
import Add from './add'
import Edit from './edit'
import './style.scss'

// const FormItem = Form.Item
// const Option = Select.Option
const confirm = Modal.confirm

@inject('SettingAuthNavBar')
@observer
class SettingAuthMenu extends Component {
  constructor() {
    super()
    this.state = {
      tableData: []
    }
    this.addFirst = this.addFirst.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineAdd = this.tableLineAdd.bind(this)
    this.addOk = this.addOk.bind(this)
    this.addCancel = this.addCancel.bind(this)
    this.editCancel = this.editCancel.bind(this)
    this.editOk = this.editOk.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.getListData()
  }

  // // 获取列表页面的数据
  getListData(options) {
    http.get(apiAllMenuAndButton, { isShowAdminResource: true })
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }

        let data = null
        if (res.data) {
          data = JSON.parse(res.data).childResources || []
        }

        let newData = JSON.parse(JSON.stringify(data))

        newData.forEach(f => {
          f.key = f.resourceId
          f.nameType = '一级菜单'
          f.parentName = null
          if (f.childResources) {
            f.children = f.childResources.slice()
            f.children.forEach(s => {
              s.key = s.resourceId
              s.parentName = f.name
              s.nameType = '二级菜单'
              if (s.childResources) {
                s.children = s.childResources.slice()
                s.children.forEach(t => {
                  t.key = t.resourceId
                  t.parentName = s.name
                  if (t.type === 3) {
                    t.nameType = '三级菜单'
                  } else {
                    t.nameType = '功能按钮'
                  }
                  if (t.childResources) {
                    t.children = t.childResources.slice()
                    t.children.forEach(four => {
                      four.key = four.resourceId
                      four.parentName = t.name
                      four.nameType = '功能按钮'
                    })
                  }
                })
              }
            })
          }
        })

        console.log(newData)

        this.setState({
          tableData: newData
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (options && options.tip) {
          message.success(`${options.tip}成功`)
        }
      })
  }

  // 新增一级菜单
  addFirst() {
    this.setState({
      addTitle: '新增一级菜单',
      addVisible: true,
      addInitValues: {}
    })
  }

  // 新增非一级
  tableLineAdd(line) {
    this.setState({
      addTitle: '新增子节点',
      addVisible: true,
      addInitValues: line
    })
  }

  async addOk(values) {
    try {
      // 需要先获取该节点下面现在有几个节点，然后计算出新的sort值

      const getRes = await http.get(apiGetChildMenuOrButton, {
        resourceId: values.parentId
      })

      let data = getRes.data
      let maxSort
      if (!data) {
        data = []
        maxSort = 0
      } else {
        let sortArr = []
        data.forEach(element => {
          sortArr.push(element.sort)
        })
        maxSort = Math.max.apply(null, sortArr)
      }
      values.sort = maxSort + 1

      const res = await http.post(apiAddMenuOrButton, values)
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }
      this.addCancel()
      this.props.SettingAuthNavBar.geteUserNavBarData(() => {
        this.getListData({
          tip: '新增'
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 编辑
  tableLineEdit(line) {
    let editTitle
    if (line.type === 3 && line.level === 1) {
      editTitle = '编辑一级菜单'
    } else {
      editTitle = '编辑节点'
    }
    this.setState({
      editTitle,
      editVisible: true,
      editInitValues: line
    })
  }

  async editOk(values) {
    try {
      const res = await http.post(apiEditMenuOrButton, values)
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }
      this.editCancel()
      this.props.SettingAuthNavBar.geteUserNavBarData(() => {
        this.getListData({
          tip: '编辑'
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 删除
  tableLineDelete(line) {
    console.log(line)
    const that = this
    const id = line.resourceId
    confirm({
      title: '确定要删除吗?',
      content: '',
      onOk() {
        http.post(apiDeleteMenuOrButton, [id])
          .then(res => {
            if (res.code !== SUCCESS_OK) {
              message.error(res.message)
              return
            }
            that.props.SettingAuthNavBar.geteUserNavBarData(() => {
              that.getListData({
                tip: '删除'
              })
            })
          })
      },
      onCancel() { },
    })
  }

  // 新增或者编辑自运营专辑，关闭弹框
  addCancel() {
    this.setState({
      addVisible: false,
      addInitValues: {}
    })
  }

  editCancel() {
    this.setState({
      editVisible: false,
      editInitValues: {}
    })
  }

  render() {
    const tableOptions = {
      tableData: this.state.tableData,
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      tableLineAdd: this.tableLineAdd,
    }

    const addOptions = {
      addTitle: this.state.addTitle,
      addVisible: this.state.addVisible,
      addInitValues: this.state.addInitValues,
      addOk: this.addOk,
      addCancel: this.addCancel,
    }

    const editOptions = {
      editTitle: this.state.editTitle,
      editVisible: this.state.editVisible,
      editInitValues: this.state.editInitValues,
      editOk: this.editOk,
      editCancel: this.editCancel,
    }

    return (
      <div className="setting-auth-menu">
        <div className="app-content-title">
          菜单与功能管理
        </div>
        <List className="app-handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={this.addFirst}>新增一级菜单</Button>
            </Col>
          </Row>
        </List>
        {/* 表格 */}
        <ListTable {...tableOptions} />
        {/* 新增 */}
        {
          this.state.addVisible ? <Add {...addOptions} /> : null
        }
        {/* 编辑 */}
        {
          this.state.editVisible ? <Edit {...editOptions} /> : null
        }
      </div >
    )
  }
}
export default SettingAuthMenu
