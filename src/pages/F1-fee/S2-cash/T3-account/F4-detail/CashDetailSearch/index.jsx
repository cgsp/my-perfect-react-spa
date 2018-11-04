import React from 'react'
import moment from 'moment'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd'
// import {inject, observer} from 'mobx-react'
import './style.scss'
const { Item } = Form
const { Option } = Select




class FormSearch extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      console.log('catagories_value', values)

    })
  }

  onChange = (data, datastring) => {
    console.log('data, datastring', data, datastring)
  }
  onOk = (value) => {
    console.log('data, datastring2222', value)
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
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className="cashDetail-search-form">
        <Row>
          <Col span={8}>
            <Item label="交易开始时间" className="form-item">
              {getFieldDecorator('time')(
                <DatePicker
                  style={{ width: '220px' }}
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
                  style={{ width: '220px' }}
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
            <Item label="交易流水号" className="form-item">
              {getFieldDecorator('accountStatus')(<Input autoComplete="off" style={{ width: '220px' }} />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="交易类型" className="form-item">
              {getFieldDecorator('channels')(
                <Select placeholder="请选择交易类型" style={{ width: '220px' }}>
                  <Option value={0}> 充值 </Option>
                  <Option value={1}> 提现 </Option>
                  <Option value={2}> 转出 </Option>
                  <Option value={3}> 转入 </Option>
                  <Option value={4}> 提现手续费 </Option>
                </Select>)}
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
const CashDetailSearch = Form.create()(FormSearch)
export default CashDetailSearch
