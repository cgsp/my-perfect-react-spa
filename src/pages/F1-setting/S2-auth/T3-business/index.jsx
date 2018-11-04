/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-10-29 13:21:07
 */
import React, { Component } from 'react'
import { List, Row, Col, Button, message, Modal } from 'antd'
// import { myTrim } from '@Utils/myTrim'
import { SUCCESS_OK } from '@Constants'
import { apiAllBusChannel, apiDeleteBusChannel, apiAddBusChannel, apiUpdateBusChannel } from '@Service/setting'
import { http } from '@Service'
import { myExportFile } from '@Utils/my-export-file'
import ListTable from './list-table'
import AddOrEdit from './add-or-edit'
import './style.scss'

// const FormItem = Form.Item
// const Option = Select.Option
const confirm = Modal.confirm

class SettingAuthBusiness extends Component {
  constructor() {
    super()
    this.state = {
      tableData: []
    }
    this.addFirst = this.addFirst.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableLineAdd = this.tableLineAdd.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.getListData()
  }

  // // 获取列表页面的数据
  getListData(options) {
    http.get(apiAllBusChannel)
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }

        if (res.data) {
          res.data.forEach(f => {
            f.key = f.id
            f.type = '一级渠道'
            if (f.children) {
              f.children.forEach(s => {
                s.key = s.id
                s.fatherName = f.name
                s.type = '二级渠道'
                if (s.children) {
                  s.children.forEach(t => {
                    t.key = t.id
                    t.fatherName = s.name
                    t.type = '三级渠道'
                    if (t.children) {
                      t.children.forEach(four => {
                        four.key = four.id
                        four.fatherName = t.name
                        four.type = '四级渠道'
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          res.data = []
        }


        this.setState({
          tableData: res.data
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (options && options.tip) {
          message.success(`${options.tip}成功`)
        }
      })
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    this.setState({
      addOrEditTitle: '编辑渠道',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
    this.editId = line.id
  }

  // 删除的逻辑
  tableLineDelete(line) {
    console.log(line)
    const that = this
    confirm({
      title: '确定要删除吗?',
      content: '',
      onOk() {
        http.post(apiDeleteBusChannel, `id=${line.id}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
          .then(res => {
            if (res.code !== SUCCESS_OK) {
              message.error(res.message)
              return
            }
            that.getListData({
              tip: '删除'
            })
          })
      },
      onCancel() { },
    })
  }

  tableLineAdd(line) {
    this.setState({
      addOrEditTitle: '新增渠道',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
    this.fatherParentId = line.id
    this.fatherFullPath = line.fullPath
  }

  // // 新增或者编辑
  addOrEditOk(values, title) {
    console.log(values, title)
    if (title === '新增一级渠道') {
      values.parentId = 0
      values.fullPath = "0,"
      values.type = '新增'
      this.handleSelfTagAddOrEdit(values)
    } else {
      if (title === '新增渠道') {
        const addtemp = {
          name: values.name,
          parentId: this.fatherParentId,
          fullPath: this.fatherFullPath + this.fatherParentId + ',',
          type: '新增'
        }
        this.handleSelfTagAddOrEdit(addtemp)
      } else {
        const edittemp = {
          name: values.name,
          id: this.editId,
          type: '编辑'
        }
        // debugger
        this.handleSelfTagAddOrEdit(edittemp)
      }
    }
  }

  async handleSelfTagAddOrEdit(values) {
    try {
      let res
      let tip = values.type
      if (values.type === '新增') {
        delete values.type
        res = await http.post(apiAddBusChannel, values)
      } else {
        delete values.type
        res = await http.post(apiUpdateBusChannel, `id=${values.id}&name=${values.name}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
      }
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }
      this.setState({
        addOrEditVisible: false
      })
      this.getListData({
        tip
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false,
      addOrEditInitValues: {}
    })
    this.editId = null
    this.fatherParentId = null
    this.fatherFullPath = null
  }

  addFirst() {
    this.setState({
      addOrEditTitle: '新增一级渠道',
      addOrEditVisible: true,
      addOrEditInitValues: {}
    })
  }

  render() {
    const tableOptions = {
      tableData: this.state.tableData,
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      tableLineAdd: this.tableLineAdd,
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    return (
      <div className="setting-auth-business">
        <div className="app-content-title">
          商务渠道管理
        </div>
        <List className="app-handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={this.addFirst}>新增一级渠道</Button>
              <Button className="btn" type="primary" onClick={() => myExportFile('channel/export')}>导出</Button>
            </Col>
          </Row>
        </List>
        <ListTable {...tableOptions} />
        {
          this.state.addOrEditVisible ? <AddOrEdit {...addOrEditOptions} /> : null
        }
      </div >
    )
  }
}
export default SettingAuthBusiness
