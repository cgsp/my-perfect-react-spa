/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-23 19:49:35
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Select, DatePicker, Modal } from 'antd'
import moment from 'moment'
import { myGetStampTime } from '@Utils/myGetTime'
import { DOWN_LOAD_URL } from '@Constants'
import AuthMenuListTable from './list-table'
import WrapperMainListenAddOrEdit from './add-or-edit'
import MainListenModalTable from './modal-table'
import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TopTip from '@Components/top-tip'
import { myTrim } from '@Utils/myTrim'
import { mainListenList, mainListenTableList } from '@Api/main-listen'
import { connect } from 'react-redux'
import { getCommonSmallTypes } from '@Redux/commonSmallType'

const FormItem = Form.Item
const Option = Select.Option


@connect(
  state => state.commonSmallTypesReducer,
  { getCommonSmallTypes }
)
class MainListen extends Component {
  constructor() {
    super()
    this.state = {
      searchMainId: '',
      searchSelfId: '',
      searchListenName: '',
      searchListenType: '',
      searchSmallType: '',
      searchState: '',
      searchCreateTimeBegin: null,
      searchCreateTimeEnd: null,
      searchUpdateTimeBegin: null,
      searchUpdateTimeEnd: null,
      sortIndex: 0,
      sortDirection: 'down',
      tableTotal: 0,
      tableData: [],
      page: 1,
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
      }
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
      page: 1,
      pageSize: 10,
      searchMainId: '',
      searchSelfId: '',
      searchListenName: '',
      searchListenType: '',
      searchSmallType: '',
      searchState: '',
      searchCreateTimeBegin: null,
      searchCreateTimeEnd: null,
      searchUpdateTimeBegin: null,
      searchUpdateTimeEnd: null,
      sortIndex: 0,
      sortDirection: 'down'
    })
    this.props.getCommonSmallTypes('主站内容')
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
        searchMainId,
        searchSelfId,
        searchListenName,
        searchListenType,
        searchSmallType,
        searchState,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
        sortIndex,
        sortDirection } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        searchMainId,
        searchSelfId,
        searchListenName,
        searchListenType,
        searchSmallType,
        searchState,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
        sortIndex,
        sortDirection
      })
    })
  }

  tableLineSave(line) {
    // console.log('另存为', line)
    this.setState({
      addOrEditVisible: true,
      addOrEditInitValues: line
    })
    this.props.getCommonSmallTypes(line.bigType)
  }
  addOrEditOk(values) {
    console.log(values)
    const content = (
      <div>
        <p style={{ textAlign: 'center' }}>成功了5条</p>
        <p style={{ textAlign: 'center' }}>失败了4条</p>
        <p style={{ textAlign: 'center' }}>
          <a href="">查看统计结果</a>
        </p>
      </div>
    )
    Modal.confirm({
      title: '统计结果',
      content: content,
      okText: '确认',
      footer: null
    })
    this.setState({
      addOrEditVisible: false
    })
  }
  addOrEditCancel() {
    this.setState({
      addOrEditVisible: false
    })
  }

  tableLineShowDetails(line) {
    console.log('查看详情', line)
    const { mainId } = line
    this.modalMainId = mainId
    this.getModalListData({
      page: 1,
      pageSize: 10,
      mainId: this.modalMainId
    })

  }
  getModalListData(options) {
    this.refs.mask.show()
    mainListenTableList(options)
      .then(res => {
        this.refs.mask.hide()
        const modalTableData = res.list.map(item => {
          item.key = item.albumId
          return item
        })
        this.setState({
          modalTableData,
          modalTableTotal: res.total,
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
    this.export()
  }
  exportContent() {
    this.export()
  }

  export() {
    this.setState({}, () => {
      const {
        searchMainId,
        searchSelfId,
        searchListenName,
        searchListenType,
        searchSmallType,
        searchState,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
        selectedRowKeys,
        sortIndex,
        sortDirection, } = this.state

      const options = {
        searchMainId: !searchMainId ? '' : myTrim(searchMainId),
        searchSelfId: !searchSelfId ? '' : myTrim(searchSelfId),
        searchListenName: !searchListenName ? '' : myTrim(searchListenName),
        searchListenType,
        searchSmallType,
        searchState,
        searchCreateTimeBegin: !searchCreateTimeBegin ? null : myGetStampTime(searchCreateTimeBegin),
        searchCreateTimeEnd: !searchCreateTimeEnd ? null : myGetStampTime(searchCreateTimeEnd),
        searchUpdateTimeBegin: !searchUpdateTimeBegin ? null : myGetStampTime(searchUpdateTimeBegin),
        searchUpdateTimeEnd: !searchUpdateTimeEnd ? null : myGetStampTime(searchUpdateTimeEnd),
        selectedRowKeys: selectedRowKeys.join(),
        sortIndex,
        sortDirection,
      }

      let str = DOWN_LOAD_URL + '/api?'
      for (const key in options) {
        if (options[key] || options[key] === 0) {
          str += `${key}=${options[key]}&`
        }
      }

      console.log(str.slice(0, -1))

      // let a = document.createElement('a')
      // document.body.appendChild(a)
      // a.setAttribute('style', 'display:none')
      // a.setAttribute('href', str)
      // a.setAttribute('download', '订单列表')
      // a.click()
    })
  }

  pageOrPageSizeChange(current, pageSize) {
    this.setState({
      page: current,
      pageSize
    }, () => {
      const {
        searchMainId,
        searchSelfId,
        searchListenName,
        searchListenType,
        searchSmallType,
        searchState,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
        sortIndex,
        sortDirection, } = this.state
      this.getListData({
        page: this.state.page,
        pageSize: this.state.pageSize,
        searchMainId,
        searchSelfId,
        searchListenName,
        searchListenType,
        searchSmallType,
        searchState,
        searchCreateTimeBegin,
        searchCreateTimeEnd,
        searchUpdateTimeBegin,
        searchUpdateTimeEnd,
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
      page: current,
      pageSize,
      mainId: this.modalMainId
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
  }


  showTableTotal(total) {
    return `共 ${total} 条`
  }
  modalTableShowTotal(total) {
    return `共 ${total} 条`
  }

  // 获取列表页面的数据
  getListData({
    page,
    pageSize,
    searchMainId,
    searchSelfId,
    searchListenName,
    searchListenType,
    searchSmallType,
    searchState,
    searchCreateTimeBegin,
    searchCreateTimeEnd,
    searchUpdateTimeBegin,
    searchUpdateTimeEnd,
    sortIndex,
    sortDirection, }) {

    this.refs.mask.show()

    const options = {
      page,
      pageSize,
      searchMainId: !searchMainId ? '' : myTrim(searchMainId),
      searchSelfId: !searchSelfId ? '' : myTrim(searchSelfId),
      searchListenName: !searchListenName ? '' : myTrim(searchListenName),
      searchListenType,
      searchSmallType,
      searchState,
      searchCreateTimeBegin: !searchCreateTimeBegin ? null : myGetStampTime(searchCreateTimeBegin),
      searchCreateTimeEnd: !searchCreateTimeEnd ? null : myGetStampTime(searchCreateTimeEnd),
      searchUpdateTimeBegin: !searchUpdateTimeBegin ? null : myGetStampTime(searchUpdateTimeBegin),
      searchUpdateTimeEnd: !searchUpdateTimeEnd ? null : myGetStampTime(searchUpdateTimeEnd),
      sortIndex,
      sortDirection,
    }

    mainListenList(options)
      .then(res => {
        this.refs.mask.hide()
        const tableData = res.list.map(item => {
          item.key = item.mainId
          return item
        })
        this.setState({
          tableData: tableData,
          tableTotal: res.total,
        })
        // if (tag === '新增') {
        //   this.showTopTip('success', '新增节点成功')
        // } else if (tag === '编辑') {
        //   this.showTopTip('success', '编辑节点成功')
        // } else if (tag === '删除') {
        //   this.showTopTip('success', '删除节点成功')
        // }

      })
  }

  showTopTip(type, msg) {
    this.setState({
      topTipOptions: {
        show: true,
        msg,
        type
      }
    })
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    setTimeout(() => {
      this.setState({
        topTipOptions: {
          show: false,
          msg,
          type
        }
      })
    }, 1500)

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
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }



    return (
      <div className="auth-role">
        <TopTip item={this.state.topTipOptions} />
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
                  <Input placeholder="请输入主站Id" onChange={e => this.setState({ searchMainId: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>自运营Id</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Input placeholder="请输入自运营Id" onChange={e => this.setState({ searchSelfId: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="听单名称" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Input placeholder="请输入听单名称" onChange={e => this.setState({ searchListenName: e.target.value })} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="听单类型" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择听单类型"
                    style={{ minWidth: 171 }}
                    allowClear
                    onChange={value => this.setState({ searchListenType: value })}
                  >
                    <Option value="专辑">专辑</Option>
                    <Option value="声音">声音</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label={<span style={{ minWidth: 57, display: 'inline-block', textAlign: 'left' }}>分类</span>} style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    placeholder="请选择分类"
                    style={{ minWidth: 171 }}
                    allowClear
                    onChange={value => this.setState({ searchSmallType: value })}
                  >
                    {
                      this.props.commonSmallTypes.map((item) => (
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
                    style={{ minWidth: 171 }}
                    allowClear
                    onChange={value => this.setState({ searchState: value })}
                  >
                    <Option value="已上架">已上架</Option>
                    <Option value="已下架">已下架</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="创建时间" style={{ marginBottom: 10, marginTop: 10 }}>
                  <DatePicker
                    showTime={
                      { defaultValue: moment().startOf('day') }
                    }
                    showToday={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择开始时间"
                    onChange={(data, str) => this.setState({
                      searchCreateTimeBegin: str
                    })}
                  />
                </FormItem>

              </Col>
              <Col span={6}>
                <FormItem label="创建时间" style={{ marginBottom: 10, marginTop: 10 }}>
                  <DatePicker
                    showTime={
                      { defaultValue: moment().endOf('day') }
                    }
                    showToday={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择结束时间"
                    onChange={(data, str) => this.setState({
                      searchCreateTimeEnd: str
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="更新时间" style={{ marginBottom: 10, marginTop: 10 }}>
                  <DatePicker
                    showTime={
                      { defaultValue: moment().startOf('day') }
                    }
                    showToday={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择开始时间"
                    onChange={(data, str) => this.setState({
                      searchUpdateTimeBegin: str
                    })}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="更新时间" style={{ marginBottom: 10, marginTop: 10 }}>
                  <DatePicker
                    showTime={
                      { defaultValue: moment().endOf('day') }
                    }
                    showToday={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择结束时间"
                    onChange={(data, str) => this.setState({
                      searchUpdateTimeEnd: str
                    })}
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
        <AuthMenuListTable {...tableOptions} />
        <MainListenModalTable {...modalTableOptions} />
        <WrapperMainListenAddOrEdit {...addOrEditOptions} />
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(MainListen)
export default WrappedAdvancedSearchForm
