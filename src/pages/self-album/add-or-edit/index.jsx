import React, { Component } from 'react'
import { Modal, Form, Input, Radio, InputNumber, Row, Col, message, Select, Button, Tag } from 'antd'
import { PropTypes } from 'prop-types'
import WrapperSelfAddTag from '../add-tag'
import MaskLoading from '@Components/mask-loading'
import { connect } from 'react-redux'
import { getCommonDimesionsAndTags } from '@Redux/commonTagAndDimesion'
import { apiSelfAddDimension } from '@Api/self-tag-tag'
import { ERR_OK } from '@Constants'
import { commonSmallTypes } from '@Api'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesionsAndTags }
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
      addTagVisible: false,
      smallTypes: [],
      chosedTags: [
        { name: '标签1', id: '111' },
        { name: '标签2222222222222222222222222222222222222', id: '222' },
        { name: '标签3', id: '333' },
        { name: '标签4', id: '444' },
        { name: '标签5', id: '555' },
        { name: '标签6', id: '666' },
        { name: '标签7777777777777777', id: '777' },
        { name: '标签8', id: '888' }
      ]
    }
    this.addTagCancel = this.addTagCancel.bind(this)
    this.addTagOk = this.addTagOk.bind(this)
  }

  componentDidMount() {
    this.getSmallTypes('1')
  }

  getSmallTypes = async (source) => {
    try {
      if (!source) {
        this.setState({
          smallTypes: []
        })
        this.props.form.setFieldsValue({
          categoryId: undefined
        })
      }
      const smallTypeRes = await commonSmallTypes(source)
      if (smallTypeRes.code !== ERR_OK) {
        message.error(smallTypeRes.msg)
        return
      }
      this.setState({
        smallTypes: smallTypeRes.data
      })
    } catch (error) {
      console.log(error)
    }
  }

  sourceChange = (source) => {
    this.getSmallTypes(source)
    this.props.form.setFieldsValue({
      categoryId: undefined
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      console.log(values)
    })
  }

  // 点击确定添加按钮
  add = () => {
    const sourceId = this.props.form.getFieldValue('sourceId')
    if (!sourceId) {
      message.error('请输入主站专辑Id')
      return
    }
    console.log(sourceId)
  }

  addTagCancel() {
    this.setState({
      addTagVisible: false
    })
  }

  addTagOk(values) {
    this.addTagCancel()
  }

  deleteTag = (id) => {
    console.log(id)
  }

  addTagBegin = () => {
    this.refs.mask.show()
    this.props.getCommonDimesionsAndTags(() => {
      this.setState({
        addTagVisible: true
      })
      this.refs.mask.hide()
    })
  }

  addTagOk = () => {
    this.setState({
      addTagVisible: false
    })
  }
  addTagCancel = () => {
    this.setState({
      addTagVisible: false
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    const addTagOptions = {
      addTagVisible: this.state.addTagVisible,
      addTagOk: this.addTagOk,
      addTagCancel: this.addTagCancel
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
        destroyOnClose={true}
        width={600}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="主站专辑ID"
            >
              {
                getFieldDecorator('sourceId', {
                  initialValue: this.props.addOrEditInitValues.sourceId,
                  rules: [
                    {
                      required: true,
                      message: '请输入数字型主站专辑ID',
                    }
                  ]
                })(
                  <div>
                    <Input
                      type="number"
                      placeholder="请输入主站专辑ID"
                      style={{ width: 350 }}
                      onPressEnter={e => e.preventDefault()}
                    />
                    <Button onClick={this.add} type="primary" style={{ marginLeft: 20 }}>确定添加</Button>
                  </div>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="专辑标题"
            >
              {
                getFieldDecorator('title', {
                  initialValue: this.props.addOrEditInitValues.title,
                  rules: [
                    {
                      required: true,
                      message: '请输入专辑标题',
                    }
                  ]
                })(
                  <div>
                    <Input
                      placeholder="请输入专辑标题"
                      onPressEnter={e => e.preventDefault()}
                    />
                  </div>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类来源"
            >
              {getFieldDecorator('categorySource', {
                initialValue: this.props.addOrEditInitValues.categorySource ? this.props.addOrEditInitValues.categorySource + '' : '1',
                rules: [
                  {
                    required: true, message: '请选择分类来源',
                  }
                ],
              })(
                <Select allowClear onChange={(v) => this.sourceChange(v)}>
                  <Option value="1">主站分类</Option>
                  <Option value="2">自运营分类</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类"
            >
              {getFieldDecorator('categoryId', {
                initialValue: this.props.addOrEditInitValues.categoryId,
                rules: [
                  {
                    required: true, message: '请选择分类',
                  }
                ],
              })(
                <Select allowClear>
                  {
                    this.state.smallTypes.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }

                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="自运营标签"
            >
              <div>
                {
                  this.state.chosedTags.map((item) => {
                    return (
                      <Tag key={item.id} color="#f50"
                        closable
                        onClose={() => this.deleteTag(item.id)}
                      >{item.name}</Tag>
                    )
                  })
                }
                <div>
                  <Button type="primary" onClick={this.addTagBegin}>添加标签</Button>
                </div>
              </div>
            </FormItem>
          </Form>
          {
            this.state.addTagVisible
              ?
              <WrapperSelfAddTag {...addTagOptions} />
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
