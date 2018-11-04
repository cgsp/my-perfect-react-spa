/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-11-01 14:36:35
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Select, Icon, DatePicker, message } from 'antd'
// 时间操作库
import moment from 'moment'
// 封装的时间HOC组件
import TimeControlHoc from '@Components/time-control-hoc'
// 封装的工具库
import { myTransTimeObjToStampTime } from '@Utils/my-get-time'
import { myExportFile } from '@Utils/my-export-file'
import { mySessionStorageGet, mySessionStorageSet, mySessionStorageRemove } from '@Utils/my-storages'
import { http } from '@Service'
import { apiFirstBusChannel } from '@Service/setting'
import { apiGetAwardDeveloper, apiGetAwardRuleList, apiGetAwardRuleListUpdate } from '@Service/award'
import { SUCCESS_OK } from '@Constants'
import ListTable from './list-table'
import AddOrEdit from './add-or-edit'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option
// const confirm = Modal.confirm

@TimeControlHoc
class F1AwardS2Developer extends Component {
  constructor() {
    super()
    this.state = {
      tableTotal: 0,
      tableData: [],
      current: 1,
      pageSize: 10,
      orderBy: 'updated_at',
      desc: true,
      firstBusinessList: [],
      awardRulesList: [],
      expand: false,
      expandName: '展开'
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineToDetail = this.tableLineToDetail.bind(this)
    this.export = this.export.bind(this)
    this.addOrEditOk = this.addOrEditOk.bind(this)
    this.addOrEditCancel = this.addOrEditCancel.bind(this)
  }

  componentDidMount() {
    this.getAllFirsrBusiness()
    this.getAllAwardRules()
    // 从详情页面跳转过来
    if (this.props.location.query && this.props.location.query.needRecoverySearch) {
      console.log(this.props.location.query.needRecoverySearch)
      this.recoverySearch()
    }
    // 从开发者规则页面跳转过来
    if (this.props.location.query && this.props.location.query.rewardType) {
      const { rewardType } = this.props.location.query
      this.recoveryRewardTypes(rewardType)
    }
    // 初始化查询列表数据
    this.searchList({})
    // 清除自己详情页面的缓存
    mySessionStorageRemove('F1AwardS2DeveloperF4Pull')
  }

  getAllFirsrBusiness() {
    http.get(apiFirstBusChannel)
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }
        // console.log(res)
        const data = res.data || []
        let list = data.map(item => {
          item.key = item.id
          return item
        })
        this.setState({
          firstBusinessList: list
        })
      })
  }
  getAllAwardRules() {
    http.get(apiGetAwardRuleList)
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }
        // console.log(res)
        const data = res.data || []
        let list = data.map(item => {
          item.id = item.key
          return item
        })
        this.setState({
          awardRulesList: list
        })
      })
  }

  // 列表的排序
  clickSort(orderBy, desc) {
    this.setState({
      orderBy, desc
    })
    this.searchList({})
  }

  // 列表页面翻页或者每页尺寸改变
  pageOrPageSizeChange(current, pageSize) {
    this.setState({
      current,
      pageSize
    })
    this.searchList({})
  }

  // 列表页面展示total
  showTableTotal(total) {
    return `共 ${total} 条`
  }


  // 获取列表页面的数据
  getListData(options) {
    const tip = options.tip
    if (options.tip) {
      delete options.tip
    }
    http.post(apiGetAwardDeveloper, options)
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }
        const data = res.data
        let tableData
        const tableTotal = data.totalNum
        if (tableTotal === 0) {
          tableData = []
        } else {
          tableData = data.dataList.map(item => {
            item.key = item.developerId
            return item
          })
        }
        this.setState({
          tableData,
          tableTotal
        })
        // 针对删除，编辑，新增之后，重新刷新页面的提示
        if (tip) {
          message.success(`${tip}成功`)
        }
      })
  }

  searchList(values) {
    this.setState({}, () => {
      const { pageSize, current, orderBy, desc } = this.state
      const createdAtBegin = myTransTimeObjToStampTime(this.props.state.searchCreateTimeBegin)
      const createdAtEnd = myTransTimeObjToStampTime(this.props.state.searchCreateTimeEnd)
      const updatedAtBegin = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeBegin)
      const updatedAtEnd = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeEnd)
      let searchFormValues = this.props.form.getFieldsValue()
      // console.log(searchFormValues)
      values = {
        ...values,
        ...searchFormValues,
        ...{
          createdAtBegin,
          createdAtEnd,
          updatedAtBegin,
          updatedAtEnd,
          pageSize,
          current,
          orderBy,
          desc
        },
      }
      mySessionStorageSet('LIST_SEARCH_VALUES_AWARD_DEVLOPMENT', values)
      values.page = values.current
      delete values.current
      this.getListData(values)
    })
  }

  // 从详情页面跳回来的时候，是否要重置搜索条件
  recoverySearch() {
    const {
      developerName,
      businessTypeCategoryId,
      rewardTypes,
      pageSize,
      current,
      orderBy,
      desc,
      createdAtBegin,
      createdAtEnd,
      updatedAtBegin,
      updatedAtEnd, } = mySessionStorageGet('LIST_SEARCH_VALUES_AWARD_DEVLOPMENT', {})
    // 重置表单
    this.props.form.setFieldsValue({
      developerName,
      businessTypeCategoryId,
      rewardTypes
    })
    // 重置页码排序
    this.setState({
      pageSize,
      current,
      orderBy,
      desc,
    })
    // 重置时间
    this.resetTime('searchCreateTimeBegin', createdAtBegin)
    this.resetTime('searchCreateTimeEnd', createdAtEnd)
    this.resetTime('searchUpdateTimeBegin', updatedAtBegin)
    this.resetTime('searchUpdateTimeEnd', updatedAtEnd)
  }

  // 从开发者规则页面跳转过来的时候，需要预设奖励资格
  recoveryRewardTypes(rewardTypes) {
    this.props.form.setFieldsValue({
      rewardTypes: [rewardTypes]
    })
  }

  // 搜索查询，支持input输入框的回车搜索
  handleSearch = (e) => {
    this.setState({
      current: 1
    })
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      this.searchList(values)
    })
  }

  // 清空（重置）搜索区域
  handleReset = () => {
    this.props.form.resetFields()
    // 清空时间
    this.props.clearAllTime()
  }

  // 搜索区域的展开收起
  toggle = (expand) => {
    expand = !expand
    const expandName = !expand ? '展开' : '收起'
    this.setState({
      expand,
      expandName
    })
  }


  // 重置时间插件的时间（如从详情页面返回的时候，需要还原时间）
  resetTime = (timeKey, timeValue) => {
    if (!timeValue) {
      return
    }
    // 需要传入key,value两个参数
    // key分别是searchCreateTimeBegin，searchCreateTimeEnd，searchUpdateTimeEnd，searchUpdateTimeBegin
    // value必须是11位的时间戳 如，1540940889387
    // this.props.resetTime('searchCreateTimeBegin', 1540940889387)
    this.props.resetTime(timeKey, timeValue)
  }

  // 初始化搜索区域的dom结构
  getSearchFields() {
    const show = this.state.expand
    const { getFieldDecorator } = this.props.form
    // HOC高阶组件注入的属性
    const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = this.props.state
    const searchField =
      [
        <Col span={8} key={1}>
          <FormItem label={'开发者名称'}>
            {getFieldDecorator('developerName', {
              rules: [],
            })(
              <Input placeholder="请输入开发者名称" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={2}>
          <FormItem
            label={'所属渠道'}
          >
            {getFieldDecorator('businessTypeCategoryId', {
              rules: [],
            })(
              <Select
                placeholder="请选择所属渠道"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="加载中..."
              >
                {
                  this.state.firstBusinessList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={3}>
          <FormItem
            label={'奖励资格'}
          >
            {getFieldDecorator('rewardTypes', {
              rules: [],
            })(
              <Select
                mode="multiple"
                placeholder="请选择奖励资格"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="加载中..."
              >
                {
                  this.state.awardRulesList.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>{item.value}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={4} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'创建起始时间'}
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime={
                {
                  defaultValue: moment().startOf('day'),
                  hideDisabledOptions: true,
                }
              }
              showToday={true}
              value={searchCreateTimeBegin}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择起始时间"
              disabledDate={this.props.disabledCreateBeginDate}
              disabledTime={this.props.disabledCreateBeiginTime}
              onChange={this.props.onCreateBeginDateAndTimeChange}
              getCalendarContainer={trigger => trigger.parentNode}
            />
          </FormItem>
        </Col>,
        <Col span={8} key={5} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'创建结束时间'}
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime={
                {
                  defaultValue: moment().endOf('day'),
                  hideDisabledOptions: true,
                }
              }
              showToday={true}
              value={searchCreateTimeEnd}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
              disabledDate={this.props.disabledCreateEndDate}
              disabledTime={this.props.disabledCreateEndTime}
              onChange={this.props.onCreateEndDateAndTimeChange}
              getCalendarContainer={trigger => trigger.parentNode}
            />
          </FormItem>
        </Col>,
        <Col span={8} key={6} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'更新起始时间'}
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime={
                {
                  defaultValue: moment().startOf('day'),
                  hideDisabledOptions: true
                }
              }
              showToday={true}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择起始时间"
              value={searchUpdateTimeBegin}
              disabledDate={this.props.disabledUpdateBeginDate}
              disabledTime={this.props.disabledUpdateBeiginTime}
              onChange={this.props.onUpdateBeginDateAndTimeChange}
              getCalendarContainer={trigger => trigger.parentNode}
            />
          </FormItem>
        </Col>,
        <Col span={8} key={7} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'更新结束时间'}
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime={
                {
                  defaultValue: moment().endOf('day'),
                  hideDisabledOptions: true
                }
              }
              showToday={true}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
              value={searchUpdateTimeEnd}
              disabledDate={this.props.disabledUpdateEndDate}
              disabledTime={this.props.disabledUpdateEndTime}
              onChange={this.props.onUpdateEndDateAndTimeChange}
              getCalendarContainer={trigger => trigger.parentNode}
            />
          </FormItem>
        </Col>,
      ]
    return searchField
  }

  // 跳转详情页
  tableLineToDetail(item, line) {
    console.log(item, line)
    const listGiveValues = {
      developerId: line.developerId,
      developerName: line.developerName,
      rewardType: item.key,
      rewardTypeName: item.value
    }
    // console.log(listGiveValues)
    if (listGiveValues.rewardTypeName === '拉新奖励') {
      this.props.history.push({
        pathname: '/!F1-award/!S2-developer/!F4-pull',
        query: {
          listGiveValues
        }
      })
    } else {
      this.props.history.push({
        pathname: '/!F1-award/!S2-developer/!F4-reorder',
        query: {
          listGiveValues
        }
      })
    }
  }

  // 列表页面的导出
  export() {
    this.setState({}, () => {
      const { orderBy, desc } = this.state
      const createdAtBegin = myTransTimeObjToStampTime(this.props.state.searchCreateTimeBegin)
      const createdAtEnd = myTransTimeObjToStampTime(this.props.state.searchCreateTimeEnd)
      const updatedAtBegin = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeBegin)
      const updatedAtEnd = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeEnd)
      let searchFormValues = this.props.form.getFieldsValue()
      // console.log(searchFormValues)
      const values = {
        ...searchFormValues,
        ...{
          createdAtBegin,
          createdAtEnd,
          updatedAtBegin,
          updatedAtEnd,
          orderBy,
          desc
        },
      }
      myExportFile('xxx/yyy', values)
    })
  }

  // 修改奖励资格
  tableLineEdit(line) {
    this.editDeveloperId = line.developerId
    this.setState({
      addOrEditInitValues: line,
      addOrEditTitle: `${line.developerName}-奖励资格修改`,
      addOrEditVisible: true
    })
  }
  async addOrEditOk(values) {
    try {
      values.developerId = this.editDeveloperId
      const res = await http.post(apiGetAwardRuleListUpdate, values)
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }
      this.searchList({
        tip: '修改奖励资格'
      })
      this.addOrEditCancel()
    } catch (error) {
      console.log(error)
    }
  }


  addOrEditCancel() {
    this.editDeveloperId = null
    this.setState({
      addOrEditVisible: false
    })
  }


  render() {
    const tableOptions = {
      orderBy: this.state.orderBy,
      desc: this.state.desc,
      clickSort: this.clickSort,
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineToDetail: this.tableLineToDetail,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      current: this.state.current,
      pageSize: this.state.pageSize
    }

    const addOrEditOptions = {
      addOrEditTitle: this.state.addOrEditTitle,
      addOrEditVisible: this.state.addOrEditVisible,
      addOrEditInitValues: this.state.addOrEditInitValues,
      addOrEditOk: this.addOrEditOk,
      addOrEditCancel: this.addOrEditCancel,
    }

    return (
      <div className="award-developer">
        {/* 标题区域 */}
        <div className="app-content-title">
          开发者管理
        </div>
        {/* 搜索区域 */}
        <Form
          className="ant-advanced-search-form app-serach-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={5}>{this.getSearchFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={() => this.toggle(this.state.expand)}>
                {this.state.expandName}<Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
        </Form>
        {/* 功能按钮区域 */}
        <List className="app-handle-buttons">
          <Row>
            <Col span={24} className="line">
              <Button className="btn" type="primary" onClick={this.export}>导出</Button>
            </Col>
          </Row>
        </List>
        {/* 表格与分页区域 */}
        <ListTable {...tableOptions} />
        {/* 修改奖励规则 */}
        {
          this.state.addOrEditVisible
            ?
            <AddOrEdit {...addOrEditOptions} />
            : null
        }
      </div >
    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(F1AwardS2Developer)
export default WrappedAdvancedSearchForm
