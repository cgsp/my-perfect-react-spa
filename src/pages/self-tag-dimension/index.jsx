/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-28 11:03:36
 */


import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, DatePicker, message, Modal } from 'antd'
import moment from 'moment'

import { myTrim } from '@Utils/myTrim'
import { myGetStampTime } from '@Utils/myGetTime'
import { DOWN_LOAD_URL } from '@Constants'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TimeControlHoc from '@Components/time-control-hoc'

import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

import { apiSelfTagDimensionList, apiSelfTagDimensionDetailList, apiSelfTagDimensionDelete } from '@Api/self-tag-dimension'

import SelfTagDimensionListTable from './list-table'
import WrapperSelfTagDimensionAddOrEdit from './add-or-edit'
import SelfTagDimensionDetailTable from './detail-table'
import './style.scss'

const FormItem = Form.Item


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
    this.tableLineAdd = this.tableLineAdd.bind(this)
    this.tableSelect = this.tableSelect.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.detailCancel = this.detailCancel.bind(this)
    this.detailPageOrPageSizeChange = this.detailPageOrPageSizeChange.bind(this)
    this.detailLineEditOrDelete = this.detailLineEditOrDelete.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.getListData({
      pageNo: 1,
      pageSize: 10,
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
        searchDimensionName,
        sortIndex,
        sortDirection,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd } = state

      this.getListData({
        pageSize,
        pageNo,
        searchDimensionName,
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
    options.searchDimensionName = !options.searchDimensionName ? '' : myTrim(options.searchDimensionName)
    options.dimensionName = options.searchDimensionName
    delete options.searchDimensionName

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
    options.orderBy = options.sortIndex === 0 ? 'createdAt' : 'updatedAt'
    delete options.sortIndex
    options.desc = options.sortDirection === 'up' ? true : false
    delete options.sortDirection

    return options
  }

  // 获取列表页面的数据
  getListData(options) {
    this.refs.mask.show()

    options = this.handleSearchOrExportOptions(options)

    apiSelfTagDimensionList(options)
      .then(res => {
        this.refs.mask.hide()
        const tableData = res.dataList.map(item => {
          item.key = item.id
          return item
        })
        this.setState({
          tableData: tableData,
          tableTotal: res.totalNum,
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
        searchDimensionName,
        sortIndex,
        sortDirection,
        selectedRowKeys,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd } = state
      let options = {
        searchDimensionName,
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
        if (options[key] || options[key] === 0) {
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
      addOrEditTitle: '编辑维度',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
  }

  tableLineDelete(line) {
    console.log('删除', line)
    Modal.confirm({
      title: '确定要删除吗？',
      content: '删除了之后，所有专辑对应的该维度，包括其标签都会被删除',
      onOk: () => {
        apiSelfTagDimensionDelete(line.dimensionId)
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

  // 列表页面，在当前维度下面添加标签
  tableLineAdd(line) {
    console.log('添加标签', line)
    this.dimensionId = line.dimensionId
    this.setState({
      addOrEditTitle: '添加标签',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
    // 更新下公用的维度数据
    this.props.getCommonDimesions()
  }

  // 新增标签
  addDimension() {
    this.setState({
      addOrEditTitle: '新增维度',
      addOrEditVisible: true,
      addOrEditInitValues: {}
    })
  }

  // 新增或者编辑标签，点击弹框的确定
  addOrEditOk(values, title) {
    console.log(values, title)
    if (title === '添加标签') {
      console.log('父维度的ID', this.dimensionId)
      // 表单提交了之后，需要讲dimensionId清空
      this.dimensionId = ''
      // 需要重新刷新列表
      this.searchList(title)
    } else if (title === '编辑标签') {
      // 调用编辑的接口，这个函数，写的时候，最好支持一个callBack的回调，讲下面的刷新写为回调
      // 需要重新刷新详情列表
      this.getDetailData({
        pageNo: 1,
        pageSize: 10,
        dimensionId: this.dimensionId,
        tip: '编辑标签'
      })
    } else {
      // 新增或者编辑维度
      // 需要重新刷新列表
      this.searchList(title)
    }
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
  tableLineShowDetails(line) {
    console.log('查看详情', line)
    this.dimensionId = line.dimensionId
    this.tagNameType = line.tagNameType
    this.getDetailData({
      pageNo: 1,
      pageSize: 10,
      dimensionId: this.dimensionId,

    })
    // 标志位
    this.setState({
      addOrEditTitle: '',
      addOrEditInitValues: {
        tagNameType: this.tagNameType
      }
    })

  }

  // 获取专辑详情列表的配套函数
  getDetailData(options) {
    this.refs.mask.show()
    apiSelfTagDimensionDetailList(options)
      .then(res => {
        this.refs.mask.hide()
        const detailData = res.list.map(item => {
          item.key = item.tagId
          return item
        })
        this.setState({
          detailData,
          detailTotal: res.total,
          detailVisible: true
        })
        // 针对删除，编之后，重新刷新页面的提示
        if (options.tip) {
          message.success(`${options.tip}成功`)
        }
      })
  }

  // 详情页面的翻页或者每页的页码改变
  detailPageOrPageSizeChange(current, pageSize) {
    console.log(this.detailId)
    this.getDetailData({
      pageNo: current,
      pageSize,
      dimensionId: this.dimensionId
    })
  }

  // 详情页面里面的删除与编辑
  detailLineEditOrDelete(line, type) {
    console.log(line, type, '当前的dimensionId:', this.dimensionId)
    if (type === '删除') {
      // 调删除的接口--写的时候，写这个函数的时候，支持一个callback最好，把这个callBack传进入
      // 刷新详情的列表接口
      this.getDetailData({
        pageNo: 1,
        pageSize: 10,
        dimensionId: this.dimensionId,
        tip: '删除标签'
      })
    } else {
      // 打开编辑的弹框
      this.setState({
        addOrEditTitle: '编辑标签',
        addOrEditVisible: true,
        addOrEditInitValues: {
          tagName: line.tagName,
          tagNameType: this.tagNameType
        }
      })
    }



    // 判断用户是否操作了删除或者编辑
    if (type === '删除') {
      // 这个仅仅是标志位
      this.setState({
        addOrEditTitle: '删除标签'
      })
    } else {
      // 这个仅仅是标志位
      this.setState({
        addOrEditTitle: '编辑标签'
      })
    }

  }

  // 显示详情total
  detailShowTotal(total) {
    return `共 ${total} 条`
  }

  // 关闭详情列表
  detailCancel() {
    this.dimensionId = ''
    this.tagNameType = ''
    this.setState({
      detailVisible: false
    }, () => {
      // 如果用户操作了详情里面的编辑或者删除的话--需要重新刷新列表页面
      if (this.state.addOrEditTitle) {
        this.searchList()
      }
    })
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      tableLineAdd: this.tableLineAdd,
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
      detailLineEditOrDelete: this.detailLineEditOrDelete
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
      <div className="self-tag-dimension">
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
                  label={<span className="form-label">维度名称</span>}
                >
                  <Input placeholder="请输入维度名称" onChange={e => this.setState({ searchDimensionName: e.target.value })} />
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
              <Button className="btn" type="primary" onClick={() => this.addDimension()}>新增维度</Button>
              <Button className="btn" type="primary" onClick={() => this.export('维度')}>维度导出</Button>
              <Button className="btn" type="primary" onClick={() => this.export('标签')}>标签导出</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <SelfTagDimensionListTable {...tableOptions} />
        {
          this.state.detailVisible
            ?
            <SelfTagDimensionDetailTable {...detailTableOptions} />
            : null
        }
        {
          this.state.addOrEditVisible
            ?
            <WrapperSelfTagDimensionAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SelfTagTag)
export default WrappedAdvancedSearchForm
