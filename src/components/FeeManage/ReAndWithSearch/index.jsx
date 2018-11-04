import React from 'react'
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

  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { mark } = this.props
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} style={{ marginBottom: '20px' }}>
        <Item label="开发者名称">
          {getFieldDecorator('developerName')(<Input style={{ width: 200 }} autoComplete="off" />)}
        </Item>
        <Item label="交易流水号">
          {getFieldDecorator('num')(<Input style={{ width: 200 }} autoComplete="off" />)}
        </Item>
        <Item label="充值时间">
          {getFieldDecorator('time')(<RangePicker style={{ width: 200 }} />)}
        </Item>

        <Item label="所属渠道">
          {getFieldDecorator('channels')((
            <Select placeholder="请选择所属商务渠道" style={{ width: 200 }}>
              <Option value={0}> 运营商线 </Option>
              <Option value={1}> 电商线 </Option>
              <Option value={2}> 金融线 </Option>
            </Select>))}
        </Item>
        {mark === 'recharge' && <div style={{ display: 'inline-block' }}>
          <Item label="充值类型">
            {getFieldDecorator('type')(
              <Select placeholder="请选择所属充值类型" style={{ width: 200 }}>
                <Option value={0}> 在线支付 </Option>
                <Option value={1}> 线下汇款 </Option>
                <Option value={2}> 平台发起充值 </Option>
              </Select>)}
          </Item>
          <Item label="充值状态">
            {getFieldDecorator('accountStatus')(
              <Select placeholder="请选择状态" style={{ width: 200 }}>
                <Option value={0}> 充值成功 </Option>
                <Option value={1}> 充值失败 </Option>
              </Select>)}
          </Item>
        </div>}
        {mark === 'withdraw' && <Item label="提现状态">
          {getFieldDecorator('accountStatus')(
            <Select placeholder="请选择状态" style={{ width: 200 }}>
              <Option value={0}> 提现成功 </Option>
              <Option value={1}> 提现失败 </Option>
            </Select>)}
        </Item>}



        <Item style={{ marginLeft: 20 }}>
          <Button type="primary" htmlType="submit">
            查询
                    </Button>
          <Button style={{ marginLeft: '15px' }}>
            导出
                    </Button>
        </Item>
      </Form>
    )
  }
}
const ReAndWithSearch = Form.create()(FormSearch)
export default ReAndWithSearch
