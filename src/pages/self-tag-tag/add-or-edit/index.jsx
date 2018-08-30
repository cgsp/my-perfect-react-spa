import React, { Component } from 'react'
import { Modal, Form, Input, Radio, InputNumber, Row, Col, message, Select, Button } from 'antd'
import { PropTypes } from 'prop-types'
import WrapperSelfAddDimension from '../add-dimension'
import MaskLoading from '@Components/mask-loading'
import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'
import { apiSelfAddDimension } from '@Api/self-tag-tag'
import { ERR_OK } from '@Constants'

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
    let { valueType, name } = this.props.addOrEditInitValues
    valueType = valueType ? valueType : 1

    let num1
    let num2
    if (!name) {
      console.log(111)
      if (valueType === 1) {
        name = ''
      } else if (valueType === 2) {
        name = 0
      } else if (valueType === 3) {
        name = '0~0'
      }
      num1 = 0
      num2 = 0
    }
    else {
      num1 = name.split('~')[0] - 0
      num2 = name.split('~')[1] - 0
    }
    this.state = {
      valueType,
      name,
      num1,
      num2,
      addDimesinonVisible: false
    }
    this.addDimesinonCancel = this.addDimesinonCancel.bind(this)
    this.addDimesinonOk = this.addDimesinonOk.bind(this)
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const title = this.props.addOrEditTitle
        if (title === '编辑标签') {
          values.id = this.props.addOrEditInitValues.id
        }
        this.setState({
        }, () => {
          if (this.state.valueType === 3) {
            let num1
            let num2
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
              message.error('后一个数值应该大于前一个数值')
              return
            }
            if (typeof num1 !== 'number' || typeof num2 !== 'number') {
              message.error('前后数值都应该是数字')
              return
            }
            values.name = `${num1}~${num2}`
            console.log('提交', values)
            this.props.addOrEditOk(values, title)
          } else {
            console.log('提交', values)
            this.props.addOrEditOk(values, title)
          }
        })
      }
    })
  }

  findNewValueType(v) {
    if (!v) {
      this.setState({
        valueType: 1,
        name: ''
      })
      return
    }
    const newValueType = this.props.commonDimesions.find((item) => {
      return v === item.id
    }).valueType

    let name
    if (newValueType === 1) {
      name = ''
    } else if (newValueType === 2) {
      name = 0
    } else {
      name = '0~0'
    }
    this.setState({
      valueType: newValueType,
      name
    })
  }

  addDimesinonCancel() {
    this.setState({
      addDimesinonVisible: false
    })
  }

  addDimesinonOk(values) {
    console.log(values)
    this.addDimesinonCancel()
    this.refs.mask.show()
    apiSelfAddDimension(values)
      .then(res => {
        this.refs.mask.hide()
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        this.props.getCommonDimesions(() => {
          message.success('新增维度成功')
        })
      })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    }

    const addDimensionOptions = {
      addDimesinonVisible: this.state.addDimesinonVisible,
      addDimesinonOk: this.addDimesinonOk,
      addDimesinonCancel: this.addDimesinonCancel
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
        onOk={() => this.handleSubmit()}
        destroyOnClose={true}
        width={600}
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
                    style={{ width: '100%' }}
                    placeholder="请选择维度"
                    allowClear
                    onChange={(v) => this.findNewValueType(v)}
                    disabled={this.props.addOrEditTitle === '编辑标签'}
                  >
                    {
                      this.props.commonDimesions.map((item) => (
                        <Option key={item.id} value={item.id}>{item.dimensionName}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
            {
              this.props.addOrEditTitle === '编辑标签'
                ?
                null
                :
                <FormItem
                  {...formItemLayout}
                  label="添加维度"
                >
                  <Button type="primary" onClick={() => this.setState({ addDimesinonVisible: true })}>添加维度</Button>
                </FormItem>
            }
            <FormItem
              {...formItemLayout}
              label="维度的标签类型"
            >
              <RadioGroup
                disabled
                value={this.state.valueType}
              >
                <Radio value={1}>文本</Radio>
                <Radio value={2}>数值</Radio>
                <Radio value={3}>数值范围</Radio>
              </RadioGroup>
            </FormItem>
            {
              this.state.valueType === 3 ?
                null :
                <FormItem
                  {...formItemLayout}
                  label="标签名称"
                >
                  {
                    getFieldDecorator('name', {
                      initialValue: this.state.name,
                      rules: [
                        {
                          required: true, message: '请输入标签名称',
                        }
                      ],
                    })(
                      this.state.valueType === 1
                        ?
                        <Input style={{ width: '100%' }} placeholder="请输入标签名称" />
                        :
                        <InputNumber
                          placeholder="请输入数字"
                          style={{ width: '100%' }}
                        />
                    )
                  }
                </FormItem>
            }
            {
              this.state.valueType !== 3 ?
                null :
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
                          this.state.name.split('~')[0] - 0
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
                          this.state.name.split('~')[1] - 0
                        }
                        onChange={
                          (v) => this.setState({ num2: v })
                        }
                      />
                    </Col>
                  </Row>
                </FormItem>
            }
          </Form>
          {
            this.state.addDimesinonVisible
              ?
              <WrapperSelfAddDimension {...addDimensionOptions} />
              : null
          }
          <MaskLoading ref="mask" />

        </div>
      </Modal >
    )
  }
}

const WrapperSelfTagDimensionAddOrEdit = Form.create()(SelfTagDimensionAddOrEdit)
export default WrapperSelfTagDimensionAddOrEdit
