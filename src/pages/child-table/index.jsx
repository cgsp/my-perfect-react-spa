/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-15 11:13:13
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

import { apiChildTableList, apiChildTableSave, apiChildParter } from '@Api/child-table'

import MainClassfiyListTable from './list-table'
import WrapperChildTablesave from './save'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option


@TimeControlHoc
class ChildTable extends Component {
  constructor() {
    super()
    this.state = {
      sortIndex: 1,
      sortDirection: 'down',
      tableTotal: 0,
      tableData: [],
      pageNo: 1,
      pageSize: 10,

      detailVisible: false,
      detailTotal: 0,
      detailData: [],

      saveVisible: false,
      saveInitValues: {},

      parterSelectData: []
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineSave = this.tableLineSave.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.saveOk = this.saveOk.bind(this)
    this.saveCancel = this.saveCancel.bind(this)

    // 模糊匹配
    this.handleParterSelectChange = this.handleParterSelectChange.bind(this)
    this.handleParterSelectSearch = this.handleParterSelectSearch.bind(this)
    this.timeout = null
    this.currentAccount = ''
  }

  componentDidMount() {
    // 初始化查询列表数据
    // this.getListData({
    //   pageNo: 1,
    //   pageSize: 10,
    //   sortIndex: 1,
    //   sortDirection: 'down',
    // })
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
        appKey,
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
        appKey,
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

    // 去掉空格
    options.searchName = !options.searchName ? '' : myTrim(options.searchName)
    options.siteName = options.searchName
    delete options.searchName

    // 将时间对象转换为时间戳
    function transToStamp(date) {
      if (date) {
        return myGetStampTime(date)
      }
      return date
    }

    options.createdTimeBegin = transToStamp(options.searchCreateTimeBegin)
    delete options.searchCreateTimeBegin
    options.createdTimeEnd = transToStamp(options.searchCreateTimeEnd)
    delete options.searchCreateTimeEnd
    options.updatedTimeBegin = transToStamp(options.searchUpdateTimeBegin)
    delete options.searchUpdateTimeBegin
    options.updatedTimeEnd = transToStamp(options.searchUpdateTimeEnd)
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

    apiChildTableList(options)
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
        callBack && callBack()
      })
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    console.log('编辑', line)
    this.props.history.push({
      pathname: '/child-table-edit',
      query: {
        data: [{
          name: 'guan',
          age: 18
        }]
      }
    })
  }

  addBegin() {
    this.props.history.push({
      pathname: '/child-table-add',
    })
  }


  // 另存为的确定
  saveOk(values) {
    this.handleSave(values, () => {
      this.saveCancel()
      this.searchList('另存为')
    })
  }

  // 另存为ajax
  handleSave(options, callBack) {
    this.refs.mask.show()
    apiChildTableSave(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        callBack && callBack()
      })
  }

  // 另存为关闭弹框
  saveCancel() {
    this.setState({
      saveVisible: false
    })
  }

  async tableLineSave(line) {
    try {
      if (line.appName && line.appKey) {
        const options = {
          appName: line.appName
        }
        this.refs.mask.show()
        const parterRes = await apiChildParter(options)
        this.refs.mask.hide()
        if (parterRes.code !== ERR_OK) {
          message.error(parterRes.msg)
          return
        }
        const result = parterRes.data.slice(0, 20)
        let parterSelectData = []
        result.forEach(item => {
          parterSelectData.push({
            value: item.appKey,
            text: item.appName
          })
        })
        line.parterSelectData = parterSelectData.slice()
      } else {
        line.appKey = undefined
        line.parterSelectData = []
      }
      this.setState({
        saveTitle: '子站另存为',
        saveVisible: true,
        saveInitValues: line,
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 合作方的模糊匹配
  handleParterSelectSearch(value) {
    // console.log(value)
    this.getSelectUserList(value, data => this.setState({ parterSelectData: data }))
  }

  // 合作方的模糊匹配
  getSelectUserList(value, callback) {
    if (!value) {
      return
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.currentAccount = value

    const options = {
      appName: value
    }
    this.timeout = setTimeout(() => {
      apiChildParter(options)
        .then(res => {
          if (this.currentAccount === value) {
            if (res.code !== ERR_OK) {
              message.error(res.msg)
              return
            }
            // 只取前面的20条
            let result = res.data.slice(0, 20)
            const arr = []
            result.forEach(item => {
              arr.push({
                value: item.appKey,
                text: item.appName
              })
            })
            console.log(res)
            callback(arr)
          }
        })
    }, 300)

  }

  // 合作方的模糊匹配
  handleParterSelectChange(value) {
    this.setState({
      appKey: value,
    }, () => {
      console.log(this.state.appKey)
    })
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineSave: this.tableLineSave,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const saveOptions = {
      saveTitle: this.state.saveTitle,
      saveVisible: this.state.saveVisible,
      saveInitValues: this.state.saveInitValues,
      saveOk: this.saveOk,
      saveCancel: this.saveCancel,
    }

    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

    return (
      <div className="child-table">
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
                label={<span className="form-label">子站ID</span>}
              >
                <InputNumber
                  ref="searchIdref"
                  value={this.state.searchId}
                  style={{ width: 190 }} placeholder="请输入子站ID" onChange={v => this.setState({ searchId: v })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">子站名称</span>}
              >
                <Input style={{ width: 190 }} placeholder="请输入子站名称" onChange={e => this.setState({ searchName: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">合作方</span>}
              >
                <Select
                  showSearch
                  style={{ width: 190 }}
                  placeholder="请输入合作方"
                  allowClear={true}
                  value={this.state.appKey}
                  onSearch={this.handleParterSelectSearch}
                  onChange={this.handleParterSelectChange}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  notFoundContent={'根据此关键字，无法搜索'}
                >
                  {
                    this.state.parterSelectData.map(item => (
                      <Option key={item.value}>{item.text}</Option>
                    ))
                  }
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
              <Button className="btn" type="primary" onClick={() => this.addBegin()}>新增子站</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} sortNameArr={['创建时间', '更新时间']} />
              </div>
            </Col>
          </Row>
        </List>
        <MainClassfiyListTable {...tableOptions} />
        {
          this.state.saveVisible
            ?
            <WrapperChildTablesave {...saveOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(ChildTable)
export default WrappedAdvancedSearchForm
