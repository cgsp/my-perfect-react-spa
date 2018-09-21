/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-21 09:58:31
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

import { apiMainList, apiMainListDetail } from '@Api/main-list'

import SelfAlbumListTable from './list-table'
import SelfTagDimensionDetailTable from './detail-table'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option

@TimeControlHoc
class SelfTagTag extends Component {
  constructor() {
    super()
    this.state = {
      sortIndex: 1,
      sortDirection: 'down',
      categories: [],
      categoryId: undefined,
      categorySource: undefined,
      tagSelectData: [],
      tableTotal: 0,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      selectedRowKeys: [],

      detailVisible: false,
      detailTotal: 0,
      detailData: [],

      addOrEditVisible: false,
      addOrEditInitValues: {},
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.detailCancel = this.detailCancel.bind(this)
    this.detailPageOrPageSizeChange = this.detailPageOrPageSizeChange.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.getListData({
      pageNo: 1,
      pageSize: 10,
      sortIndex: 1,
      sortDirection: 'down',
    })
    // 获取公用的维度数据
    // this.props.getCommonDimesions()
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
    this.refs.rankingListIdref.blur()
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
        rankingListId,
        searchTitle,
        searchSubtitle,
        periodType,
        contentType,
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
        rankingListId,
        searchTitle,
        searchSubtitle,
        periodType,
        contentType,
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
    // 去掉空格
    // options.searchId = !options.searchId ? '' : myTrim(options.searchId)
    options.id = options.searchId
    delete options.searchId

    // 去掉空格
    options.searchTitle = !options.searchTitle ? '' : myTrim(options.searchTitle)
    options.title = options.searchTitle
    delete options.searchTitle

    // 去掉空格
    options.searchSubtitle = !options.searchSubtitle ? '' : myTrim(options.searchSubtitle)
    options.subtitle = options.searchSubtitle
    delete options.searchSubtitle


    // 将时间对象转换为时间戳
    function transToStamp(date) {
      if (date) {
        return myGetStampTime(date)
      }
      return date
    }

    options.createTimeBegin = transToStamp(options.searchCreateTimeBegin)
    delete options.searchCreateTimeBegin
    options.createTimeEnd = transToStamp(options.searchCreateTimeEnd)
    delete options.searchCreateTimeEnd
    options.updateTimeBegin = transToStamp(options.searchUpdateTimeBegin)
    delete options.searchUpdateTimeBegin
    options.updateTimeEnd = transToStamp(options.searchUpdateTimeEnd)
    delete options.searchUpdateTimeEnd

    // 处理排序的
    options.orderBy = options.sortIndex === 0 ? 'created_at' : 'updated_at'
    delete options.sortIndex
    options.desc = options.sortDirection === 'up' ? false : true
    delete options.sortDirection

    options.albumIds = options.selectedRowKeys

    return options
  }

  // 获取列表页面的数据
  getListData(options, callBack) {
    this.refs.mask.show()

    options = this.handleSearchOrExportOptions(options)
    delete options.albumIds

    apiMainList(options)
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
          selectedRowKeys: []
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (options.tip) {
          message.success(`${options.tip}成功`)
        }
        callBack && callBack(res.data.totalNum)
      })
  }

  // 查看专辑数的详情--弹框列表
  tableLineShowDetails(line, type) {
    // console.log('查看详情', line)
    this.rankId = line.id
    this.setState({
      detailPageNo: 1,
      detailPageSize: 10,
    })
    this.getDetailData({
      pageNo: 1,
      pageSize: 10,
      rankId: this.rankId,
    })
  }

  // 获取专辑详情列表的配套函数
  getDetailData(rankId) {
    this.refs.mask.show()
    apiMainListDetail(rankId)
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
      rankId: this.rankId,
    })
  }

  // 显示详情total
  detailShowTotal(total) {
    return `共 ${total} 条`
  }

  // 关闭详情列表
  detailCancel() {
    this.rankId = ''
    this.setState({
      detailVisible: false
    })
  }


  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineShowDetails: this.tableLineShowDetails,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const detailTableOptions = {
      detailVisible: this.state.detailVisible,
      detailPageNo: this.state.detailPageNo,
      detailTotal: this.state.detailTotal,
      detailData: this.state.detailData,
      detailCancel: this.detailCancel,
      detailPageOrPageSizeChange: this.detailPageOrPageSizeChange,
      detailShowTotal: this.detailShowTotal
    }

    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

    return (
      <div className="main-list">
        {/* 搜索 */}
        <List className="search-list" bordered>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="inline"
          >
            <Row>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">主站ID:</span>}
                  colon={false}
                >
                  <InputNumber
                    ref="rankingListIdref"
                    style={{ width: 190 }} placeholder="请输入主站ID" onChange={v => this.setState({ rankingListId: v })}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">榜单ID:</span>}
                  colon={false}
                >
                  <InputNumber
                    ref="searchIdref"
                    style={{ width: 190 }} placeholder="请输入榜单ID" onChange={v => this.setState({ searchId: v })}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">榜单标题:</span>}
                  colon={false}
                >
                  <Input style={{ width: 190 }} placeholder="请输入榜单标题" onChange={e => this.setState({ searchTitle: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">副标题:</span>}
                  colon={false}
                >
                  <Input style={{ width: 190 }} placeholder="请输入副标题" onChange={e => this.setState({ searchSubtitle: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">周期类型:</span>}
                  colon={false}
                >
                  <Select
                    style={{ width: 190 }}
                    placeholder="请选择"
                    allowClear
                    onChange={value => this.setState({ periodType: value })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value={'日榜'}>日榜</Option>
                    <Option value={'周榜'}>周榜</Option>
                    <Option value={'月榜'}>月榜</Option>
                    <Option value={'年榜'}>年榜</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">内容类型:</span>}
                  colon={false}
                >
                  <Select
                    style={{ width: 190 }}
                    placeholder="请选择"
                    allowClear
                    onChange={value => this.setState({ contentType: value })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value={1}>声音榜单</Option>
                    <Option value={2}>专辑榜单</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">创建起始时间:</span>}
                  colon={false}
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
                    placeholder="请选择起始时间"
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
                  label={<span className="form-label">创建结束时间:</span>}
                  colon={false}
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
                  label={<span className="form-label">更新起始时间:</span>}
                  colon={false}
                >
                  <DatePicker
                    style={{ width: 190 }}
                    showTime={
                      { defaultValue: moment().startOf('day'), hideDisabledOptions: true }

                    }
                    showToday={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择起始时间"
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
                  label={<span className="form-label">更新结束时间:</span>}
                  colon={false}
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
            </Row>
            <Row>
              <Col span={8} className="search-btn">
                <Button className="searchBtn" type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List className="handle-buttons">
          <Row>
            <Col span={24} className="line">
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <SelfAlbumListTable {...tableOptions} />
        {
          this.state.detailVisible
            ?
            <SelfTagDimensionDetailTable {...detailTableOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SelfTagTag)
export default WrappedAdvancedSearchForm
