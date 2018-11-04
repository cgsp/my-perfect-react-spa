import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
} from 'antd'
// import { inject, observer } from 'mobx-react'
const { Item } = Form
const { Option } = Select

class FormSearch extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()

  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} style={{ marginBottom: '20px' }}>
        <Item label="开发者名称">
          {getFieldDecorator('developerName')(<Input style={{ width: 200 }} autoComplete="off" />)}
        </Item>
        <Item label="账户状态">
          {getFieldDecorator('accountStatus')(
            <Select placeholder="请选择状态" style={{ width: 200 }}>
              <Option value={0}> 正常 </Option>
              <Option value={1}> 停用 </Option>
            </Select>)}
        </Item>
        <Item label="所属渠道">
          {getFieldDecorator('channels')((
            <Select placeholder="请选择所属商务渠道" style={{ width: 200 }}>
              <Option value={0}> 运营商线 </Option>
              <Option value={1}> 电商线 </Option>
              <Option value={2}> 金融线 </Option>
            </Select>))}
        </Item>

        <Item style={{ marginLeft: 20 }}>
          <Button type="primary" htmlType="submit">
            查询
                    </Button>
        </Item>
      </Form>
    )
  }
}
const CashSearch = Form.create()(FormSearch)
export default CashSearch
