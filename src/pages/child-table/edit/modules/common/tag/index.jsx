import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option


class ChildTag extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      moduleType: 4,
    }

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
            initialValue: this.props.moduleValue.moduleType,
            rules: [
              {
                required: true, message: '请选择展示形式',
              }
            ],
          })(
            <Select
              onSelect={e => {
                this.setState({
                  moduleType: e
                })
              }}
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
              initialValue: this.props.moduleValue.displayNum,
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
              initialValue: this.props.moduleValue.displayName,
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
          label="自运营标签Id"
        >
          {getFieldDecorator(`${moduleSymbol}~resourceId`, {
            initialValue: this.props.moduleValue.resourceId,
            rules: [
              {
                required: true, message: '请输入自运营标签Id',
              }
            ],
          })(
            <Input type="number" placeholder="请输入自运营标签Id" onPressEnter={e => e.preventDefault()} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="专辑来源"
        >
          {getFieldDecorator(`${moduleSymbol}~context-contentType`, {
            initialValue: this.props.moduleValue.context ? JSON.parse(this.props.moduleValue.context).contentType : undefined,
            rules: [
              {
                required: true, message: '请选择专辑来源',
              }
            ],
          })(
            <Select
              allowClear
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={2}>主站专辑</Option>
              <Option value={8}>自运营专辑</Option>
            </Select>
          )}
        </FormItem>
      </div >
    )
  }
}

export default ChildTag

