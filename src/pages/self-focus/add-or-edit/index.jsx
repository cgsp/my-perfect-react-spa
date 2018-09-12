import React, { Component } from 'react'
import { Modal, Form, Input, Upload, Icon, message, Select } from 'antd'
import { UP_FOCUS_IMG_ACTION, ERR_OK } from '@Constants'
import { myTrim } from '@Utils/myTrim'
import { PropTypes } from 'prop-types'
import { commonSmallTypes } from '@Api'

const Option = Select.Option
const FormItem = Form.Item
const DEV = process.env.NODE_ENV !== 'production'
let action
if (DEV) {
  action = UP_FOCUS_IMG_ACTION.dev
} else {
  action = UP_FOCUS_IMG_ACTION.pro
}

class SelfFocusAddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
    addOrEdidSmallTypes: PropTypes.array
  }

  constructor(props) {
    super(props)
    const contentType = this.props.addOrEditInitValues.contentType
    const addOrEdidSmallTypes = this.props.addOrEdidSmallTypes
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: this.props.addOrEditInitValues.bannerUrl ? [{
        uid: '-1',
        name: '封面图.png',
        status: 'done',
        url: this.props.addOrEditInitValues.bannerUrl,
      }] : [],
      smallTypes: addOrEdidSmallTypes,
      contentType
    }
    this.bannerUrl = this.props.addOrEditInitValues.bannerUrl
    this.isJPG = true
    this.isLt3M = true
  }

  getSmallTypes = async (source) => {
    try {
      const smallTypeRes = await commonSmallTypes(source)
      if (smallTypeRes.code !== ERR_OK) {
        message.error(smallTypeRes.msg)
        return
      }
      this.setState({
        smallTypes: smallTypeRes.data
      })
      this.props.form.setFieldsValue({
        categoryId: undefined
      })
    } catch (error) {
      console.log(error)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.bannerUrl = this.bannerUrl
        if (!values.bannerUrl) {
          message.error('请上传图片')
          return
        }

        if (values.contentId) {
          values.contentId = values.contentId - 0
        }

        if (values.redirectUrl) {
          values.redirectUrl = myTrim(values.redirectUrl)
        }

        if (values.title) {
          values.title = myTrim(values.title)
        }

        if (values.thirdPartyUrl) {
          values.thirdPartyUrl = myTrim(values.thirdPartyUrl)
        }

        // console.log(values)

        this.props.addOrEditOk(values, this.props.addOrEditTitle)
      }
    })
  }

  onImgRemove = () => {
    this.setState({ fileList: [], previewVisible: false })
    message.error('请上传图片')
    this.bannerUrl = ''
    return true
  }

  handleImgCancel = () => {
    console.log('删除')
    this.setState({ previewVisible: false })
  }

  handleImgPreview = (file) => {
    console.log('初始化')
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  beforeUpload = (file) => {
    this.isJPG = true
    this.isLt3M = true
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/bmp')
    if (!isJPG) {
      message.error('只能上传jpeg,jpg,gif,png,bmp图 ')
      this.isJPG = false
    }
    const isLt3M = file.size / 1024 / 1024 < 5
    if (!isLt3M) {
      message.error('图片大小应小于5M')
      this.isJPG = false
    }
    return isJPG && isLt3M
  }

  handleImgChange = ({ file, fileList, event }) => {
    // console.log(file.response)
    // console.log(fileList)
    // console.log(event)
    if (this.isJPG && this.isLt3M) {
      this.setState({ fileList })
    }
    if (file.response) {
      if (file.response.code !== ERR_OK) {
        message.error('上传到服务器失败，请重新上传')
        this.bannerUrl = ''
        this.setState({ fileList: [] })
        return
      }
      this.bannerUrl = file.response.data
    }
  }
  sourceChange(value) {
    if (!value) {
      this.props.form.setFieldsValue({
        categoryId: undefined,
      })
      this.setState({
        smallTypes: []
      })
      return
    }
    this.getSmallTypes(value)
  }

  contentTypeChange(value) {
    if (!value) {
      this.setState({
        contentType: null
      })
      return
    }
    this.setState({
      contentType: value
    })

  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    )

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

    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        width={800}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="焦点图名称"
            >
              {getFieldDecorator('title', {
                initialValue: this.props.addOrEditInitValues.title,
                rules: [
                  {
                    required: true, message: '请输入焦点图名称',
                  },
                  {
                    max: 30, message: '名称须小于30个字符',
                  }
                ],
              })(
                <Input placeholder="请输入焦点图名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="焦点图"
            >
              <div>
                <Upload
                  action={action}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handleImgPreview}
                  onChange={this.handleImgChange}
                  onRemove={this.onImgRemove}
                  withCredentials={true}
                  beforeUpload={this.beforeUpload}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类来源"
            >
              {getFieldDecorator('source', {
                initialValue:
                  this.props.addOrEditInitValues.categorySource ? this.props.addOrEditInitValues.categorySource : 2,
                rules: [
                  {
                    required: true, message: '请选择分类来源',
                  }
                ],
              })(
                <Select allowClear onChange={(v) => this.sourceChange(v)}>
                  <Option value={1}>主站分类</Option>
                  <Option value={2}>自运营分类</Option>
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
              label="跳转类型"
            >
              {getFieldDecorator('contentType', {
                initialValue: this.props.addOrEditInitValues.contentType,
                rules: [
                  {
                    required: true, message: '请选择跳转类型'
                  }
                ],
              })(
                <Select allowClear onChange={(v) => this.contentTypeChange(v)}>
                  <Option value={1}>单个用户</Option>
                  <Option value={2}>单个专辑</Option>
                  <Option value={3}>单个声音</Option>
                  <Option value={4}>链接</Option>
                  <Option value={9}>听单</Option>
                </Select>
              )}
            </FormItem>
            {
              this.state.contentType === 1 ?
                <FormItem
                  {...formItemLayout}
                  label="用户ID"
                >
                  {getFieldDecorator('contentId', {
                    initialValue: this.props.addOrEditInitValues.contentId,
                    rules: [
                      {
                        required: true, message: '请输入用户ID',
                      }
                    ],
                  })(
                    <Input type="number" placeholder="请输入用户ID" />
                  )}
                </FormItem> : null
            }
            {
              this.state.contentType === 2 ?
                <FormItem
                  {...formItemLayout}
                  label="专辑ID"
                >
                  {getFieldDecorator('contentId', {
                    initialValue: this.props.addOrEditInitValues.contentId,
                    rules: [
                      {
                        required: true, message: '请输入专辑ID',
                      }
                    ],
                  })(
                    <Input type="number" placeholder="请输入专辑ID" />
                  )}
                </FormItem> : null
            }
            {
              this.state.contentType === 3 ?
                <FormItem
                  {...formItemLayout}
                  label="声音ID"
                >
                  {getFieldDecorator('contentId', {
                    initialValue: this.props.addOrEditInitValues.contentId,
                    rules: [
                      {
                        required: true, message: '请输入声音ID',
                      }
                    ],
                  })(
                    <Input type="number" placeholder="请输入声音ID" />
                  )}
                </FormItem> : null
            }
            {
              this.state.contentType === 9 ?
                <FormItem
                  {...formItemLayout}
                  label="听单ID"
                >
                  {getFieldDecorator('contentId', {
                    initialValue: this.props.addOrEditInitValues.contentId,
                    rules: [
                      {
                        required: true, message: '请输入听单ID',
                      }
                    ],
                  })(
                    <Input type="number" placeholder="请输入听单ID" />
                  )}
                </FormItem> : null
            }
            {
              this.state.contentType === 4 ?
                <FormItem
                  {...formItemLayout}
                  label="链接URl"
                >
                  {getFieldDecorator('redirectUrl', {
                    initialValue: this.props.addOrEditInitValues.redirectUrl,
                    rules: [
                      {
                        required: true, message: '请输入链接URl',
                      }
                    ],
                  })(
                    <Input placeholder="请输入链接URl" />
                  )}
                </FormItem> : null
            }
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfFocusAddOrEdit = Form.create()(SelfFocusAddOrEdit)
export default WrapperSelfFocusAddOrEdit
