import React, { Component } from 'react'
import { Form, Input, Select, Radio, Button, message } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import { myHuanHang } from '@Utils/myHuanHang'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const TextArea = Input.TextArea

class ModuleDiscountCoupon extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    // console.log(props.task.moduleValue)
    this.state = {
      rules: undefined,
      moduleValue: props.task.moduleValue || {}
    }
    // console.log(props)
  }

  getRules = () => {
    this.setState({}, () => {
      if (!this.state.couponIds) {
        message.error('请选输入优惠券Id')
        return
      }
      this.setState({
        rules: '规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n规则1\n规则2\n'
      })
      console.log(myHuanHang(this.state.couponIds))
    })
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
                initialValue: moduleValue.context ? JSON.parse(moduleValue.context).style + '' : undefined,
                rules: [
                  {
                    required: true, message: '请选择展示形式',
                  }
                ],
              })(
                <RadioGroup>
                  <Radio value={'1'}>首页弹出</Radio>
                  <Radio value={'2'}>固定显示</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="优惠券"
          >
            {
              getFieldDecorator(`${moduleSymbol}~context-couponIds`, {
                initialValue: moduleValue.context ? JSON.parse(moduleValue.context).couponIds.split(',').join('\n') : undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券Id',
                  }
                ]
              })(
                <TextArea
                  style={{ height: 100, maxHeight: 100 }}
                  onChange={(e) => {
                    this.setState({
                      couponIds: e.target.value
                    })
                  }}
                  placeholder="请换行输入优惠券Id"
                />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="查看规则"
          >
            <Button type="primary" onClick={this.getRules}>确定</Button>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="使用规则"
          >
            <TextArea
              style={{ height: 100, maxHeight: 100 }}
              value={this.state.rules}
              disabled={true}
            />
          </FormItem>
          <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
            <FormItem
              {...formItemLayout}
              label="moduleType"
            >
              {getFieldDecorator(`${moduleSymbol}~moduleType`, {
                initialValue: 13
              })(
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value={13}>优惠券</Option>
                </Select>
              )}
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}

export default ModuleDiscountCoupon

