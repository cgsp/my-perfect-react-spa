/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-10 14:13:39
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

import { apiSelfClassfiyList, apiSelfClassfiyDetail, apiSelfClassfiyEdit, apiSelfClassfiyAdd } from '@Api/self-classfiy'

import MainClassfiyListTable from './list-table'
import WrapperMainClassfiyAddOrEdit from './add-or-edit'
import MainClassfiyDimensionDetailTable from './detail-table'
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

      detailVisible: false,
      detailTotal: 0,
      detailData: [],

      addOrEditVisible: false,
      addOrEditInitValues: {},
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.detailCancel = this.detailCancel.bind(this)
    this.detailPageOrPageSizeChange = this.detailPageOrPageSizeChange.bind(this)
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
    options.name = options.searchName
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

    apiSelfClassfiyList(options)
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
  tableLineEdit(line) {
    console.log('编辑', line)
    this.editId = line.id
    this.editSourceId = line.sourceId
    this.editOnlineStatus = line.onlineStatus
    this.setState({
      addOrEditTitle: '编辑分类',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
  }

  addBegin() {
    this.setState({
      addOrEditTitle: '新增分类',
      addOrEditVisible: true,
      addOrEditInitValues: {}
    })
  }


  // 编辑的确定
  addOrEditOk(values, title) {
    if (title === '编辑分类') {
      values.id = this.editId
      values.source = 1
      values.sourceId = this.editSourceId
      values.onlineStatus = this.editOnlineStatus
      this.handleSelfTagEdit(values, (res) => {
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
              title: '编辑分类结果',
              content: content,
              okText: '确认',
              footer: null
            })
          } else if (res.data.clickUrl && res.data.invalidCount === 0) {
            message.success('编辑成功')
          } else {
            message.error('编辑失败')
          }
        })
      })
    }
    if (title === '新增分类') {
      values.source = 2
      values.onlineStatus = 1
      this.handleSelfTagAdd(values, (res) => {
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
              title: '新增分类结果',
              content: content,
              okText: '确认',
              footer: null
            })
          } else if (res.data.clickUrl && res.data.invalidCount === 0) {
            message.success('新增分类成功')
          } else {
            message.error('新增分类失败')
          }
        })
      })
    }
  }

  // 编辑
  handleSelfTagEdit(options, callBack) {
    this.refs.mask.show()
    apiSelfClassfiyEdit(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        callBack && callBack(res)
      })
  }

  // 新增
  handleSelfTagAdd(options, callBack) {
    this.refs.mask.show()
    apiSelfClassfiyAdd(options)
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
    this.editId = null
    this.editSourceId = null
    this.editOnlineStatus = null
  }

  // 查看专辑数的详情--弹框列表
  tableLineShowDetails(line, type) {
    console.log('查看详情', line)
    this.detailId = line.id
    let detailTitle
    if (line.contentType === 1) {
      detailTitle = '专辑列表'
    } else {
      detailTitle = '声音列表'
    }
    this.setState({
      detailPageNo: 1,
      detailPageSize: 10,
      detailTitle
    })
    this.getDetailData({
      pageNo: 1,
      pageSize: 10,
      id: this.detailId,
    })
  }

  // 获取专辑详情列表的配套函数
  getDetailData(options) {
    this.refs.mask.show()
    apiSelfClassfiyDetail(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        const detailData = res.data.dataList.map(item => {
          item.key = item.id
          return item
        })
        this.setState({
          detailData,
          detailTotal: res.data.totalNum,
          detailVisible: true
        })
      })
  }

  // 详情页面的翻页或者每页的页码改变
  detailPageOrPageSizeChange(current, pageSize) {
    this.setState({
      detailPageNo: current,
      detailPageSize: pageSize,
    })
    this.getDetailData({
      pageNo: current,
      pageSize,
      id: this.detailId,
    })
  }

  // 显示详情total
  detailShowTotal(total) {
    return `共 ${total} 条`
  }

  // 关闭详情列表
  detailCancel() {
    this.detailId = ''
    this.setState({
      detailVisible: false
    })
  }


  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineShowDetails: this.tableLineShowDetails,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const detailTableOptions = {
      detailTitle: this.state.detailTitle,
      detailVisible: this.state.detailVisible,
      detailPageNo: this.state.detailPageNo,
      detailTotal: this.state.detailTotal,
      detailData: this.state.detailData,
      detailCancel: this.detailCancel,
      detailPageOrPageSizeChange: this.detailPageOrPageSizeChange,
      detailShowTotal: this.detailShowTotal
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
      <div className="self-classfiy">
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
                label={<span className="form-label">分类名称</span>}
              >
                <Input style={{ width: 190 }} placeholder="请输入分类名称" onChange={e => this.setState({ searchName: e.target.value })} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">内容类型</span>}
              >
                <Select
                  style={{ width: 190 }}
                  placeholder="请选择"
                  allowClear
                  onChange={value => this.setState({ contentType: value })}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={1}>专辑</Option>
                  <Option value={2}>声音</Option>
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
              <Button className="btn" type="primary" onClick={() => this.addBegin()}>新增分类</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} sortNameArr={['创建时间', '更新时间']} />
              </div>
            </Col>
          </Row>
        </List>
        <MainClassfiyListTable {...tableOptions} />
        {
          this.state.detailVisible
            ?
            <MainClassfiyDimensionDetailTable {...detailTableOptions} />
            : null
        }
        {
          this.state.addOrEditVisible
            ?
            <WrapperMainClassfiyAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(MainAlbum)
export default WrappedAdvancedSearchForm
