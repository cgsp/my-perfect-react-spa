import React, { Component } from 'react'
import { Modal, Form, Input, Radio, InputNumber } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

const FormItem = Form.Item
const RadioGroup = Radio.Group


@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesions }
)
class SelfTagDimensionAddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const title = this.props.addOrEditTitle
        this.props.addOrEditOk(values, title)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    const limitDecimals = value => {
      // 保留2位小数
      const reg = /^(\-)*(\d+)\.(\d\d).*$/
      console.log(value)
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        return ''
      }
    }

    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={() => this.handleSubmit()}
        confirmLoading={this.props.editOrEditConfirmLoading}
        width={800}
        destroyOnClose={true}
        zIndex={10000}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            {
              this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签' ?
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="该维度下标签名称类型"
                  >
                    <RadioGroup
                      defaultValue={this.props.addOrEditInitValues.tagNameType}
                      disabled
                    >
                      <Radio value="text">文本</Radio>
                      <Radio value="number">数值</Radio>
                      <Radio value="numberRange">数值范围</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="标签名称"
                  >
                    {
                      getFieldDecorator('tagName', {
                        initialValue: this.props.addOrEditInitValues.tagName,
                        rules: [
                          {
                            required: true, message: '请输入标签名称',
                          }
                        ],
                      })(
                        this.props.addOrEditInitValues.tagNameType === 'text'
                          ?
                          <Input placeholder="请输入标签名称" />
                          :
                          <InputNumber
                            placeholder="请输入数字"
                            min={0}
                            max={100}
                            step={0.01}
                            formatter={limitDecimals}
                            parser={limitDecimals}
                            style={{ width: 200 }}
                          />
                      )
                    }
                  </FormItem>
                </div>
                : null
            }
            {
              this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签' ?
                null
                :
                <FormItem
                  {...formItemLayout}
                  label="维度名称"
                >
                  {getFieldDecorator('dimensionName', {
                    initialValue: this.props.addOrEditInitValues.dimensionName,
                    rules: [
                      {
                        required: true, message: '请输入维度名称',
                      }
                    ],
                  })(
                    <Input placeholder="请输入维度名称" />
                  )}
                </FormItem>
            }
            {
              this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签' ?
                null
                :
                <FormItem
                  {...formItemLayout}
                  label="该维度下标签是否支持多选"
                >
                  {getFieldDecorator('choiceType', {
                    initialValue: this.props.addOrEditInitValues.choiceType ? this.props.addOrEditInitValues.choiceType : 2,
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
            }
            {
              this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签'
                ?
                null
                :
                <FormItem
                  {...formItemLayout}
                  label="该维度下标签名称类型"
                >
                  {getFieldDecorator('valueType', {
                    initialValue: this.props.addOrEditInitValues.valueType ? this.props.addOrEditInitValues.valueType : 1,
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
            }
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfTagDimensionAddOrEdit = Form.create()(SelfTagDimensionAddOrEdit)
export default WrapperSelfTagDimensionAddOrEdit
