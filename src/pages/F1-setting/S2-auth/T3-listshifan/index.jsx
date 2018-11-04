/*
 * @Author: John.Guan 
 * @Date: 2018-08-25 21:41:03 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-10-29 13:22:51
 */
import React, { Component } from 'react'
import { List, Form, Row, Col, Button, Input, Select, Icon, DatePicker } from 'antd'
// 时间操作库
import moment from 'moment'
// 封装的时间HOC组件
import TimeControlHoc from '@Components/time-control-hoc'
// 封装的工具库
import { myTransTimeObjToStampTime } from '@Utils/my-get-time'
// import { apiAllUserList } from '@Service/setting'
// import { SUCCESS_OK } from '@Constants'
import ListTable from './list-table'

const FormItem = Form.Item
const Option = Select.Option
// const confirm = Modal.confirm

@TimeControlHoc
class SettingAuthAccount extends Component {
  constructor() {
    super()
    this.state = {
      tableTotal: 0,
      tableData: [],
      current: 1,
      pageSize: 10,
      roleSelectData: [],
      expand: false,
      expandName: '展开'
    }
    this.pageOrPageSizeChange = this.pageOrPageSizeChange.bind(this)
    this.tableLineEdit = this.tableLineEdit.bind(this)
    this.tableLineDelete = this.tableLineDelete.bind(this)
  }

  componentDidMount() {
    // 初始化查询列表数据
    // this.getListData({
    //   current: 1,
    //   pageSize: 10,
    // })
  }

  // 获取列表页面的数据
  getListData(options) {

  }

  // 展示分页total
  showTableTotal(total) {
    return `共 ${total} 条`
  }

  // 列表页面的编辑
  tableLineEdit(line) {
    console.log('编辑', line)
  }

  // 列表页面的删除
  tableLineDelete(line) {
    // console.log(line)
  }

  // 列表页面，分页插件的变化
  pageOrPageSizeChange() {

  }

  // 搜索查询，支持input输入框的回车搜索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 将获取的时间对象转换为时间戳
      const time1Beigin = myTransTimeObjToStampTime(this.props.state.searchCreateTimeBegin)
      const time1End = myTransTimeObjToStampTime(this.props.state.searchCreateTimeEnd)
      const time2Beigin = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeBegin)
      const time2End = myTransTimeObjToStampTime(this.props.state.searchUpdateTimeEnd)
      values = {
        ...values,
        ...{
          time1Beigin,
          time1End,
          time2Beigin,
          time2End,
        }
      }
      console.log(values)
    });
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
  resetTime = () => {
    // 需要传入key,value两个参数
    // key分别是searchCreateTimeBegin，searchCreateTimeEnd，searchUpdateTimeEnd，searchUpdateTimeBegin
    // value必须是11位的时间戳 如，1540940889387
    this.props.resetTime('searchCreateTimeBegin', 1540940889387)
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
          <FormItem label={`用户名1`}>
            {getFieldDecorator('userName1', {
              rules: [],
            })(
              <Input placeholder="请输入用户名" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={2}>
          <FormItem label={`用户名2`}>
            {getFieldDecorator('userName2', {
              rules: [],
            })(
              <Input placeholder="请输入用户名" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={3}>
          <FormItem label={`用户名3`}>
            {getFieldDecorator('userName3', {
              rules: [],
            })(
              <Input placeholder="请输入用户名" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={4} style={{ display: show ? 'block' : 'none' }}>
          <FormItem label={`用户名4`}>
            {getFieldDecorator('userName4', {
              rules: [],
            })(
              <Input placeholder="请输入用户名" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={5} style={{ display: show ? 'block' : 'none' }}>
          <FormItem label={`用户名5`}>
            {getFieldDecorator('userName5', {
              rules: [],
            })(
              <Input placeholder="请输入用户名" autoComplete="off" />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={6} style={{ display: show ? 'block' : 'none' }}>
          <FormItem
            label={'自运营标签ID'}
          >
            {getFieldDecorator('id', {
              rules: [],
            })(
              <Select
                placeholder="请选择分类"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                notFoundContent="请先选择来源"
              >
                <Option key={'1'} value={1}>1</Option>
                <Option key={'2'} value={2}>2</Option>
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={7} style={{ display: show ? 'block' : 'none' }}>
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
        <Col span={8} key={8} style={{ display: show ? 'block' : 'none' }}>
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
        <Col span={8} key={9} style={{ display: show ? 'block' : 'none' }}>
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
        <Col span={8} key={10} style={{ display: show ? 'block' : 'none' }}>
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

  render() {
    const tableOptions = {
      showTotal: this.showTableTotal,
      tableData: this.state.tableData,
      total: this.state.tableTotal,
      tableLineEdit: this.tableLineEdit,
      tableLineDelete: this.tableLineDelete,
      pageOrPageSizeChange: this.pageOrPageSizeChange,
      current: this.state.current
    }

    return (
      <div className="setting-auth-account">
        {/* 标题区域 */}
        <div className="app-content-title">
          示范列表页面
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
              <Button className="btn" type="primary" onClick={this.addFirst}>新增一级渠道</Button>
              <Button className="btn" type="primary">导出</Button>
              <Button className="btn" type="primary" onClick={this.resetTime}>重置时间示范</Button>
            </Col>
          </Row>
        </List>
        {/* 表格与分页区域 */}
        <ListTable {...tableOptions} />
      </div >
    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(SettingAuthAccount)
export default WrappedAdvancedSearchForm
