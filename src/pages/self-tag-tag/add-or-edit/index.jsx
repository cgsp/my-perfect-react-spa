import React, { Component } from 'react'
import { Modal, Form, Input, Radio, InputNumber, Row, Col, message, Select } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


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

  constructor(props) {
    super(props)
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('提交', values)
        this.props.addOrEditOk(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { commonDimesions } = this.props
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

    // const limitDecimals = value => {
    //   // 保留2位小数
    //   const reg = /^(\-)*(\d+)\.(\d\d).*$/
    //   console.log(value)
    //   if (typeof value === 'string') {
    //     return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
    //   } else if (typeof value === 'number') {
    //     return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    //   } else {
    //     return ''
    //   }
    // }

    console.log(this.props.commonDimesions)


    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={() => this.handleSubmit()}
        destroyOnClose={true}
        zIndex={10000}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="维度"
            >
              {
                getFieldDecorator('dimensionId', {
                  initialValue: this.props.addOrEditInitValues.dimensionId,
                  rules: [
                    {
                      required: true, message: '请选择维度',
                    }
                  ],
                })(
                  <Select
                    style={{ width: 190 }}
                    placeholder="请选择维度"
                    allowClear
                  >
                    {
                      commonDimesions.map((item) => (
                        <Option key={item.id} value={item.id}>{item.dimensionName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Select"
              hasFeedback
            >
              {getFieldDecorator('select', {
                rules: [
                  { required: true, message: 'Please select your country!' },
                ],
              })(
                <Select 
                placeholder="Please select a country"
                getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value="china">China</Option>
                  <Option value="use">U.S.A</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所选维度的标签类型"
            >
              <RadioGroup
                defaultValue={this.props.addOrEditInitValues.valueType}
                disabled
              >
                <Radio value={1}>文本</Radio>
                <Radio value={2}>数值</Radio>
                <Radio value={3}>数值范围</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标签名称"
            >
              {
                getFieldDecorator('name', {
                  initialValue: this.props.addOrEditInitValues.name,
                  rules: [
                    {
                      required: true, message: '请输入标签名称',
                    }
                  ],
                })(
                  this.props.addOrEditInitValues.valueType === 1
                    ?
                    <Input placeholder="请输入标签名称" />
                    :
                    <InputNumber
                      placeholder="请输入数字"
                      style={{ width: 200 }}
                    />
                )
              }

            </FormItem>
            {
              (this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签') && this.props.addOrEditInitValues.valueType === 3 ?
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="该维度下标签名称类型"
                  >
                    <RadioGroup
                      defaultValue={this.props.addOrEditInitValues.valueType}
                      disabled
                    >
                      <Radio value={1}>文本</Radio>
                      <Radio value={2}>数值</Radio>
                      <Radio value={3}>数值范围</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="标签名称"
                  >
                    <Row>
                      <Col span={10}>
                        <InputNumber
                          placeholder="请输入数字"
                          style={{ width: 200 }}
                          defaultValue={
                            this.props.addOrEditInitValues.name
                              ?
                              this.props.addOrEditInitValues.name.split('~')[0] - 0 :
                              0
                          }
                          onChange={
                            (v) => this.setState({ num1: v })
                          }
                        />
                      </Col>
                      <Col span={2} offset={2}>
                        <InputNumber
                          placeholder="请输入数字"
                          style={{ width: 200 }}
                          defaultValue={
                            this.props.addOrEditInitValues.name
                              ?
                              this.props.addOrEditInitValues.name.split('~')[1] - 0 :
                              0
                          }
                          onChange={
                            (v) => this.setState({ num2: v })
                          }
                        />
                      </Col>
                    </Row>
                  </FormItem>
                </div>
                : null
            }

          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfTagDimensionAddOrEdit = Form.create()(SelfTagDimensionAddOrEdit)
export default WrapperSelfTagDimensionAddOrEdit
