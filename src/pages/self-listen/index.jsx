/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-30 16:05:29
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Select, DatePicker, Modal, message } from 'antd'
import moment from 'moment'
import { myGetStampTime } from '@Utils/myGetTime'
import { DOWN_LOAD_URL, ERR_OK } from '@Constants'
import SelfListenListTable from './list-table'
import WrapperSelfListenAddOrEdit from './add-or-edit'
import SelfListenModalTable from './modal-table'
import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import { myTrim } from '@Utils/myTrim'
import { selfListenList, selfListenTableList, selfListenAddorEdit } from '@Api/self-listen'
import { commonSmallTypes } from '@Api'
import { connect } from 'react-redux'
import { getCommonSmallTypes } from '@Redux/commonSmallType'
import TimeControlHoc from '@Components/time-control-hoc'

const FormItem = Form.Item
const Option = Select.Option


@connect(
  state => state.commonSmallTypesReducer,
  { getCommonSmallTypes }
)
@TimeControlHoc
class SelfListen extends Component {
  constructor() {
    super()
    this.state = {
      syncColumnId: '',
      id: '',
      title: '',
      contentType: '',
      source: '1',
      categoryId: '',
      categories: [],
      onlineStatus: '',
      sortIndex: 1,
      sortDirection: 'down',
      tableTotal: 0,
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      selectedRowKeys: [],

      modalTableVisible: false,
      modalTableTotal: 0,
      modalTableData: [],

      addOrEditVisible: false,
      addOrEditInitValues: {},
    }
    this.onTableShowSizeChange = this.onTableShowSizeChange.bind(this)
    this.onTablePageChange = this.onTablePageChange.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableSelect = this.tableSelect.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.modalTableCancel = this.modalTableCancel.bind(this)
    this.modalTableOnShowSizeChange = this.modalTableOnShowSizeChange.bind(this)
    this.modalTableOnChange = this.modalTableOnChange.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
  }

  componentDidMount() {
    // 获取表格数据
    this.getListData({
      pageNo: 1,
      pageSize: 10,
      syncColumnId: '',
      id: '',
      title: '',
      contentType: '',
      source: '1',
      categoryId: '',
      onlineStatus: '',
      searchCreateTimeBegin: null,
      searchCreateTimeEnd: null,
      searchUpdateTimeBegin: null,
      searchUpdateTimeEnd: null,
      sortIndex: 1,
      sortDirection: 'down'
    })
    // 获取主站的小分类
    this.getCategories(1)
  }

  // 获取搜索的数据
  getCategories(source) {
    commonSmallTypes(source).then(res => {
      this.setState({
        categories: res.data
      })
    })
  }

  clickSort(sortIndex, sortDirection) {
    this.setState({
      sortIndex,
      sortDirection
    })
    this.searchList()
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({
      pageNo: 1
    }, () => {
      this.searchList()
    })

  }

  searchList() {
    this.setState({
    }, () => {
      const {
        syncColumnId,
        id,
        title,
        contentType,
        source,
        categoryId,
        onlineStatus,
        sortIndex,
        sortDirection } = this.state

      const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state
      this.getListData({
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        syncColumnId,
        id,
        title,
        contentType,
        categoryId,
        source,
        onlineStatus,
        createTimeBegin: searchCreateTimeBegin,
        createTimeEnd: searchCreateTimeEnd,
        updateTimeBegin: searchUpdateTimeBegin,
        updateTimeEnd: searchUpdateTimeEnd,
        sortIndex,
        sortDirection
      })
    })
  }

  tableLineEdit(line) {
    this.refs.mask.show()
    console.log('编辑', line)
    const that = this
    this.editId = line.id
    this.props.getCommonSmallTypes(line.source, () => {
      that.setState({
        addOrEditTitle: '编辑听单',
        addOrEditVisible: true,
        addOrEditInitValues: line
      })
      that.refs.mask.hide()
    })
  }

  addListen() {
    this.setState({
      addOrEditTitle: '新增听单',
      addOrEditVisible: true,
      addOrEditInitValues: {}
    })
    this.props.getCommonSmallTypes(1)
  }
  addOrEditOk(values, title) {
    console.log(values)
    console.log(title)
    let options
    console.log(title)
    if (title === '新增听单') {
      options = { ...values, ...{ syncColumnId: 0, type: '新增' } }
    } else {
      options = { ...values, ...{ type: '编辑', id: this.editId } }
    }
    this.refs.mask.show()

    console.log(options)
    // debugger

    selfListenAddorEdit(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        if (res.data.clickUrl) {
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
          this.searchList()
        } else {
          message.error(`${title}失败`)
        }
        this.setState({
          addOrEditVisible: false
        })
        this.editId = ''
      })
  }
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
    this.editId = ''
  }

  tableLineShowDetails(line) {
    console.log('查看详情', line)
    if (line.contentType === 2) {
      this.type = '声音'
      this.setState({
        modalTableTitile: '声音列表'
      })
    } else {
      this.type = '专辑'
      this.setState({
        modalTableTitile: '专辑列表'
      })
    }
    this.id = line.id
    this.getModalListData({
      pageNo: 1,
      pageSize: 10,
      id: this.id,
      type: this.type
    })

  }

  getModalListData(options) {
    this.refs.mask.show()
    selfListenTableList(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        const modalTableData = res.data.dataList.map(item => {
          item.key = item.id
          return item
        })
        this.setState({
          modalTableData,
          modalTableTotal: res.data.totalNum,
          modalTableVisible: true
        })
      })
  }

  tableSelect(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({
      selectedRowKeys
    })
  }



  exportListen() {
    this.export('/column/export')
  }
  exportContent() {
    this.export('/column/content/export')
  }

  export(url) {
    const DEV = process.env.NODE_ENV !== 'production'
    console.log(process.env.NODE_ENV)
    let baseURL
    if (DEV) {
      baseURL = DOWN_LOAD_URL.dev
    } else {
      baseURL = DOWN_LOAD_URL.pro
    }
    this.setState({}, () => {
      const {
        syncColumnId,
        id,
        title,
        contentType,
        categoryId,
        source,
        onlineStatus,
        selectedRowKeys,
        sortIndex,
        sortDirection, } = this.state

      const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

      const options = {
        columnFrom: 2,
        syncColumnId: !syncColumnId ? '' : myTrim(syncColumnId),
        id: !id ? '' : myTrim(id),
        title: !title ? '' : myTrim(title),
        contentType,
        categoryId,
        source,
        onlineStatus,
        createTimeBegin: !searchCreateTimeBegin ? null : myGetStampTime(searchCreateTimeBegin),
        createTimeEnd: !searchCreateTimeEnd ? null : myGetStampTime(searchCreateTimeEnd),
        updateTimeBegin: !searchUpdateTimeBegin ? null : myGetStampTime(searchUpdateTimeBegin),
        updateTimeEnd: !searchUpdateTimeEnd ? null : myGetStampTime(searchUpdateTimeEnd),
        selectedRowKeys: selectedRowKeys.join(),
        sortIndex,
        sortDirection,
      }
      if (options.sortIndex === 0) {
        options.orderBy = 'created_at'
      } else if (options.sortIndex === 1) {
        options.orderBy = 'updated_at'
      }
      delete options.sortIndex
      if (options.sortDirection === 'up') {
        options.desc = false
      } else {
        options.desc = true
      }
      delete options.sortDirection

      if (options.selectedRowKeys) {
        options.ids = options.selectedRowKeys
      }
      delete options.selectedRowKeys

      let str = baseURL + url + '?'
      for (const key in options) {
        if (options[key] || options[key] === 0) {
          str += `${key}=${options[key]}&`
        }
      }

      str = str.slice(0, -1)
      console.log(str)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.setAttribute('style', 'display:none')
      a.setAttribute('href', str)
      a.setAttribute('download', '导出')
      a.click()
    })
  }

  pageOrPageSizeChange(current, pageSize) {
    this.setState({
      pageNo: current,
      pageSize
    }, () => {
      const {
        syncColumnId,
        id,
        title,
        contentType,
        categoryId,
        source,
        onlineStatus,
        sortIndex,
        sortDirection, } = this.state
      const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

      this.getListData({
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        syncColumnId,
        id,
        title,
        contentType,
        source,
        categoryId,
        onlineStatus,
        createTimeBegin: searchCreateTimeBegin,
        createTimeEnd: searchCreateTimeEnd,
        updateTimeBegin: searchUpdateTimeBegin,
        updateTimeEnd: searchUpdateTimeEnd,
        sortIndex,
        sortDirection,
      })
    })
  }

  onTablePageChange(current, pageSize) {
    console.log(current, pageSize)
    this.pageOrPageSizeChange(current, pageSize)
  }

  onTableShowSizeChange(current, pageSize) {
    console.log(current, pageSize)
    this.pageOrPageSizeChange(current, pageSize)
  }

  modalPageOrPageSizeChange(current, pageSize) {
    console.log(this.modalMainId)
    this.getModalListData({
      pageNo: current,
      pageSize,
      id: this.id,
      type: this.type
    })
  }

  modalTableOnChange(current, pageSize) {
    this.modalPageOrPageSizeChange(current, pageSize)
  }

  modalTableOnShowSizeChange(current, pageSize) {
    this.modalPageOrPageSizeChange(current, pageSize)
  }

  modalTableCancel() {
    this.setState({
      modalTableVisible: false
    })
    this.id = ''
    this.type = ''
  }


  showTableTotal(total) {
    return `共 ${total} 条`
  }
  modalTableShowTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData({
    pageNo,
    pageSize,
    syncColumnId,
    id,
    title,
    contentType,
    source,
    categoryId,
    onlineStatus,
    createTimeBegin,
    createTimeEnd,
    updateTimeBegin,
    updateTimeEnd,
    sortIndex,
    sortDirection, }) {

    this.refs.mask.show()

    const options = {
      pageNo,
      pageSize,
      syncColumnId: !syncColumnId ? '' : myTrim(syncColumnId),
      id: !id ? '' : myTrim(id),
      title: !title ? '' : myTrim(title),
      contentType,
      source,
      categoryId,
      onlineStatus,
      createTimeBegin: !createTimeBegin ? null : myGetStampTime(createTimeBegin),
      createTimeEnd: !createTimeEnd ? null : myGetStampTime(createTimeEnd),
      updateTimeBegin: !updateTimeBegin ? null : myGetStampTime(updateTimeBegin),
      updateTimeEnd: !updateTimeEnd ? null : myGetStampTime(updateTimeEnd),
      sortIndex,
      sortDirection,
    }

    selfListenList(options)
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
      })
  }

  render() {
    const tableOptions = {
      tableLineEdit: this.tableLineEdit,
      tableSelect: this.tableSelect,
      selectedRowKeys: this.state.selectedRowKeys,
      tableLineShowDetails: this.tableLineShowDetails,
      onShowSizeChange: this.onTableShowSizeChange,
      onChange: this.onTablePageChange,
      total: this.state.tableTotal,
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      pageNo: this.state.pageNo
    }

    const modalTableOptions = {
      modalTableVisible: this.state.modalTableVisible,
      modalTableTotal: this.state.modalTableTotal,
      modalTableData: this.state.modalTableData,
      modalTableCancel: this.modalTableCancel,
      modalTableOnShowSizeChange: this.modalTableOnShowSizeChange,
      modalTableOnChange: this.modalTableOnChange,
      modalTableShowTotal: this.modalTableShowTotal,
      modalTableTitile: this.state.modalTableTitile,
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
      <div className="auth-role">
        {/* 搜索 */}
        <List bordered style={{ paddingLeft: 10, marginBottom: 30 }}>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="inline"
          >
            <Row>
              <Col span={6}>
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>自运营Id</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Input style={{ width: 190 }} placeholder="请输入自运营Id" onChange={e => this.setState({ id: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="听单名称" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Input style={{ width: 190 }} placeholder="请输入听单名称" onChange={e => this.setState({ title: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="听单类型" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择听单类型"
                    style={{ width: 190 }}
                    allowClear
                    onChange={value => this.setState({ contentType: value })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value="1">专辑</Option>
                    <Option value="2">声音</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>分类来源</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择分类"
                    style={{ width: 190 }}
                    allowClear
                    defaultValue="1"
                    onChange={value => {
                      this.setState({
                        source: value,
                        categoryId: ''
                      })
                      this.getCategories(value)
                    }}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value="1">主站分类</Option>
                    <Option value="2">自运营分类</Option>
                  </Select>
                </FormItem>
              </Col>

            </Row>
            <Row>
              <Col span={6}>
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>分类</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择分类"
                    style={{ width: 190 }}
                    allowClear
                    onChange={value => this.setState({ categoryId: value })}
                    value={this.state.categoryId}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {
                      this.state.categories.map((item) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>状态</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择状态"
                    style={{ width: 190 }}
                    allowClear
                    onChange={value => this.setState({ onlineStatus: value })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value="1">已上架</Option>
                    <Option value="2">已下架</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="创建时间" style={{ marginBottom: 10, marginTop: 10 }}>
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
                    style={{ width: 190 }}
                    getCalendarContainer={trigger => trigger.parentNode}
                  />
                </FormItem>

              </Col>
              <Col span={6}>
                <FormItem label="创建时间" style={{ marginBottom: 10, marginTop: 10 }}>
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
                    style={{ width: 190 }}
                    getCalendarContainer={trigger => trigger.parentNode}
                  />
                </FormItem>
              </Col>

            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="更新时间" style={{ marginBottom: 10, marginTop: 10 }}>
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
                    style={{ width: 190 }}
                    getCalendarContainer={trigger => trigger.parentNode}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="更新时间" style={{ marginBottom: 10, marginTop: 10 }}>
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
                    style={{ width: 190 }}
                    getCalendarContainer={trigger => trigger.parentNode}
                  />
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'left' }}>
                <Button style={{ marginTop: 14 }} type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </Form>
        </List>
        {/* 表头功能按钮 */}
        <List style={{ marginBottom: 30 }}>
          <Row>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={() => this.addListen()}>新增听单</Button>
              <Button style={{ marginLeft: 20 }} type="primary" onClick={() => this.exportListen()}>听单批量导出</Button>
              <Button style={{ marginLeft: 20 }} type="primary" onClick={() => this.exportContent()}>内容批量导出</Button>
              <div style={{ float: 'right' }}>
                <span style={{ position: 'relative', top: -9 }}>排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <SelfListenListTable {...tableOptions} />
        <SelfListenModalTable {...modalTableOptions} />
        {
          this.state.addOrEditVisible ? <WrapperSelfListenAddOrEdit {...addOrEditOptions} /> : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SelfListen)
export default WrappedAdvancedSearchForm
