/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-03 16:07:26
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, DatePicker, message, Select, InputNumber } from 'antd'
import moment from 'moment'

import { myTrim } from '@Utils/myTrim'
import { myGetStampTime } from '@Utils/myGetTime'
import { DOWN_LOAD_URL, ERR_OK } from '@Constants'

import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TimeControlHoc from '@Components/time-control-hoc'

import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

import {
  apiSelfAddOrEdit, apiSelfTagTagList
} from '@Api/self-tag-tag'

import { apiSelfAlbumList, apiAlbumDetail } from '@Api/self-album'

import { commonSmallTypes } from '@Api'

import SelfAlbumListTable from './list-table'
import WrapperSelfTagDimensionAddOrEdit from './add-or-edit'
import SelfTagDimensionDetailTable from './detail-table'
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
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableSelect = this.tableSelect.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.detailCancel = this.detailCancel.bind(this)
    this.detailPageOrPageSizeChange = this.detailPageOrPageSizeChange.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
    // 模糊匹配
    this.handleTagSelectChange = this.handleTagSelectChange.bind(this)
    this.handleTagSelectSearch = this.handleTagSelectSearch.bind(this)
    this.timeout = null
    this.currentTag = ''
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

  // 获取搜索的数据
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
    this.refs.searchSourceIdref.blur()
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
        searchSourceId,
        searchTitle,
        paid,
        priceType,
        onlineStatus,
        categorySource,
        categoryId,
        ctagId,
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
        searchSourceId,
        searchTitle,
        paid,
        priceType,
        onlineStatus,
        categorySource,
        categoryId,
        ctagId,
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
    // options.searchSourceId = !options.searchSourceId ? '' : myTrim(options.searchSourceId)
    options.sourceId = options.searchSourceId
    delete options.searchSourceId

    // 去掉空格
    options.searchTitle = !options.searchTitle ? '' : myTrim(options.searchTitle)
    options.title = options.searchTitle
    delete options.searchTitle


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
    options.orderBy = options.sortIndex === 0 ? 'created_at' : 'updated_at'
    delete options.sortIndex
    options.asc = options.sortDirection === 'up' ? true : false
    delete options.sortDirection

    options.albumIds = options.selectedRowKeys

    return options
  }

  // 获取列表页面的数据
  getListData(options, callBack) {
    // this.refs.mask.show()

    options = this.handleSearchOrExportOptions(options)
    delete options.albumIds

    apiSelfAlbumList(options)
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

  // 列表页面的勾选
  tableSelect(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({
      selectedRowKeys
    })
  }

  // 导出
  export(type) {
    this.setState({}, () => {
      const state = { ...this.state, ...this.props.state }
      const {
        searchId,
        searchSourceId,
        searchTitle,
        paid,
        priceType,
        onlineStatus,
        categorySource,
        categoryId,
        ctagId,
        sortIndex,
        sortDirection,
        selectedRowKeys,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd } = state

      let options = {
        searchId,
        searchSourceId,
        searchTitle,
        paid,
        priceType,
        onlineStatus,
        categorySource,
        categoryId,
        ctagId,
        sortIndex,
        sortDirection,
        selectedRowKeys,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd
      }

      options = this.handleSearchOrExportOptions(options)

      delete options.selectedRowKeys

      console.log(options.albumIds)
      let newOptions
      if (type === '专辑批量导出') {
        if (options.albumIds.length !== 0) {
          // 勾选了
          newOptions = {
            albumIds: options.albumIds
          }
          this.exportHandle(newOptions, '/custom/albums/batchDownload')
        } else {
          // 没勾选
          delete options.albumIds
          // 先判断数量，然后再导出
          this.searchList('', (num) => {
            if (num > 5000) {
              message.error('当前搜索条件下，导出专辑数大于5000，请缩小搜索范围')
            } else {
              this.exportHandle(options, '/custom/albums/allDownload')
            }
          })
        }
      } else {
        // 声音批量导出，只支持勾选导出
        if (options.albumIds.length === 0) {
          message.error('请先勾选，才能导出声音')
        } else {
          newOptions = {
            albumIds: options.albumIds
          }
          this.exportHandle(newOptions, '/custom/tracks/batchDownload')
        }
      }
    })
  }

  exportHandle(options, url) {
    const DEV = process.env.NODE_ENV !== 'production'
    let baseURL

    if (DEV) {
      baseURL = DOWN_LOAD_URL.dev
    } else {
      baseURL = DOWN_LOAD_URL.pro
    }

    let str = baseURL + url + '?'
    for (const key in options) {
      if (options[key] || options[key] === 0 || options[key] === false) {
        str += `${key}=${options[key]}&`
      }
    }
    str = str.slice(0, -1)
    console.log(str)

    let a = document.createElement('a')
    document.body.appendChild(a)
    a.setAttribute('style', 'display:none')
    a.setAttribute('href', str)
    a.setAttribute('download', '列表')
    a.click()
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    console.log('编辑', line)
    this.setState({
      addOrEditTitle: '编辑自运营专辑',
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
  }


  // 新增自运营专辑
  addSelfAlbum() {
    this.setState({
      addOrEditTitle: '新增自运营专辑',
      addOrEditVisible: true,
      addOrEditInitValues: {}
    })
  }

  // 新增或者编辑自运营专辑，添加标签，点击弹框的确定
  addOrEditOk(values, title) {
    values.type = title
    this.handleSelfTagAddOrEdit(values, () => {
      this.setState({
        addOrEditVisible: false
      }, () => {
        // 刷新维度列表页面
        this.searchList(title)
      })
    })
  }

  // 新增自运营专辑，编辑自运营专辑的辅助函数
  handleSelfTagAddOrEdit(options, callBack) {
    this.refs.mask.show()
    apiSelfAddOrEdit(options)
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
  }

  // 查看专辑数的详情--弹框列表
  tableLineShowDetails(line, type) {
    console.log('查看详情', line)
    this.detailAlbumId = line.id
    this.setState({
      detailPageNo: 1,
      detailPageSize: 10,
    })
    this.getDetailData({
      pageNo: 1,
      pageSize: 10,
      albumId: this.detailAlbumId,
    })
  }

  // 获取专辑详情列表的配套函数
  getDetailData(options) {
    this.refs.mask.show()
    apiAlbumDetail(options)
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
      albumId: this.detailAlbumId,
    })
  }

  // 显示详情total
  detailShowTotal(total) {
    return `共 ${total} 条`
  }

  // 关闭详情列表
  detailCancel() {
    this.detailAlbumId = ''
    this.setState({
      detailVisible: false
    })
  }

  // 标签的模糊匹配
  handleTagSelectSearch(value) {
    // console.log(value)
    this.getSelectTagList(value, data => this.setState({ tagSelectData: data }))
  }

  // 标签的模糊匹配
  getSelectTagList(value, callback) {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.currentTag = value

    const options = {
      pageNo: 1,
      pageSize: 20,
      name: value
    }
    this.timeout = setTimeout(() => {
      apiSelfTagTagList(options)
        .then(res => {
          if (this.currentTag === value) {
            if (res.code !== ERR_OK) {
              message.error(res.msg)
              return
            }
            const result = res.data.dataList
            const arr = []
            result.forEach(item => {
              arr.push({
                value: item.id,
                text: item.name
              })
            })
            console.log(res)
            callback(arr)
          }
        })
    }, 300)

  }
  // 标签的模糊匹配
  handleTagSelectChange(value) {
    this.setState({
      ctagId: value,
    }, () => {
      console.log(this.state.ctagId)
    })
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableSelect: this.tableSelect,
      selectedRowKeys: this.state.selectedRowKeys,
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

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state


    return (
      <div className="self-album">
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
                  label={<span className="form-label">自运营专辑ID</span>}
                >
                  <InputNumber
                    ref="searchIdref"
                    style={{ width: 190 }} placeholder="请输入自运营专辑ID" onChange={v => this.setState({ searchId: v })}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">主站专辑ID</span>}
                >
                  <InputNumber
                    ref="searchSourceIdref"
                    style={{ width: 190 }} placeholder="请输入主站专辑ID" onChange={v => this.setState({ searchSourceId: v })}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">专辑名称</span>}
                >
                  <Input style={{ width: 190 }} placeholder="请输入专辑名称" onChange={e => this.setState({ searchTitle: e.target.value })} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">是否付费</span>}
                >
                  <Select
                    style={{ width: 190 }}
                    placeholder="请选择"
                    allowClear
                    onChange={value => this.setState({ paid: value })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value={1}>付费</Option>
                    <Option value={0}>免费</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">价格类型</span>}
                >
                  <Select
                    style={{ width: 190 }}
                    placeholder="请选择"
                    allowClear
                    onChange={value => this.setState({ priceType: value })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value={1}>单集购买</Option>
                    <Option value={2}>整张购买</Option>
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
                    <Option value={0}>已下架</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  className="form-item"
                  label={<span className="form-label">分类来源</span>}
                >
                  <Select
                    style={{ width: 190 }}
                    placeholder="请选择"
                    allowClear
                    onChange={value => {
                      this.setState({
                        categorySource: value,
                        categoryId: undefined
                      })
                      this.getCategories(value)
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
                  label={<span className="form-label">标签</span>}
                >
                  <Select
                    showSearch
                    style={{ width: 190 }}
                    placeholder="请输入标签"
                    allowClear={true}
                    value={this.state.ctagId}
                    onSearch={this.handleTagSelectSearch}
                    onChange={this.handleTagSelectChange}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={'根据此关键字，无法搜索'}
                  >
                    {
                      this.state.tagSelectData.map(item => (
                        <Option key={item.value}>{item.text}</Option>
                      ))
                    }
                  </Select>

                </FormItem>
              </Col>
            </Row>
            <Row>
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
            </Row>
            <Row>
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
            </Row>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List className="handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={() => this.addSelfAlbum()}>新增自运营专辑</Button>
              <Button className="btn" type="primary" onClick={() => this.export('专辑批量导出')}>专辑批量导出</Button>
              <Button className="btn" type="primary" onClick={() => this.export('声音批量导出')}>声音批量导出</Button>
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
