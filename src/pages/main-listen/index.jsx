/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-30 09:48:23
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Select, DatePicker, Modal, message } from 'antd'
import moment from 'moment'
import { myGetStampTime } from '@Utils/myGetTime'
import { DOWN_LOAD_URL, ERR_OK } from '@Constants'
import MainListenListTable from './list-table'
import WrapperMainListenAddOrEdit from './add-or-edit'
import MainListenModalTable from './modal-table'
import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import { myTrim } from '@Utils/myTrim'
import { mainListenList, mainListenTableList, mainListenSave } from '@Api/main-listen'
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

      topTipOptions: {
        show: false,
        msg: '',
        type: 'success'
      },
    }
    this.onTableShowSizeChange = this.onTableShowSizeChange.bind(this)
    this.onTablePageChange = this.onTablePageChange.bind(this)
    this.tableLineSave = this.tableLineSave.bind(this)
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
      if (res.code !== ERR_OK) {
        message.error(res.msg)
        return
      }
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
    this.searchList()
  }

  searchList() {
    this.setState({
    }, () => {
      const {
        syncColumnId,
        id,
        title,
        contentType,
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

  tableLineSave(line) {
    this.refs.mask.show()
    console.log('另存为', line)
    const that = this
    this.props.getCommonSmallTypes(line.source, () => {
      that.setState({
        addOrEditTitle: '另存为自运营听单',
        addOrEditVisible: true,
        addOrEditInitValues: line
      })
      that.refs.mask.hide()
    })
  }


  addOrEditOk(values) {
    this.refs.mask.show()
    mainListenSave({ ...values, ...{ syncColumnId: this.saveSyncColumnId } })
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        console.log(res)
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
        } else {
          message.error('另存为失败')
        }
        this.setState({
          addOrEditVisible: false
        })
      })
  }
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
    this.saveSyncColumnId = ''
  }

  tableLineShowDetails(line) {
    console.log('查看详情', line)
    if (line.contentType === 2) {
      this.type = '声音'
    } else {
      this.type = '专辑'
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
    mainListenTableList(options)
      .then(res => {
        if (res.code === ERR_OK) {
          const modalTableData = res.data.dataList.map(item => {
            item.key = item.id
            return item
          })
          this.setState({
            modalTableData,
            modalTableTotal: res.data.totalNum,
            modalTableVisible: true
          })
        } else {
          message.error(res.msg)
        }
        this.refs.mask.hide()

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
        onlineStatus,
        selectedRowKeys,
        sortIndex,
        sortDirection, } = this.state

      const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state

      const options = {
        columnFrom: 1,
        syncColumnId: !syncColumnId ? '' : myTrim(syncColumnId),
        id: !id ? '' : myTrim(id),
        title: !title ? '' : myTrim(title),
        contentType,
        categoryId,
        onlineStatus,
        createTimeBegin: !searchCreateTimeBegin ? null : myGetStampTime(searchCreateTimeBegin),
        createTimeEnd: !searchCreateTimeEnd ? null : myGetStampTime(searchCreateTimeEnd),
        updateTimeBegin: !searchUpdateTimeBegin ? null : myGetStampTime(searchUpdateTimeBegin),
        updateTimeEnd: !searchUpdateTimeEnd ? null : myGetStampTime(searchUpdateTimeEnd),
        selectedRowKeys: selectedRowKeys.join(),
        sortIndex,
        sortDirection,
        source: 1
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
    // console.log(current, pageSize)
    this.pageOrPageSizeChange(current, pageSize)
  }

  onTableShowSizeChange(current, pageSize) {
    // console.log(current, pageSize)
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
      categoryId,
      onlineStatus,
      createTimeBegin: !createTimeBegin ? null : myGetStampTime(createTimeBegin),
      createTimeEnd: !createTimeEnd ? null : myGetStampTime(createTimeEnd),
      updateTimeBegin: !updateTimeBegin ? null : myGetStampTime(updateTimeBegin),
      updateTimeEnd: !updateTimeEnd ? null : myGetStampTime(updateTimeEnd),
      sortIndex,
      sortDirection,
      source: 1
    }

    mainListenList(options)
      .then(res => {
        this.refs.mask.hide()
        if (res.code === ERR_OK) {
          const tableData = res.data.dataList.map(item => {
            item.key = item.id
            return item
          })
          this.setState({
            tableData: tableData,
            tableTotal: res.data.totalNum,
          })
        } else {
          message.error(res.msg)
        }
      })
  }

  render() {
    const tableOptions = {
      tableLineSave: this.tableLineSave,
      tableSelect: this.tableSelect,
      selectedRowKeys: this.state.selectedRowKeys,
      tableLineShowDetails: this.tableLineShowDetails,
      onShowSizeChange: this.onTableShowSizeChange,
      onChange: this.onTablePageChange,
      total: this.state.tableTotal,
      showTotal: this.showTableTotal,
      tableData: this.state.tableData
    }

    const modalTableOptions = {
      modalTableVisible: this.state.modalTableVisible,
      modalTableTotal: this.state.modalTableTotal,
      modalTableData: this.state.modalTableData,
      modalTableCancel: this.modalTableCancel,
      modalTableOnShowSizeChange: this.modalTableOnShowSizeChange,
      modalTableOnChange: this.modalTableOnChange,
      modalTableShowTotal: this.modalTableShowTotal,
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
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>主站Id</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Input style={{ width: 190 }} placeholder="请输入主站Id" onChange={e => this.setState({ syncColumnId: e.target.value })} />
                </FormItem>
              </Col>
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
                  >
                    <Option value="1">专辑</Option>
                    <Option value="2">声音</Option>
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
              <Button type="primary" onClick={() => this.exportListen()}>听单批量导出</Button>
              <Button style={{ marginLeft: 20 }} type="primary" onClick={() => this.exportContent()}>内容批量导出</Button>
              <div style={{ float: 'right' }}>
                <span style={{ position: 'relative', top: -9 }}>排序方式：</span>
                <SortList clickSort={this.clickSort} />
              </div>
            </Col>
          </Row>
        </List>
        <MainListenListTable {...tableOptions} />
        <MainListenModalTable {...modalTableOptions} />
        {
          this.state.addOrEditVisible
            ?
            <WrapperMainListenAddOrEdit {...addOrEditOptions} />
            : null
        }
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SelfListen)
export default WrappedAdvancedSearchForm
