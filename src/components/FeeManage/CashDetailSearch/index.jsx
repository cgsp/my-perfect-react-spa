import React from 'react'
import moment from 'moment'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker
} from 'antd'
// import { inject, observer } from 'mobx-react'
const { Item } = Form
const { Option } = Select
const { RangePicker } = DatePicker
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

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} style={{ marginBottom: '30px', marginLeft: '30px' }}>
        <Item label="交易时间">
          {getFieldDecorator('time')(
            <RangePicker
              onChange={this.onChange}
              onOk={this.onOk}
              showTime={{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />)}
        </Item>
        <Item label="交易流水号">
          {getFieldDecorator('accountStatus')(<Input style={{ width: '170px' }} autoComplete="off" />)}
        </Item>
        <Item label="交易类型">
          {getFieldDecorator('channels')(
            <Select placeholder="请选择交易类型" style={{ width: '170px' }}>
              <Option value={0}> 充值 </Option>
              <Option value={1}> 提现 </Option>
              <Option value={2}> 转出 </Option>
              <Option value={3}> 转入 </Option>
              <Option value={4}> 提现手续费 </Option>
            </Select>)}
        </Item>
        <Item style={{ marginLeft: '40px' }}>
          <Button type="primary" htmlType="submit">
            查询
                    </Button>
          <Button style={{ marginLeft: '10px' }}>
            导出
                    </Button>
        </Item>
      </Form>
    )
  }
}
const CashDetailSearch = Form.create()(FormSearch)
export default CashDetailSearch
