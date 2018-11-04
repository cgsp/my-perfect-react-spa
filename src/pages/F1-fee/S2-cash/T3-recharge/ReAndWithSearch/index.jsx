import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd'
import moment from 'moment'
// import { inject, observer } from 'mobx-react'
import './style.scss'
const { Item } = Form
const { Option } = Select
// const { RangePicker } = DatePicker

class FormSearch extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    console.log('调充值记录查询接口')
  }

  range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day')
  }

  disabledDateTime = () => {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    // const { mark } = this.props
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} style={{ marginBottom: '20px' }} className="recharge-search-form">
        <Row>
          <Col span={8}>
            <Item label="交易流水号" className="form-item">
              {getFieldDecorator('num')(<Input style={{ width: 200 }} autoComplete="off" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="支付流水号" className="form-item">
              {getFieldDecorator('num')(<Input style={{ width: 200 }} autoComplete="off" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="交易开始时间" className="form-item">
              {getFieldDecorator('time')(
                <DatePicker
                  style={{ width: 200 }}
                  showTime={
                    {
                      defaultValue: moment().startOf('day'),
                      hideDisabledOptions: true,
                    }
                  }
                  showToday={false}
                  disabledDate={this.disabledDate}
                  disabledTime={this.disabledDateTime}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择起始时间"
                  getCalendarContainer={trigger => trigger.parentNode}
                />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="交易结束时间" className="form-item">
              {getFieldDecorator('end-time')(
                <DatePicker
                  style={{ width: 200 }}
                  showTime={
                    {
                      defaultValue: moment().startOf('day'),
                      hideDisabledOptions: true,
                    }
                  }
                  showToday={false}
                  disabledDate={this.disabledDate}
                  disabledTime={this.disabledDateTime}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择起始时间"
                  getCalendarContainer={trigger => trigger.parentNode}
                />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="充值状态" className="form-item">
              {getFieldDecorator('accountStatus')(
                <Select placeholder="请选择状态" style={{ width: 200 }}>
                  <Option value={0}> 充值成功 </Option>
                  <Option value={1}> 充值失败 </Option>
                </Select>)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="充值类型" className="form-item">
              {getFieldDecorator('type')(
                <Select placeholder="请选择所属充值类型" style={{ width: 200 }}>
                  <Option value={0}> 在线支付 </Option>
                  <Option value={1}> 线下汇款 </Option>
                  <Option value={2}> 平台发起充值 </Option>
                </Select>)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="开发者名称" className="form-item">
              {getFieldDecorator('developerName')(<Input style={{ width: 200 }} autoComplete="off" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="所属渠道" className="form-item">
              {getFieldDecorator('channels')((
                <Select placeholder="请选择所属商务渠道" style={{ width: 200 }}>
                  <Option value={0}> 运营商线 </Option>
                  <Option value={1}> 电商线 </Option>
                  <Option value={2}> 金融线 </Option>
                </Select>))}
            </Item>
          </Col>
          <Col span={8}>
            <Item className="form-item">
              <Button type="primary" htmlType="submit">
                查询
                            </Button>
            </Item>
          </Col>
        </Row>
      </Form>
    )
  }
}
const ReAndWithSearch = Form.create()(FormSearch)
export default ReAndWithSearch
