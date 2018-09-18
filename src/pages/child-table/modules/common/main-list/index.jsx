import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option

class ChildMainList extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
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
            initialValue: 5,
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
              <Option value={5}>列表</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="展示数量"
        >
          {
            getFieldDecorator(`${moduleSymbol}~displayNum`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入展示数量',
                }
              ]
            })(
              <Input type="number" placeholder="请输入展示数量" onPressEnter={e => e.preventDefault()} />
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
          label="榜单Id"
        >
          {
            getFieldDecorator(`${moduleSymbol}~resourceId`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入榜单Id',
                }
              ]
            })(
              <Input type="number" placeholder="请输入榜单Id" onPressEnter={e => e.preventDefault()} />
            )
          }
        </FormItem>
      </div>
    )
  }
}

export default ChildMainList

