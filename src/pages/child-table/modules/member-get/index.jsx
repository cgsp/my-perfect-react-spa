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

class ModuleMemberGet extends Component {
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
      <div className="member-get-module">
        <div className="module-title">
          <span className="text">会员领取</span>
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
            label="会员活动天数"
          >
            {getFieldDecorator(`${moduleSymbol}~context-itemId`, {
              initialValue: 1,
              rules: [
                {
                  required: true, message: '请选择会员活动天数',
                }
              ],
            })(
              <Select
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Option value={1}>3天</Option>
                <Option value={2}>7天</Option>
                <Option value={3}>15天</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="发放数量"
          >
            {
              getFieldDecorator(`${moduleSymbol}~context-nums`, {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入发放数量',
                  }
                ]
              })(
                <Input type="number" placeholder="请输入发放数量" onPressEnter={e => e.preventDefault()} />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注说明"
          >
            {
              getFieldDecorator(`${moduleSymbol}~context-remark`, {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入备注说明',
                  },
                  {
                    max: 200,
                    message: '备注说明应该小于200个字符',
                  }
                ]
              })(
                <TextArea
                  style={{ height: 100, maxHeight: 100 }}
                  placeholder="请输入备注说明"
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
                initialValue: 14
              })(
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={14}>会员领取</Option>
                </Select>
              )}
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}

export default ModuleMemberGet
