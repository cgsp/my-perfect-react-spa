import React, { Component } from 'react'
import { Modal, Form, Input, Radio, InputNumber, Row, Col, message } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

const FormItem = Form.Item
const RadioGroup = Radio.Group


@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesions }
)
class SelfAddDimension extends Component {
  static propTypes = {
    addDimesinonVisible: PropTypes.bool,
    addDimesinonOk: PropTypes.func,
    addDimesinonCancel: PropTypes.func,
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.addDimesinonOk(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }

    return (
      <Modal
        title={'新增维度'}
        visible={this.props.addDimesinonVisible}
        onCancel={this.props.addDimesinonCancel}
        onOk={() => this.handleSubmit()}
        width={800}
        destroyOnClose={true}
        zIndex={10000}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="维度名称"
            >
              {getFieldDecorator('dimensionName', {
                rules: [
                  {
                    required: true, message: '请输入维度名称',
                  }
                ],
              })(
                <Input placeholder="请输入维度名称" style={{ maxWidth: 300 }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="该维度下标签是否支持多选"
            >
              {getFieldDecorator('choiceType', {
                initialValue: 2,
                rules: [
                  {
                    required: true, message: '请选择',
                  }
                ],
              })(
                <RadioGroup>
                  <Radio value={2}>支持多选</Radio>
                  <Radio value={1}>只能单选</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="该维度下标签名称类型"
            >
              {getFieldDecorator('valueType', {
                initialValue: 1,
                rules: [
                  {
                    required: true, message: '请选择该维度下标签名称类型'
                  }
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>文本</Radio>
                  <Radio value={2}>数值</Radio>
                  <Radio value={3}>数值范围</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfAddDimension = Form.create()(SelfAddDimension)
export default WrapperSelfAddDimension
