/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-11 19:24:56
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, DatePicker, message, Select, InputNumber, Modal } from 'antd'
import moment from 'moment'

import { myTrim } from '@Utils/myTrim'
import { myGetStampTime } from '@Utils/myGetTime'
import { ERR_OK } from '@Constants'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TimeControlHoc from '@Components/time-control-hoc'

import { apiMainClassfiyList, apiMainClassfiyDetail, apiMainClassfiyAddOrEdit } from '@Api/main-classfiy'

import MainFocusListTable from './list-table'
import WrapperMainFocusAddOrEdit from './add-or-edit'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option


@TimeControlHoc
class MainAlbum extends Component {
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
    this.tableLineSave = this.tableLineSave.bind(this)
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
    this.refs.searchIdref.blur()
    this.refs.searchBannerIdref.blur()
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
        searchBannerId,
        searchName,
        contentType,
        onlineStatus,
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
        searchBannerId,
        searchName,
        contentType,
        onlineStatus,
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

    options.searchBannerId = !options.searchBannerId ? '' : myTrim(options.searchBannerId + '')
    options.bannerId = options.searchBannerId
    delete options.searchBannerId

    options.source = 1

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

    options.createdTimeBegin = transToStamp(options.searchCreateTimeBegin)
    delete options.searchCreateTimeBegin
    options.createdTimeEnd = transToStamp(options.searchCreateTimeEnd)
    delete options.searchCreateTimeEnd
    options.updatedTimeBegin = transToStamp(options.searchUpdateTimeBegin)
    delete options.searchUpdateTimeBegin
    options.updatedTimeEnd = transToStamp(options.searchUpdateTimeEnd)
    delete options.searchUpdateTimeEnd

    // 处理排序的
    options.orderBy = (options.sortIndex === 0 ? 'createdAt' : 'updatedAt')
    delete options.sortIndex
    options.desc = options.sortDirection === 'up' ? false : true
    delete options.sortDirection
    return options
  }

  // 获取列表页面的数据
  getListData(options, callBack) {
    this.refs.mask.show()
    options = this.handleSearchOrExportOptions(options)

    apiMainClassfiyList(options)
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

  // 列表页面的另存为
  tableLineSave(line) {
    console.log('另存为', line)
    this.saveId = line.id
    this.saveSourceId = line.sourceId
    this.saveOnlineStatus = line.onlineStatus
    this.setState({
      addOrEditTitle: '另存为自运营分类',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
  }


  // 另存为的确定
  addOrEditOk(values) {
    values.id = this.saveId
    values.source = 1
    values.sourceId = this.saveSourceId
    values.onlineStatus = this.saveOnlineStatus
    this.handleSelfTagAddOrEdit(values, (res) => {
      this.setState({
        addOrEditVisible: false
      }, () => {
        // 刷新维度列表页面
        this.searchList()
        if (res.data.clickUrl && res.data.invalidCount !== 0) {
          const content = (
            <div>
              <p style={{ textAlign: 'center' }}>成功了{res.data.validCount ? res.data.validCount : 0}条</p>
              <p style={{ textAlign: 'center' }}>失败了{res.data.invalidCount ? res.data.invalidCount : 0}条</p>
              <p style={{ textAlign: 'center' }}>
                <a href={res.data.clickUrl}>查看统计结果</a>
              </p>
            </div>
          )
          Modal.confirm({
            title: '另存为结果',
            content: content,
            okText: '确认',
            footer: null
          })
        } else if (res.data.clickUrl && res.data.invalidCount === 0) {
          message.success('另存为成功')
        } else {
          message.error('另存为失败')
        }
      })
    })
  }

  // 新增自运营专辑，编辑自运营专辑的辅助函数
  handleSelfTagAddOrEdit(options, callBack) {
    this.refs.mask.show()
    apiMainClassfiyAddOrEdit(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        callBack && callBack(res)
      })
  }



  // 新增或者编辑自运营专辑，关闭弹框
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
    this.saveId = null
    this.saveSourceId = null
    this.saveOnlineStatus = null
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineSave: this.tableLineSave,
      tableLineShowDetails: this.tableLineShowDetails,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

    return (
      <div className="main-focus">
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
                label={<span className="form-label">主站ID</span>}
              >
                <InputNumber
                  ref="searchBannerIdref"
                  style={{ width: 190 }} placeholder="请输入主站ID" onChange={v => this.setState({ searchBannerId: v })}
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
                  <Option value={5}>多个用户</Option>
                  <Option value={6}>多个专辑</Option>
                  <Option value={7}>多个声音</Option>
                  <Option value={8}>活动</Option>
                  <Option value={9}>听单</Option>
                  <Option value={10}>广告</Option>
                  <Option value={11}>直播</Option>
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
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} sortNameArr={['创建时间', '更新时间']} />
              </div>
            </Col>
          </Row>
        </List>
        <MainFocusListTable {...tableOptions} />
        {
          this.state.addOrEditVisible
            ?
            <WrapperMainFocusAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(MainAlbum)
export default WrappedAdvancedSearchForm
