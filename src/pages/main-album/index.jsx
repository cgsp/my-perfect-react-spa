/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-30 17:21:50
 */


import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Select, DatePicker, message, Modal } from 'antd'
import moment from 'moment'

import { myTrim } from '@Utils/myTrim'
import { myGetStampTime } from '@Utils/myGetTime'
import { DOWN_LOAD_URL } from '@Constants'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TimeControlHoc from '@Components/time-control-hoc'

import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

import { apiSelfTagTagList, apiSelfTagTagDetailList, apiSelfTagTagDelete } from '@Api/self-tag-tag'

import SelfTagTagListTable from './list-table'
import WrapperSelfTagTagAddOrEdit from './add-or-edit'
import SelfTagTagDetailTable from './detail-table'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option


@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesions }
)
@TimeControlHoc
class SelfTagTag extends Component {
  constructor() {
    super()
    this.state = {
      sortIndex: 1,
      sortDirection: 'down',
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
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
    this.tableSelect = this.tableSelect.bind(this)
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
      page: 1,
      pageNo: 10,
      sortIndex: 1,
      sortDirection: 'down'
    })
    // 获取公用的维度数据
    this.props.getCommonDimesions()
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
    this.searchList()
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
  searchList(tip) {
    this.setState({
    }, () => {
      const state = { ...this.state, ...this.props.state }
      const {
        pageSize,
        pageNo,
        searchTag,
        searchDimension,
        sortIndex,
        sortDirection,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd } = state

      this.getListData({
        pageSize,
        pageNo,
        searchTag,
        searchDimension,
        sortIndex,
        sortDirection,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
        tip
      })
    })
  }

  // 处理导出options或者搜索options的配套函数
  handleSearchOrExportOptions(options) {
    // 去掉空格
    options.searchTag = !options.searchTag ? '' : myTrim(options.searchTag)

    // 将时间对象转换为时间戳
    function transToStamp(date) {
      if (date) {
        return myGetStampTime(date)
      }
      return date
    }

    options.searchCreateTimeBegin = transToStamp(options.searchCreateTimeBegin)
    options.searchCreateTimeEnd = transToStamp(options.searchCreateTimeEnd)
    options.searchUpdateTimeBegin = transToStamp(options.searchUpdateTimeBegin)
    options.searchUpdateTimeEnd = transToStamp(options.searchUpdateTimeEnd)

    return options
  }

  // 获取列表页面的数据
  getListData(options) {
    this.refs.mask.show()

    options = this.handleSearchOrExportOptions(options)

    apiSelfTagTagList(options)
      .then(res => {
        this.refs.mask.hide()
        const tableData = res.list.map(item => {
          item.key = item.tagId
          return item
        })
        this.setState({
          tableData: tableData,
          tableTotal: res.total,
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (options.tip) {
          message.success(`${options.tip}成功`)
        }
      })
  }

  // 列表页面的勾选
  tableSelect(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({
      selectedRowKeys
    })
  }

  // 专辑或者标签批量导出
  export(type) {
    this.setState({}, () => {
      const state = { ...this.state, ...this.props.state }
      const {
        searchTag,
        searchDimension,
        sortIndex,
        sortDirection,
        selectedRowKeys,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd } = state
      let options = {
        searchTag,
        searchDimension,
        sortIndex,
        sortDirection,
        selectedRowKeys,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd
      }

      options = this.handleSearchOrExportOptions(options)

      const DEV = process.env.NODE_ENV !== 'production'
      let baseURL

      if (DEV) {
        baseURL = DOWN_LOAD_URL.dev
      } else {
        baseURL = DOWN_LOAD_URL.pro
      }

      let str = baseURL + '?'
      for (const key in options) {
        if (options[key] || options[key] === 0 || options[key] === false) {
          str += `${key}=${options[key]}&`
        }
      }
      str = str.slice(0, -1)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', str)
      a.setAttribute('download', '列表')
      a.click()
    })
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    console.log('编辑', line)
    this.setState({
      addOrEditTitle: '编辑标签',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
    // 更新下公用的维度数据
    this.props.getCommonDimesions()
  }

  tableLineDelete(line) {
    console.log('删除', line)
    Modal.confirm({
      title: '确定要删除吗？',
      content: '删除了之后，所有专辑对应的该标签也都会被删除',
      onOk: () => {
        apiSelfTagTagDelete(line.tagId)
          .then(res => {
            this.setState({
              pageNo: 1
            })
            // 更新下公用的维度数据
            this.props.getCommonDimesions()
            // 更新下列表页面
            this.searchList('删除')
          })
      }
    })
  }

  // 新增标签
  addTag() {
    this.setState({
      addOrEditTitle: '新增标签',
      addOrEditVisible: true,
      addOrEditInitValues: {}
    })
    // 更新下公用的维度数据
    this.props.getCommonDimesions()
  }

  // 新增或者编辑标签，点击弹框的确定
  addOrEditOk(values, title) {
    console.log(values, title)
    message.success(`${title}成功`)
    this.setState({
      addOrEditVisible: false
    })
  }
  // 新增或者编辑标签，关闭弹框
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
  }

  // 查看专辑数的详情--弹框列表
  tableLineShowDetails(line, type) {
    console.log(type)
    if (type === '主站专辑数') {
      // 发送A请求
    } else {
      // 发送B请求
    }
    console.log('查看详情', line)
    this.detailId = line.tagId
    this.getDetailData({
      pageNo: 1,
      pageSize: 10,
      detailId: this.detailId
    })

  }

  // 获取专辑详情列表的配套函数
  getDetailData(options) {
    this.refs.mask.show()
    apiSelfTagTagDetailList(options)
      .then(res => {
        this.refs.mask.hide()
        const detailData = res.list.map(item => {
          item.key = item.albumId
          return item
        })
        this.setState({
          detailData,
          detailTotal: res.total,
          detailVisible: true
        })
      })
  }

  // 详情页面的翻页或者每页的页码改变
  detailPageOrPageSizeChange(current, pageSize) {
    console.log(this.detailId)
    this.getDetailData({
      pageNo: current,
      pageSize,
      detailId: this.detailId
    })
  }

  // 显示详情total
  detailShowTotal(total) {
    return `共 ${total} 条`
  }

  // 关闭详情列表
  detailCancel() {
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
      tableLineDelete: this.tableLineDelete,
      tableSelect: this.tableSelect,
      selectedRowKeys: this.state.selectedRowKeys,
      tableLineShowDetails: this.tableLineShowDetails,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      pageNo: this.state.pageNo
    }

    const detailTableOptions = {
      detailVisible: this.state.detailVisible,
      detailTotal: this.state.detailTotal,
      detailData: this.state.detailData,
      detailCancel: this.detailCancel,
      detailPageOrPageSizeChange: this.detailPageOrPageSizeChange,
      detailShowTotal: this.detailShowTotal,
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
      <div className="self-tag-tag">
        {/* 搜索 */}
        <List className="search-list" bordered>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="inline"
          >
            <Row>
              <Col span={6}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">标签名称</span>}
                >
                  <Input placeholder="请输入标签名称" onChange={e => this.setState({ searchTag: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">维度</span>}
                >
                  <Select
                    placeholder="请选择维度"
                    style={{ minWidth: 164 }}
                    allowClear
                    onChange={value => this.setState({ searchDimension: value })}
                  >
                    {
                      this.props.commonDimesions.map(item => (
                        <Option key={item.dimensionId} value={item.dimensionId}>{item.dimensionName}</Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">创建时间</span>}
                >
                  <DatePicker
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
                  />
                </FormItem>

              </Col>
              <Col span={6}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">创建时间</span>}
                >
                  <DatePicker
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
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">更新时间</span>}
                >
                  <DatePicker
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
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">更新时间</span>}
                >
                  <DatePicker
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
                  />
                </FormItem>
              </Col>
              <Col span={6} className="search-btn">
                <Button className="searchBtn" type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List className="handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={() => this.addTag()}>新增标签</Button>
              <Button className="btn" type="primary" onClick={() => this.export('listen')}>标签批量导出</Button>
              <Button className="btn" type="primary" onClick={() => this.export('album')}>专辑批量导出</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <SelfTagTagListTable {...tableOptions} />
        <SelfTagTagDetailTable {...detailTableOptions} />
        <WrapperSelfTagTagAddOrEdit {...addOrEditOptions} />
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SelfTagTag)
export default WrappedAdvancedSearchForm
