import React, { Component } from 'react'
// 时间操作库
import moment from 'moment'
// 封装的时间HOC组件
import TimeControlHoc from '@Components/time-control-hoc'
import { myExportFile } from '@Utils/my-export-file'
import { http } from '@Service'
import { SUCCESS_OK } from '@Constants'
import { myTransTimeObjToStampTime } from '@Utils/my-get-time'
import { apiGetAwardDeveloperUserList, apiGetAwardDeveloperSummary } from '@Service/award'
import { List, Form, Row, Col, Button, Select, Icon, DatePicker, message } from 'antd'
import { myGetMoneyStyle } from '@Utils/my-get-money-style'
import BreadcrumbNav from '@Components/bread-crumb'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/my-storages'
import ListTable from './list-table'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option

@TimeControlHoc
class F1AwardS2DeveloperF4Pull extends Component {
  constructor(props) {
    super(props)
    // 列表传进来的数据进行长缓存
    // console.log(this.props.location.query)
    if (this.props.location.query && this.props.location.query.listGiveValues) {
      const { listGiveValues } = this.props.location.query
      mySessionStorageSet('F1AwardS2DeveloperF4Pull', listGiveValues)
    }
    this.state = {
      listGiveValues: mySessionStorageGet('F1AwardS2DeveloperF4Pull', {}),
      tableTotal: 0,
      tableData: [],
      current: 1,
      pageSize: 10,
      orderBy: 'created_at',
      desc: true,
      expand: false,
      expandName: '展开',
      summaryData: {}
    }

    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.export = this.export.bind(this)
  }

  componentDidMount() {
    const { developerId } = this.state.listGiveValues
    if (!developerId) {
      this.props.history.push('/!F1-award/!S2-developer')
      return
    }
    this.searchList({})
    this.getSummaryData()
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

  // 获取概况
  getSummaryData() {
    const { developerId, rewardType } = this.state.listGiveValues
    http.get(apiGetAwardDeveloperSummary, { developerId, rewardType })
      .then(res => {
        if (res.code !== SUCCESS_OK) {
          message.error(res.message)
          return
        }
        let summaryData = res.data || {}
        this.setState({
          summaryData
        })
      })
  }

  // 获取列表页面的数据
  getListData(options) {
    const tip = options.tip
    if (options.tip) {
      delete options.tip
    }
    http.post(apiGetAwardDeveloperUserList, options)
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
            item.key = item.id
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
      const { pageSize, current, orderBy, desc, listGiveValues } = this.state
      // console.log(listGiveValues)
      const { developerId, rewardType } = listGiveValues
      const bindTimeBegin = myTransTimeObjToStampTime(this.props.state.searchCreateTimeBegin)
      const bindTimeEnd = myTransTimeObjToStampTime(this.props.state.searchCreateTimeEnd)
      const invalidTimeBegin = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeBegin)
      const invalidTimeEnd = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeEnd)
      let searchFormValues = this.props.form.getFieldsValue()
      // console.log(searchFormValues)
      values = {
        ...values,
        ...searchFormValues,
        ...{
          bindTimeBegin,
          bindTimeEnd,
          invalidTimeBegin,
          invalidTimeEnd,
          pageSize,
          current,
          orderBy,
          desc,
          developerId,
          rewardType
        },
      }
      values.page = values.current
      if (values.orderBy === 'updated_at') {
        values.orderBy = 'invalid_time'
      } else {
        values.orderBy = 'bind_time'
      }
      delete values.current
      this.getListData(values)
    })
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
          <FormItem
            label={'绑定原因'}
          >
            {getFieldDecorator('bindReason', {
              rules: [],
            })(
              <Select
                placeholder="请选择绑定原因"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="加载中..."
              >
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={2}>
          <FormItem
            label={'绑定业务来源'}
          >
            {getFieldDecorator('fromBusiness', {
              rules: [],
            })(
              <Select
                placeholder="请选择绑定业务来源"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="加载中..."
              >
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={3}>
          <FormItem
            label={'绑定来源应用'}
          >
            {getFieldDecorator('fromApp', {
              rules: [],
            })(
              <Select
                placeholder="请选择绑定来源应用"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="加载中..."
              >
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={4} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'绑定状态'}
          >
            {getFieldDecorator('bindStatus', {
              rules: [],
            })(
              <Select
                placeholder="请选择绑定状态"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="加载中..."
              >
                <Option value={1}>绑定中</Option>
                <Option value={0}>已失效</Option>
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={5} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'绑定起始时间'}
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
        <Col span={8} key={6} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'绑定结束时间'}
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
        <Col span={8} key={7} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'绑定失效起始时间'}
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
        <Col span={8} key={8} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'绑定失效结束时间'}
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

  // 列表的排序
  clickSort(orderBy, desc) {
    this.setState({
      orderBy, desc
    })
    console.log(orderBy, desc)
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

  // 列表页面的导出
  export() {
    this.setState({}, () => {
      const { orderBy, desc, listGiveValues } = this.state
      const { developerId, rewardType } = listGiveValues
      const bindTimeBegin = myTransTimeObjToStampTime(this.props.state.searchCreateTimeBegin)
      const bindTimeEnd = myTransTimeObjToStampTime(this.props.state.searchCreateTimeEnd)
      const invalidTimeBegin = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeBegin)
      const invalidTimeEnd = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeEnd)
      let searchFormValues = this.props.form.getFieldsValue()
      // console.log(searchFormValues)
      const values = {
        ...searchFormValues,
        ...{
          bindTimeBegin,
          bindTimeEnd,
          invalidTimeBegin,
          invalidTimeEnd,
          orderBy,
          desc,
          developerId,
          rewardType
        },
      }
      if (values.orderBy === 'updated_at') {
        values.orderBy = 'invalid_time'
      } else {
        values.orderBy = 'bind_time'
      }
      myExportFile('xxx/yyy', values)
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
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      current: this.state.current
    }

    const { summaryData } = this.state

    return (
      <div className="award-developer-reorder">
        <div className="app-bread-crumb-nav">
          <BreadcrumbNav url={{ pathname: '/!F1-award/!S2-developer', query: { needRecoverySearch: true } }} name1='开发者管理' name2='续定奖励详情' />
        </div>
        <div className="app-detail-module-title">
          开发者名称：
          <span className="develop-name">
            {this.state.listGiveValues.developerName}
          </span>
        </div>
        <div className="app-detail-module-title">
          奖励概况
        </div>
        <div className="summary">
          <div>
            <span className="title">绑定中用户数:</span>
            <span className="num">{summaryData.bindUsers || 0}</span>
            <span className="label">人</span>
          </div>
          <div>
            <span className="title">累计奖励订单:</span>
            <span className="num">{summaryData.rewardOrderCount || 0}</span>
            <span className="label">个</span>
          </div>
          <div>
            <span className="title">累计奖励金额:</span>
            <span className="num">{`¥ ${myGetMoneyStyle(summaryData.rewardAmount, 2)}`}</span>
          </div>
          <div>
            <span className="title">奖励比例:</span>
            <span className="num">{summaryData.rewardRate || 0}</span>
          </div>
          <div>
            <span className="title">连续包月用户数:</span>
            <span className="num">{summaryData.continuousMonthUsers || 0}</span>
            <span className="label">人</span>
          </div>
          <div>
            <span className="title">连续包季用户:</span>
            <span className="num">{summaryData.continuousSeasonUsers || 0}</span>
            <span className="label">人</span>
          </div>
          <div>
            <span className="title">连续包年用户数:</span>
            <span className="num">{summaryData.continuousYearUsers || 0}</span>
            <span className="label">人</span>
          </div>
        </div>
        <div className="app-detail-module-title">
          绑定用户列表
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
      </div>
    )
  }
}

const WrappedAdvancedSearchForm = Form.create()(F1AwardS2DeveloperF4Pull)
export default WrappedAdvancedSearchForm
