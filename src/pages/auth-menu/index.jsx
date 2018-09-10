/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-10 16:46:48
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, message, Select, Modal } from 'antd'

import { myTrim } from '@Utils/myTrim'
import { ERR_OK } from '@Constants'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'

import { apiAuthMenuList, apiAuthMenuDeleteMenu, apiAuthMenuUpdateMenu, apiAuthMenuAddMenu, apiAuthMenuChild } from '@Api/auth-menu'

import { connect } from 'react-redux'
import { getNavBarData } from '@Redux/navBar'

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
class AuthMenu extends Component {
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
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineAddOrEdit = this.tableLineAddOrEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
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
        searchName,
        searchPName,
        searchType,
        searchLevel,
        sortIndex,
        sortDirection,
      } = state

      this.getListData({
        pageSize,
        pageNo,
        searchPName,
        searchName,
        searchType,
        searchLevel,
        sortIndex,
        sortDirection,
        tip
      })
    })
  }

  // 处理导出options或者搜索options的配套函数
  handleSearchOrExportOptions(options) {
    // 去掉空格
    options.searchPName = !options.searchPName ? undefined : myTrim(options.searchPName)

    options.parentName = options.searchPName
    delete options.searchPName

    // 去掉空格
    options.searchName = !options.searchName ? undefined : myTrim(options.searchName)

    options.resourceName = options.searchName
    delete options.searchName

    // 处理level 与type的

    options.level = options.searchLevel
    delete options.searchLevel

    options.type = options.searchType
    delete options.searchType

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
    apiAuthMenuList(options)
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
            item.key = item.resourceId
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



  // 删除的逻辑
  tableLineDelete(line) {
    console.log(line)
    const that = this
    confirm({
      title: '确定要删除吗？',
      content: '',
      onOk() {
        that.refs.mask.show()
        apiAuthMenuDeleteMenu(line.resourceId)
          .then(res => {
            that.refs.mask.hide()
            if (res.code !== ERR_OK) {
              message.error(res.message)
              return
            }
            that.searchList('删除节点')
            that.props.getNavBarData()
          })
      },
      onCancel() { },
    })
  }

  // 列表页面的编辑
  tableLineAddOrEdit(line, type) {
    console.log(type, line)
    const addOrEditVisible = true
    this.parentId = line.parentId
    this.sort = line.sort
    this.resourceId = line.resourceId

    let addOrEditTitle
    if (line.level === 1 && line.type === 3 && type === '编辑') {
      addOrEditTitle = '编辑一级菜单'

    }

    if (line.level === 1 && line.type === 3 && type === '新增') {
      addOrEditTitle = '二级菜单'
    }

    if (line.level === 2 && line.type === 3 && type === '编辑') {
      addOrEditTitle = '二级菜单'
    }

    if (line.level === 2 && line.type === 3 && type === '新增') {
      addOrEditTitle = '三级菜单'
    }

    if (line.level === 3 && line.type === 3 && type === '编辑') {
      addOrEditTitle = '三级菜单'
    }

    if (line.level === 3 && line.type === 3 && type === '新增') {
      addOrEditTitle = '按钮'
    }

    if (line.type === 4 && type === '编辑') {
      addOrEditTitle = '按钮'
    }

    this.setState({
      addOrEditTitle,
      addOrEditInitValues: line,
      addOrEditVisible,
      handleType: type
    })

  }

  // 新增或者编辑自运营专辑，添加标签，点击弹框的确定
  addOrEditOk(values, type) {
    this.handleSelfTagAddOrEdit(values, type, () => {
      this.setState({
        addOrEditVisible: false
      })
      // 刷新维度列表页面
      this.searchList(type)
      this.props.getNavBarData()
    })
  }

  handleSelfTagAddOrEdit(values, type, callback) {
    if (values.type === '菜单') {
      values.type = 3
    } else {
      values.type = 4
      if (!values.level) {
        values.level = 1
      }
    }
    values.level = values.level - 0
    values.routePath = values.path
    delete values.path
    values.descInfo = ''
    if (!values.code) {
      values.code = ''
    }
    if (!values.icon) {
      values.icon = ''
    }
    if (!values.routePath) {
      values.routePath = ''
    }
    delete values.ajaxType

    // 编辑的api
    if (type === '编辑') {
      values.sort = this.sort
      values.resourceId = this.resourceId
      this.refs.mask.show()
      apiAuthMenuUpdateMenu(values)
        .then(res => {
          this.refs.mask.hide()
          if (res.code !== ERR_OK) {
            message.error(res.message)
            return
          }
          callback && callback()
        })
    } else {
      // 根据parentId获取sort
      if (values.level === 1) {
        values.parentId = this.parentId
      } else {
        values.parentId = this.resourceId
      }

      this.refs.mask.show()
      apiAuthMenuChild(values.parentId)
        .then(res => {
          this.refs.mask.hide()
          if (res.code !== ERR_OK) {
            message.error(res.message)
            return
          }
          let data = JSON.parse(res.data)
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

          // 新增的api
          apiAuthMenuAddMenu(values)
            .then(res => {
              if (res.code !== ERR_OK) {
                message.error(res.message)
                return
              }
              callback && callback()
            })
        })
    }
  }

  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
    this.parentId = null
    this.sort = null
    this.resourceId = null
  }

  addLevel1Menu() {
    this.setState({
      addOrEditTitle: '新增一级菜单',
      addOrEditVisible: true,
      handleType: '新增',
      addOrEditInitValues: {}
    })
    this.parentId = 0
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineAddOrEdit: this.tableLineAddOrEdit,
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
      handleType: this.state.handleType
    }

    return (
      <div className="auth-menu">
        {/* 搜索 */}
        <List className="search-list" bordered>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="inline"
          >
            <Col span={8}>
              <FormItem label="父节点名称" style={{ marginBottom: 10, marginTop: 10 }}>
                <Input placeholder="请输入父节点名称" onChange={e => this.setState({ searchPName: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="节点名称" style={{ marginBottom: 10, marginTop: 10 }}>
                <Input placeholder="请输入节点名称" onChange={e => this.setState({ searchName: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="节点类型" style={{ marginBottom: 10, marginTop: 10 }}>
                <Select
                  placeholder="请选择节点类型"
                  style={{ width: 200 }}
                  allowClear
                  onChange={value => {
                    let searchType
                    let searchLevel
                    if (!value) {
                      searchType = undefined
                      searchLevel = undefined
                    } else if (value === '1级菜单') {
                      searchType = 3
                      searchLevel = 1
                    } else if (value === '2级菜单') {
                      searchType = 3
                      searchLevel = 2
                    } else if (value === '3级菜单') {
                      searchType = 3
                      searchLevel = 2
                    } else if (value === '按钮') {
                      searchType = 4
                      searchLevel = 1
                    }
                    this.setState({
                      searchType,
                      searchLevel
                    })
                  }}
                >
                  <Option value="1级菜单">1级菜单</Option>
                  <Option value="2级菜单">2级菜单</Option>
                  <Option value="3级菜单">3级菜单</Option>
                  <Option value="按钮">按钮</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8} className="search-btn">
              <Button className="searchBtn" type="primary" htmlType="submit">查询</Button>
            </Col>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List className="handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button type="primary" onClick={() => this.addLevel1Menu()}>新增一级菜单节点</Button>
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
const WrappedAdvancedSearchForm = Form.create()(AuthMenu)
export default WrappedAdvancedSearchForm
