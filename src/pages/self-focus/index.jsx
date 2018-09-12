/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-12 15:36:50
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, DatePicker, message, Select, InputNumber } from 'antd'
import moment from 'moment'

import { myTrim } from '@Utils/myTrim'
import { myGetStampTime } from '@Utils/myGetTime'
import { ERR_OK } from '@Constants'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TimeControlHoc from '@Components/time-control-hoc'

import { apiSelfFocusList, apiSelfFocusAddOrEdit } from '@Api/self-focus'
import { commonSmallTypes } from '@Api'

import SelfFocusListTable from './list-table'
import WrapperSelfFocusAddOrEdit from './add-or-edit'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option


@TimeControlHoc
class SelfFocus extends Component {
  constructor() {
    super()
    this.state = {
      sortIndex: 1,
      sortDirection: 'down',
      tableTotal: 0,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      categories: [],

      addOrEditVisible: false,
      addOrEditInitValues: {},
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
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

  // 获取分类的数据
  getCategories(source) {
    if (!source) {
      this.setState({
        categories: []
      })
      return
    }
    commonSmallTypes(source).then(res => {
      if (res.code !== ERR_OK) {
        message.error(res.msg)
        return
      }
      this.setState({
        categories: res.data
      })
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
    this.refs.searchIdref.blur()
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
      const state = { ...this.state, ...this.props.state }
      const {
        pageSize,
        pageNo,
        searchId,
        searchName,
        contentType,
        onlineStatus,
        isExternalUrl,
        sortIndex,
        sortDirection,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd } = state

      this.getListData({
        pageSize,
        pageNo,
        searchId,
        searchName,
        contentType,
        onlineStatus,
        isExternalUrl,
        sortIndex,
        sortDirection,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
        tip
      }, callBack)
    })
  }

  // 处理导出options或者搜索options的配套函数
  handleSearchOrExportOptions(options) {
    options.searchId = !options.searchId ? '' : myTrim(options.searchId + '')
    options.id = options.searchId
    delete options.searchId

    options.source = 2

    // 去掉空格
    options.searchName = !options.searchName ? '' : myTrim(options.searchName)
    options.title = options.searchName
    delete options.searchName

    // 将时间对象转换为时间戳
    function transToStamp(date) {
      if (date) {
        return myGetStampTime(date)
      }
      return date
    }

    options.createdAtStart = transToStamp(options.searchCreateTimeBegin)
    delete options.searchCreateTimeBegin
    options.createdAtEnd = transToStamp(options.searchCreateTimeEnd)
    delete options.searchCreateTimeEnd
    options.updatedAtStart = transToStamp(options.searchUpdateTimeBegin)
    delete options.searchUpdateTimeBegin
    options.updatedAtEnd = transToStamp(options.searchUpdateTimeEnd)
    delete options.searchUpdateTimeEnd

    // 处理排序的
    options.orderBy = (options.sortIndex === 0 ? 'created_at' : 'updated_at')
    delete options.sortIndex
    options.desc = options.sortDirection === 'up' ? false : true
    delete options.sortDirection
    return options
  }

  // 获取列表页面的数据
  getListData(options, callBack) {
    this.refs.mask.show()
    options = this.handleSearchOrExportOptions(options)

    apiSelfFocusList(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        const tableData = res.data.dataList.map(item => {
          item.key = item.id
          return item
        })
        this.setState({
          tableData: tableData,
          tableTotal: res.data.totalNum,
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (options.tip) {
          message.success(`${options.tip}成功`)
        }
        callBack && callBack(res.data.totalNum)
      })
  }


  // 列表页面的编辑
  async tableLineEdit(line) {
    console.log('编辑', line)
    this.editBannerId = line.bannerId
    this.editId = line.id
    try {
      let categorySource = line.categorySource
      let addOrEdidSmallTypes = []
      if (categorySource) {
        this.refs.mask.show()
        const smallTypeRes = await commonSmallTypes(categorySource)
        this.refs.mask.hide()
        if (smallTypeRes.code !== ERR_OK) {
          message.error(smallTypeRes.msg)
          return
        }
        addOrEdidSmallTypes = smallTypeRes.data
      } else {
        line.categorySource = 2
      }
      this.setState({
        addOrEditTitle: '编辑焦点图',
        addOrEditVisible: true,
        addOrEditInitValues: line,
        addOrEdidSmallTypes
      })
    } catch (error) {
      console.log(error)
    }

  }

  async addSelfFocus() {
    // 新增的时候，bannerId=0
    try {
      let categorySource = 2
      let addOrEdidSmallTypes = []
      this.refs.mask.show()
      const smallTypeRes = await commonSmallTypes(categorySource)
      this.refs.mask.hide()
      if (smallTypeRes.code !== ERR_OK) {
        message.error(smallTypeRes.msg)
        return
      }
      addOrEdidSmallTypes = smallTypeRes.data
      this.setState({
        addOrEditTitle: '新增焦点图',
        addOrEditVisible: true,
        addOrEditInitValues: {},
        addOrEdidSmallTypes
      })
    } catch (error) {
      console.log(error)
    }

  }


  // 编辑的确定
  addOrEditOk(values, title) {
    if (title === '新增焦点图') {
      values.type = '新增'
      values.bannerId = 0
    } else {
      values.type = '编辑'
      values.bannerId = this.editBannerId
      values.id = this.editId
    }
    this.handleMainFocusAddOrEdit(values, () => {
      this.setState({
        addOrEditVisible: false
      }, () => {
        // 刷新列表页面
        this.searchList(title)
      })
    })
  }

  // 新增自运营专辑，编辑自运营专辑的辅助函数
  handleMainFocusAddOrEdit(options, callBack) {
    this.refs.mask.show()
    apiSelfFocusAddOrEdit(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        callBack && callBack()
      })
  }



  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
    this.editBannerId = null
    this.editId = null
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEdidSmallTypes: this.state.addOrEdidSmallTypes,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

    return (
      <div className="self-focus">
        {/* 搜索 */}
        <List className="search-list" bordered>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="inline"
          >
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">ID</span>}
              >
                <InputNumber
                  ref="searchIdref"
                  style={{ width: 190 }} placeholder="请输入ID" onChange={v => this.setState({ searchId: v })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">焦点图名称</span>}
              >
                <Input style={{ width: 190 }} placeholder="请输入焦点图名称" onChange={e => this.setState({ searchName: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">跳转类型</span>}
              >
                <Select
                  style={{ width: 190 }}
                  placeholder="请选择"
                  allowClear
                  onChange={value => this.setState({ contentType: value })}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={1}>单个用户</Option>
                  <Option value={2}>单个专辑</Option>
                  <Option value={3}>单个声音</Option>
                  <Option value={4}>链接</Option>
                  <Option value={9}>听单</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">分类来源</span>}
              >
                <Select
                  style={{ width: 190 }}
                  placeholder="请选择分类来源"
                  allowClear
                  onChange={value => {
                    this.getCategories(value)
                    this.setState({
                      categorySource: value,
                      categoryId: undefined
                    })
                  }}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={1}>主站</Option>
                  <Option value={2}>自运营</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">分类</span>}
              >
                <Select
                  placeholder="请选择分类"
                  style={{ width: 190 }}
                  allowClear
                  onChange={value => this.setState({ categoryId: value })}
                  value={this.state.categoryId}
                  getPopupContainer={trigger => trigger.parentNode}
                  notFoundContent="请先选择分类来源"
                >
                  {
                    this.state.categories.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">是否外部链接</span>}
              >
                <Select
                  style={{ width: 190 }}
                  placeholder="请选择"
                  allowClear
                  onChange={value => this.setState({ isExternalUrl: value })}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">状态</span>}
              >
                <Select
                  style={{ width: 190 }}
                  placeholder="请选择"
                  allowClear
                  onChange={value => this.setState({ onlineStatus: value })}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={1}>已上架</Option>
                  <Option value={2}>已下架</Option>
                  <Option value={0}>未知</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">创建时间</span>}
              >
                <DatePicker
                  style={{ width: 190 }}
                  showTime={
                    {
                      defaultValue: moment().startOf('day'),
                      hideDisabledOptions: true,
                    }
                  }
                  showToday={false}
                  value={searchCreateTimeBegin}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择开始时间"
                  disabledDate={this.props.disabledCreateBeginDate}
                  disabledTime={this.props.disabledCreateBeiginTime}
                  onChange={this.props.onCreateBeginDateAndTimeChange}
                  getCalendarContainer={trigger => trigger.parentNode}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">创建时间</span>}
              >
                <DatePicker
                  style={{ width: 190 }}
                  showTime={
                    {
                      defaultValue: moment().endOf('day'),
                      hideDisabledOptions: true,
                    }
                  }
                  showToday={false}
                  value={searchCreateTimeEnd}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择结束时间"
                  disabledDate={this.props.disabledCreateEndDate}
                  disabledTime={this.props.disabledCreateEndTime}
                  onChange={this.props.onCreateEndDateAndTimeChange}
                  getCalendarContainer={trigger => trigger.parentNode}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">更新时间</span>}
              >
                <DatePicker
                  style={{ width: 190 }}
                  showTime={
                    { defaultValue: moment().startOf('day'), hideDisabledOptions: true }

                  }
                  showToday={false}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择开始时间"
                  value={searchUpdateTimeBegin}
                  disabledDate={this.props.disabledUpdateBeginDate}
                  disabledTime={this.props.disabledUpdateBeiginTime}
                  onChange={this.props.onUpdateBeginDateAndTimeChange}
                  getCalendarContainer={trigger => trigger.parentNode}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">更新时间</span>}
              >
                <DatePicker
                  style={{ width: 190 }}
                  showTime={
                    { defaultValue: moment().endOf('day'), hideDisabledOptions: true }
                  }
                  showToday={false}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择结束时间"
                  value={searchUpdateTimeEnd}
                  disabledDate={this.props.disabledUpdateEndDate}
                  disabledTime={this.props.disabledUpdateEndTime}
                  onChange={this.props.onUpdateEndDateAndTimeChange}
                  getCalendarContainer={trigger => trigger.parentNode}
                />
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
              <Button className="btn" type="primary" onClick={() => this.addSelfFocus()}>新增焦点图</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} sortNameArr={['创建时间', '更新时间']} />
              </div>
            </Col>
          </Row>
        </List>
        <SelfFocusListTable {...tableOptions} />
        {
          this.state.addOrEditVisible
            ?
            <WrapperSelfFocusAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SelfFocus)
export default WrappedAdvancedSearchForm
