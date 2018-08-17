import React, { Component } from 'react'
import { List, Form, Row, Col, Input, Button, Select } from 'antd'
import { myTrim } from '@Utils/myTrim'
const FormItem = Form.Item
const Option = Select.Option


class AuthAccount extends Component {
  constructor() {
    super()
    this.state = {
      expand: false,
      userValue: ''
    }
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 感觉你应该参考一下官网的这个栗子试试，values就是表单对象，你可以看看了来
        // console.log('Received values of form: ', values)
        const data = {
          roleName: myTrim(values.roleName)
        }
        console.log(data)
        console.log(this.state.userValue)
      } else {
        // 处理错误
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <List>
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
          layout="inline"
        >
          <Row>
            <Col span={8}>
              <FormItem label="角色名称">
                {getFieldDecorator('roleName', { initialValue: '' })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="用户名称">
                <Select
                  style={{ width: 200, marginTop: 4 }}
                  placeholder="请输入后选择"
                  allowClear={true}
                >
                  <Option key={'1'}>第1个</Option>
                  <Option key={'2'}>第2个</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <Button style={{ marginTop: 4 }} type="primary" htmlType="submit">查询</Button>
            </Col>
          </Row>
        </Form>
      </List>

    )
  }
}
const WrappedAdvancedSearchForm = Form.create()(AuthAccount)
export default WrappedAdvancedSearchForm
