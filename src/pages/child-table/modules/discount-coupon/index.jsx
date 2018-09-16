import React, { Component } from 'react'
import { Form, Input, Select, Radio } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const TextArea = Input.TextArea

class ModuleClassfiy extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    console.log(props)
  }

  render() {
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
      <div className="discount-coupon-module">
        <div className="module-title">
          <span className="text">优惠券</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <FormItem
            {...formItemLayout}
            label="展示形式"
          >
            {
              getFieldDecorator(`${moduleSymbol}~context-style`, {
                initialValue: 1,
                rules: [
                  {
                    required: true, message: '请选择展示形式',
                  }
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>首页弹出</Radio>
                  <Radio value={2}>固定显示</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="优惠券"
          >
            {getFieldDecorator(`${moduleSymbol}~resourceId`, {
              initialValue: undefined,
              rules: [
                {
                  required: true, message: '请选择优惠券',
                }
              ],
            })(
              <Select allowClear placeholder="请选择" mode="multiple">
                <Option value={1}>a</Option>
                <Option value={2}>b</Option>
                <Option value={3}>c</Option>
                <Option value={4}>d</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="使用规则"
          >
            {
              getFieldDecorator(`${moduleSymbol}~context-rules`, {
                initialValue: '哈哈哈',
                rules: [
                  {
                    required: true,
                    message: '请输入使用规则',
                  },
                  {
                    max: 200,
                    message: '使用规则应小于200个字符',
                  }
                ]
              })(
                <TextArea
                  style={{ height: 100, maxHeight: 100 }}
                  placeholder="请输入请输入使用规则"
                  onPressEnter={e => e.preventDefault()}
                />
              )
            }
          </FormItem>
          <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
            <FormItem
              {...formItemLayout}
              label="moduleType"
            >
              {getFieldDecorator(`${moduleSymbol}~moduleType`, {
                initialValue: 13
              })(
                <Select >
                  <Option value={13}>优惠券</Option>
                </Select>
              )}
            </FormItem>
          </div>
          <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
            <FormItem
              {...formItemLayout}
              label="resourceType"
            >
              {getFieldDecorator(`${moduleSymbol}~resourceType`, {
                initialValue: 10
              })(
                <Select >
                  <Option value={10}>优惠券</Option>
                </Select>
              )}
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}

export default ModuleClassfiy

