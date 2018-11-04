import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  DatePicker
} from 'antd'
// import { inject, observer } from 'mobx-react'
// import { sessionCache } from '@Utils/cache'
import moment from 'moment'
const { Item } = Form
const { Option } = Select

class FormSearch extends React.Component {
  handleSubmit = (e) => {
    // const { mark } = this.props
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
    })
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
      <div>
        <Form layout="inline" className="withdraw-search-form" onSubmit={this.handleSubmit}>

          <Row>
            <Col span={8}>
              <Item label="开发者名称" className="form-item">
                {getFieldDecorator("app_name")(<Input style={{ width: 200 }} autoComplete="off" />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="所属渠道" className="form-item">
                {getFieldDecorator('audit_channel')(
                  <Select placeholder="请选择所属渠道" style={{ width: 200 }}>
                    <Option value={-1}> 商务渠道 </Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="状态" className="form-item">
                {getFieldDecorator('audit_state')(
                  <Select placeholder="请选择状态" style={{ width: 200 }}>
                    <Option value={-1}> 待商务审核 </Option>
                    <Option value={2}> 待技术支持审核 </Option>
                    <Option value={3}> 已通过 </Option>
                    <Option value={4}> 未通过 </Option>
                  </Select>
                )}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="申请开始时间" className="form-item">
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
              <Item label="申请结束时间" className="form-item">
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
              <Item className="form-item">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
const Search = Form.create()(FormSearch)
export default Search
