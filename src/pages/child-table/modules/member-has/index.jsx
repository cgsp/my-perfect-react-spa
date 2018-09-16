import React, { Component } from 'react'
import { Form, Input, message, Select } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option

class ModuleMemberHas extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6, offset: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    return (
      <div className="member-has-module">
        <div className="module-title">
          <span className="text">会员专享</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="展示名称"
            >
              {
                getFieldDecorator('displayName', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入展示名称',
                    },
                    {
                      max: 10,
                      message: '展示名称应该小于10个字符',
                    }
                  ]
                })(
                  <Input placeholder="请输入展示名称" onPressEnter={e => e.preventDefault()} />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="展示形式"
            >
              {getFieldDecorator('moduleType', {
                initialValue: 4,
                rules: [
                  {
                    required: true, message: '请选择展示形式',
                  }
                ],
              })(
                <Select allowClear onChange={(v) => this.sourceChange(v)}>
                  <Option value={4}>平铺</Option>
                  <Option value={5}>列表</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="平铺行数或列表行数"
            >
              {
                getFieldDecorator('displayNum', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入平铺行数或列表行数',
                    }
                  ]
                })(
                  <Input type="number" placeholder="请输入平铺行数或列表行数" onPressEnter={e => e.preventDefault()} />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="自运营听单ID"
            >
              {
                getFieldDecorator('resourceId', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: true,
                      message: '请输入自运营听单ID',
                    }
                  ]
                })(
                  <Input type="number" placeholder="请输入自运营听单ID" onPressEnter={e => e.preventDefault()} />
                )
              }
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

const WrapperModuleMemberHas = Form.create()(ModuleMemberHas)
export default WrapperModuleMemberHas
