/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-11 19:36:39
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
import { getCommonDimesions, getCommonDimesionsAndTags } from '@Redux/commonTagAndDimesion'

import { apiMainAlbumList, apiMainAlbumDetail, apiMainAlbumMakeTag, apiMainAlbumAddOrEdit, apiAlbumGetMainPeople } from '@Api/main-album'

import { commonSmallTypes } from '@Api'

import SelfAlbumListTable from './list-table'
import WrapperSelfTagDimensionAddOrEdit from './add-or-edit'
import SelfTagDimensionDetailTable from './detail-table'
import WrapperMainAllTag from './all-tag'
import WrapperSingleTag from './singel-tag'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option

@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesions, getCommonDimesionsAndTags }
)
@TimeControlHoc
class MainAlbum extends Component {
  constructor() {
    super()
    this.state = {
      sortIndex: 1,
      sortDirection: 'down',
      categories: [],
      categoryId: undefined,
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
      singlenowChoosedTagsIds: []
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineSave = this.tableLineSave.bind(this)
    this.tableSelect = this.tableSelect.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.detailCancel = this.detailCancel.bind(this)
    this.detailPageOrPageSizeChange = this.detailPageOrPageSizeChange.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
    this.allTagCancel = this.allTagCancel.bind(this)
    this.allTagOk = this.allTagOk.bind(this)
    this.singleTagCancle = this.singleTagCancle.bind(this)
    this.singleTagOk = this.singleTagOk.bind(this)
    this.tableLineTag = this.tableLineTag.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    this.getListData({
      pageNo: 1,
      pageSize: 10,
      sortIndex: 1,
      sortDirection: 'down',
    })
    // 获取主站的分类数据
    this.getCategories(1)
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
        searchKw,
        searchId,
        searchTitle,
        searchTag,
        isPaid,
        priceType,
        onlineStatus,
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
        searchKw,
        searchId,
        searchTitle,
        searchTag,
        isPaid,
        priceType,
        onlineStatus,
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
    // options.searchKw = !options.searchKw ? '' : myTrim(options.searchKw)
    options.kw = options.searchKw
    delete options.searchKw

    // 去掉空格
    // options.searchId = !options.searchId ? '' : myTrim(options.searchId)
    options.id = options.searchId
    delete options.searchId

    // 去掉空格
    options.searchTitle = !options.searchTitle ? '' : myTrim(options.searchTitle)
    options.title = options.searchTitle
    delete options.searchTitle

    // 去掉空格
    options.searchTag = !options.searchTag ? '' : myTrim(options.searchTag)
    options.tag = options.searchTag
    delete options.searchTag


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
    options.orderBy = (options.sortIndex === 0 ? 'created_at' : options.sortIndex === 1 ? 'updated_at' : 'play_count')
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

    apiMainAlbumList(options)
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
        searchKw,
        searchId,
        searchTitle,
        searchTag,
        isPaid,
        priceType,
        onlineStatus,
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
        searchKw,
        searchId,
        searchTitle,
        searchTag,
        isPaid,
        priceType,
        onlineStatus,
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
          this.exportHandle(newOptions, '/openapi/albums/batchDownload')
        } else {
          // 没勾选
          delete options.albumIds
          // 先判断数量，然后再导出
          this.searchList('', (num) => {
            if (num > 5000) {
              message.error('当前搜索条件下，导出专辑数大于5000，请缩小搜索范围')
            } else {
              this.exportHandle(options, '/openapi/albums/allDownload')
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
          this.exportHandle(newOptions, '/openapi/tracks/batchDownload')
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

  // 列表页面的另存为
  tableLineSave(line) {
    console.log('另存为', line)
    this.saveId = line.id
    this.saveTags = line.tags
    this.refs.mask.show()
    this.props.getCommonDimesionsAndTags(() => {
      apiAlbumGetMainPeople(line.id)
        .then(res => {
          this.refs.mask.hide()
          if (res.code !== ERR_OK) {
            message.error(res.msg)
            return
          }
          line.people = res.data
          this.setState({
            addOrEditTitle: '另存为自运营专辑',
            addOrEditVisible: true,
            addOrEditInitValues: line
          })
        })
    })
  }

  tableLineTag(line) {
    console.log('打标签', line)
    this.refs.mask.show()
    this.props.getCommonDimesionsAndTags(() => {
      this.setState({
        singleVisible: true,
        singlenowChoosedTagsIds: line.ctagIds
      })
      this.singleTagId = line.id
      this.refs.mask.hide()
    })
  }

  // 另存为的确定
  addOrEditOk(values) {
    values.type = '另存为自运营专辑'
    values.sourceId = this.saveId
    values.tags = this.saveTags
    this.handleSelfTagAddOrEdit(values, () => {
      this.setState({
        addOrEditVisible: false
      }, () => {
        // 刷新维度列表页面
        this.searchList('另存为自运营专辑')
      })
    })
  }

  // 新增自运营专辑，编辑自运营专辑的辅助函数
  handleSelfTagAddOrEdit(options, callBack) {
    this.refs.mask.show()
    apiMainAlbumAddOrEdit(options)
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
    this.saveId = null
    this.saveTags = null
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
    apiMainAlbumDetail(options)
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

  // 批量打标签
  allTag() {
    this.refs.mask.show()
    this.props.getCommonDimesionsAndTags(() => {
      this.setState({
        allTagVisible: true
      })
      this.refs.mask.hide()
    })
  }

  // 批量打标签
  allTagCancel() {
    this.setState({
      allTagVisible: false
    })
  }
  async allTagOk(options) {
    try {
      options.type = '批量'
      const res = await apiMainAlbumMakeTag(options)
      if (res.code !== ERR_OK) {
        message.error(res.msg)
        return
      }
      this.setState({
        allTagVisible: false
      }, () => {
        // 刷新维度列表页面
        this.searchList('批量打标签')
      })

    } catch (error) {
      console.log(error)
    }
  }

  singleTagCancle() {
    this.setState({
      singleVisible: false,
      singlenowChoosedTagsIds: []
    })
    this.singleTagId = null
  }

  async singleTagOk(nowChoosedTagsIds) {
    console.log(nowChoosedTagsIds)
    try {
      const options = {
        albumIds: [this.singleTagId],
        tagIds: nowChoosedTagsIds
      }
      const res = await apiMainAlbumMakeTag(options)
      if (res.code !== ERR_OK) {
        message.error(res.msg)
        return
      }
      this.setState({
        singleVisible: false,
        singlenowChoosedTagsIds: []
      }, () => {
        // 刷新维度列表页面
        this.searchList('打标签')
      })

    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineTag: this.tableLineTag,
      tableLineSave: this.tableLineSave,
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

    const allTagOptions = {
      allTagVisible: this.state.allTagVisible,
      allTagCancel: this.allTagCancel,
      allTagOk: this.allTagOk
    }

    const singleTagOptions = {
      singleVisible: this.state.singleVisible,
      singleTagOk: this.singleTagOk,
      singleTagCancle: this.singleTagCancle,
      nowChoosedTagsIds: this.state.singlenowChoosedTagsIds.slice()
    }

    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state


    return (
      <div className="main-album">
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
                label={<span className="form-label">关键词搜索</span>}
              >
                <Input
                  style={{ width: 190 }} placeholder="请输入关键词搜索" onChange={e => this.setState({ searchKw: e.target.value })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                className="form-item"
                label={<span className="form-label">主站专辑ID</span>}
              >
                <InputNumber
                  ref="searchIdref"
                  style={{ width: 190 }} placeholder="请输入主站专辑ID" onChange={v => this.setState({ searchId: v })}
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
                label={<span className="form-label">主站标签</span>}
              >
                <Input
                  style={{ width: 190 }} placeholder="请输入主站标签" onChange={e => this.setState({ searchTag: e.target.value })}
                />
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
                label={<span className="form-label">是否付费</span>}
              >
                <Select
                  style={{ width: 190 }}
                  placeholder="请选择"
                  allowClear
                  onChange={value => this.setState({ isPaid: value })}
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
              <Button className="btn" type="primary" onClick={() => this.export('专辑批量导出')}>专辑批量导出</Button>
              <Button className="btn" type="primary" onClick={() => this.export('声音批量导出')}>声音批量导出</Button>
              <Button className="btn" type="primary" onClick={() => this.allTag()}>批量打标签</Button>
              <div className="sort-box">
                <span className="sort-title">排序方式：</span>
                <SortList clickSort={this.clickSort} sortNameArr={['创建时间', '更新时间', '播放数']} />
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
        {
          this.state.allTagVisible ?
            <WrapperMainAllTag {...allTagOptions} />
            : null
        }
        {
          this.state.singleVisible ?
            <WrapperSingleTag {...singleTagOptions} />
            : null

        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(MainAlbum)
export default WrappedAdvancedSearchForm
