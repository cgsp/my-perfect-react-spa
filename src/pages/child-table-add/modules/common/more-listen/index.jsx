import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

class ChildMoreListen extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }


  render() {
    const getFieldDecorator = this.props.getFieldDecorator
    const { taskId, content
    } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
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
      <div>
        <FormItem
          {...formItemLayout}
          label="展示形式"
        >
          {getFieldDecorator(`${moduleSymbol}~moduleType`, {
            initialValue: 4,
            rules: [
              {
                required: true, message: '请选择展示形式',
              }
            ],
          })(
            <Select
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={4}>平铺</Option>
              <Option value={5}>列表</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="平铺行数或展示数量"
        >
          {
            getFieldDecorator(`${moduleSymbol}~displayNum`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入平铺行数或展示数量',
                }
              ]
            })(
              <Input type="number" placeholder="请输入平铺行数或展示数量" onPressEnter={e => e.preventDefault()} />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="模块展示名称"
        >
          {
            getFieldDecorator(`${moduleSymbol}~displayName`, {
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
          label="听单ID"
        >
          {
            getFieldDecorator(`${moduleSymbol}~topContentIds`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入听单ID',
                }
              ]
            })(
              <TextArea
                style={{ height: 100, maxHeight: 100 }}
                placeholder="请换行输入听单ID"
              />
            )
          }
        </FormItem>
      </div>
    )
  }
}

export default ChildMoreListen

