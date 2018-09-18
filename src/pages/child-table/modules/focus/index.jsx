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

class ModuleFocus extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  // constructor(props) {
  //   super(props)
  //   console.log(props)
  // }

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
      <div className="focus-module">
        <div className="module-title">
          <span className="text">焦点图</span>
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
                  <Radio value={1}>轮播</Radio>
                  <Radio value={2}>平铺</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="焦点图ID"
          >
            {
              getFieldDecorator(`${moduleSymbol}~topContentIds`, {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入焦点图ID',
                  }
                ]
              })(
                <TextArea
                  style={{ height: 100, maxHeight: 100 }}
                  placeholder="请换行输入焦点图ID，最多输入4个"
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
                initialValue: 2
              })(
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={2}>优惠券</Option>
                </Select>
              )}
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}

export default ModuleFocus

