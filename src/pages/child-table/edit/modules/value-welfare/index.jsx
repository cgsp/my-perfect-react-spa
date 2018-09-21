import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option

class ModuleValueWelfare extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      moduleValue: props.task.moduleValue || {}
    }
    // console.log(props)
  }

  render() {
    const { moduleValue } = this.state
    const getFieldDecorator = this.props.getFieldDecorator
    const { taskId, content
    } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    // console.log(moduleSymbol)
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
      <div className="value-welfare-module">
        <div className="module-title">
          <span className="text">超值福利</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <FormItem
            {...formItemLayout}
            label="展示名称"
          >
            {
              getFieldDecorator(`${moduleSymbol}~displayName`, {
                initialValue: moduleValue.displayName,
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
            {getFieldDecorator(`${moduleSymbol}~context-style`, {
              initialValue: moduleValue.context ? JSON.parse(moduleValue.context).style + '' : undefined,
              rules: [
                {
                  required: true, message: '请选择展示形式',
                }
              ],
            })(
              <Select
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Option value={'1'}>平铺</Option>
                <Option value={'2'}>列表</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="平铺行数或列表行数"
          >
            {
              getFieldDecorator(`${moduleSymbol}~displayNum`, {
                initialValue: moduleValue.displayNum,
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
              getFieldDecorator(`${moduleSymbol}~resourceId`, {
                initialValue: moduleValue.resourceId,
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
          <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
            <FormItem
              {...formItemLayout}
              label="resourceType"
            >
              {getFieldDecorator(`${moduleSymbol}~resourceType`, {
                initialValue: 3
              })(
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={3}>自运营听单</Option>
                </Select>
              )}
            </FormItem>
          </div>
          <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
            <FormItem
              {...formItemLayout}
              label="moduleType"
            >
              {getFieldDecorator(`${moduleSymbol}~moduleType`, {
                initialValue: 16
              })(
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={16}>超值福利</Option>
                </Select>
              )}
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}

export default ModuleValueWelfare

