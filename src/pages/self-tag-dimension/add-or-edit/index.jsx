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
    this.state = {
      num1: this.props.addOrEditInitValues.name ? this.props.addOrEditInitValues.name.split('~')[0] - 0 :
        0,
      num2: this.props.addOrEditInitValues.name
        ?
        this.props.addOrEditInitValues.name.split('~')[1] - 0 :
        0,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const title = this.props.addOrEditTitle
        if ((this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签') && this.props.addOrEditInitValues.valueType === 3) {
          let num1
          let num2
          this.setState({}, () => {
            num1 = this.state.num1 - 0
            num2 = this.state.num2 - 0
            console.log(num1, num2)
            if (!num1 && num1 !== 0) {
              message.error('请输入数值')
              return
            }
            if (!num2 && num2 !== 0) {
              message.error('请输入数值')
              return
            }
            if (num1 >= num2) {
              message.error('后一个数值应该大于前一个数字')
              return
            }
            if (typeof num1 !== 'number' || typeof num2 !== 'number') {
              message.error('前后数值都应该是数字')
              return
            }
            values.name = `${num1}~${num2}`
            if (values.name && values.name.length > 10) {
              message.error('数值范围型标签，名称的拼接长度，应小于10个字符')
              return
            }
            this.props.addOrEditOk(values, title)
          })
        }
        else if ((this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签') && this.props.addOrEditInitValues.valueType === 2) {
          if (typeof values.name !== 'number') {
            message.error('请输入数字')
          } else {
            if (values.name && (values.name + '').length > 10) {
              message.error('标签名称长度应小于10个字符')
              return
            }
            console.log('提交', values)
            this.props.addOrEditOk(values, title)
          }
        }
        else {
          if (values.name && values.name.length > 10) {
            message.error('标签名称长度应小于10个字符')
            return
          }
          console.log('提交', values)
          this.props.addOrEditOk(values, title)
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7, offset: 1 },
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


    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        confirmLoading={this.props.editOrEditConfirmLoading}
        width={800}
        destroyOnClose={true}
        zIndex={10000}
        className="self-tag-dimension-modal"
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            {
              (this.props.addOrEditTitle === '添加标签' || this.props.addOrEditTitle === '编辑标签') && this.props.addOrEditInitValues.valueType !== 3 ?
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
                    {
                      getFieldDecorator('name', {
                        initialValue: this.props.addOrEditInitValues.name,
                        rules: [
                          {
                            required: true, message: '请输入标签名称',
                          }
                        ]
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
                </div>
                : null
            }
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
                      },
                      {
                        max: 10, message: '维度名称长度需小于10个字符',
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
                    <RadioGroup
                      disabled={this.props.addOrEditTitle === '编辑维度'}
                    >
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
                    <RadioGroup
                      disabled={this.props.addOrEditTitle === '编辑维度'}
                    >
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
