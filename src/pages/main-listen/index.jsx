/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:36 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-23 11:47:46
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Modal, Select, DatePicker } from 'antd'
import moment from 'moment'
import { myGetStampTime } from '@Utils/myGetTime'
import { getNodeSort } from '@Utils/getNodeSort'
import { DOWN_LOAD_URL } from '@Constants'
import AuthMenuListTable from './list-table'
import AddOrEditMenu from './add-or-edit-menu'
import MainListenModalTable from './modal-table'
import MaskLoading from '@Components/mask-loading'
import SortList from '@Components/sort-list'
import TopTip from '@Components/top-tip'
import { myTrim } from '@Utils/myTrim'
import { apiGetAuthMenuPageList, authMenuPageListDelete, authMenuPageListAddorEdit } from '@Api'
import { mainListenList, mainListenTableList } from '@Api/main-listen'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option


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

      modalTitle: '',
      modalVisible: false,
      modalRoleName: '',
      modalRoleDesc: '',
      modalConfirmLoading: false,
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
    this.modalOk = this.modalOk.bind(this)
    this.modalCancel = this.modalCancel.bind(this)
    this.tableLineShowDetails = this.tableLineShowDetails.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.modalTableCancel = this.modalTableCancel.bind(this)
    this.modalTableOnShowSizeChange = this.modalTableOnShowSizeChange.bind(this)
    this.modalTableOnChange = this.modalTableOnChange.bind(this)

    // this.modalOnCheck = this.modalOnCheck.bind(this)
    this.urlChange = this.urlChange.bind(this)
    this.codeChange = this.codeChange.bind(this)
    this.iconChange = this.iconChange.bind(this)
    this.newnameChange = this.newnameChange.bind(this)
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
  }

  onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1])
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
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
    console.log('另存为', line)
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
  modalTableOnChange(current, pageSize) {
    this.modalPageOrPageSizeChange(current, pageSize)
  }

  modalTableOnShowSizeChange(current, pageSize) {
    this.modalPageOrPageSizeChange(current, pageSize)
  }
  modalPageOrPageSizeChange(current, pageSize) {
    console.log(this.modalMainId)
    this.getModalListData({
      page: current,
      pageSize,
      mainId: this.modalMainId
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

  modalOk(title) {
    this.setState({
    }, () => {
      if (!this.state.newname) {
        this.showModalTip(`请输入${title}名称`)
        return
      }
      if (!this.state.icon && title === '一级菜单') {
        this.showModalTip('请输入一级菜单图标')
        return
      }
      if (!this.state.url && title !== '功能') {
        this.showModalTip('请输入url路径')
        return
      }

      if (!this.state.code && title === '功能') {
        this.showModalTip('请输入权限字符串')
        return
      }

      const { newname, icon, url, code, pid } = this.state

      let id
      let sort
      if (this.state.handleType === '编辑') {
        id = this.state.id
        // 写一个函数根据pid来获取sort
        sort = getNodeSort(pid, this.props.appNavAndAuthPlain, '编辑')
        // debugger
        console.log(id)
      }
      else {
        id = null
        // 写一个函数根据pid来获取sort
        sort = getNodeSort(pid, this.props.appNavAndAuthPlain, '新增')
      }

      let type
      let level
      if (title === '一级菜单') {
        type = '菜单'
        level = '1'
      } else if (title === '二级菜单') {
        type = '菜单'
        level = '2'
      } else if (title === '三级菜单') {
        type = '菜单'
        level = '3'
      } else if (title === '功能') {
        type = '功能'
        level = ''
      }

      console.log({ newname, icon, url, code, type, level, sort })
      this.setState({
        modalConfirmLoading: true
      })
      authMenuPageListAddorEdit(
        {
          id,
          pid,
          newname: myTrim(newname),
          icon: myTrim(icon),
          url: myTrim(url),
          code: myTrim(code),
          type,
          level,
          sort
        }
      )
        .then(res => {
          this.setState({
            modalVisible: false,
          }, () => {
            // 更新导航的redux数据
            this.props.getNavAndAuthData()
            const searchname = myTrim(this.state.searchname)
            const { searchtype, searchlevel } = this.state
            this.getListData({
              page: this.state.page,
              pageSize: this.state.pageSize,
              searchname,
              searchtype,
              searchlevel,
              tag: this.state.handleType
            })
          })

        })
    })
  }

  showModalTip(tip) {
    this.setState({
      modalAlertVisible: true,
      modalAlertMessage: tip
    })
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.timer = setTimeout(() => {
      this.setState({
        modalAlertVisible: false,
        modalAlertMessage: ''
      })
    }, 2000)
  }

  modalCancel() {
    this.setState({
      modalVisible: false
    })
  }
  modalTableCancel() {
    this.setState({
      modalTableVisible: false
    })
  }

  newnameChange(e) {
    this.setState({
      newname: e.target.value
    })
  }
  codeChange(e) {
    this.setState({
      code: e.target.value
    })
  }

  iconChange(e) {
    this.setState({
      icon: e.target.value
    })
  }

  urlChange(e) {
    this.setState({
      url: e.target.value
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

    const modalOptions = {
      modalTitle: this.state.modalTitle,
      modalVisible: this.state.modalVisible,
      modalOk: this.modalOk,
      modalConfirmLoading: this.state.modalConfirmLoading,
      modalCancel: this.modalCancel,
      name: this.state.name,
      newname: this.state.newname,
      newnameChange: this.newnameChange,
      url: this.state.url,
      urlChange: this.urlChange,
      icon: this.state.icon,
      iconChange: this.iconChange,
      code: this.state.code,
      codeChange: this.codeChange,
      handleType: this.state.handleType,
      modalAlertVisible: this.state.modalAlertVisible,
      modalAlertMessage: this.state.modalAlertMessage
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
                    <Option value="资讯">资讯</Option>
                    <Option value="音乐">音乐</Option>
                    <Option value="有声书">有声书</Option>
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
        <AddOrEditMenu {...modalOptions} />
        <MaskLoading ref="mask" />
      </div >

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(MainListen)
export default WrappedAdvancedSearchForm
