import React, { Component } from 'react'
import { Modal, Form, Input, Upload, Icon, message, Select } from 'antd'
import { UP_IMG_ACTION, ERR_OK } from '@Constants'
import { myHuanHang } from '@Utils/myHuanHang'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getCommonSmallTypes } from '@Redux/commonSmallType'

const Option = Select.Option
const { TextArea } = Input
const FormItem = Form.Item
const DEV = process.env.NODE_ENV !== 'production'
let action
if (DEV) {
  action = UP_IMG_ACTION.dev
} else {
  action = UP_IMG_ACTION.pro
}

@connect(
  state => state.commonSmallTypesReducer,
  { getCommonSmallTypes }
)
class SelfListenAddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
    getCommonSmallTypes: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: this.props.addOrEditInitValues.coverUrlSmall ? [{
        uid: '-1',
        name: '封面图.png',
        status: 'done',
        url: this.props.addOrEditInitValues.coverUrlSmall,
      }] : []
    }
    this.coverUrlLarge = this.props.addOrEditInitValues.coverUrlLarge
    this.coverUrlMiddle = this.props.addOrEditInitValues.coverUrlMiddle
    this.coverUrlSmall = this.props.addOrEditInitValues.coverUrlSmall
    this.isJPG = true
    this.isLt3M = true
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 对id进行处理
        values.contentIds = myHuanHang(values.contentIds)

        values.coverUrlSmall = this.coverUrlSmall
        values.coverUrlMiddle = this.coverUrlMiddle
        values.coverUrlLarge = this.coverUrlLarge
        if (!values.coverUrlSmall && !values.coverUrlMiddle && !values.coverUrlLarge) {
          message.error('请上传图片')
          return
        }
        if (!values.coverUrlSmall || !values.coverUrlMiddle || !values.coverUrlLarge) {
          message.error('图片信息不全，请删除后重新上传')
          return
        }

        this.props.addOrEditOk(values, this.props.addOrEditTitle)
      }
    })
  }

  onImgRemove = () => {
    this.setState({ fileList: [], previewVisible: false })
    message.error('请至少选择一张图片上传')
    this.coverUrlLarge = ''
    this.coverUrlMiddle = ''
    this.coverUrlSmall = ''
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
      message.error('图片大小应小于3M')
      this.isJPG = false
    }
    return isJPG && isLt3M
  }

  handleImgChange = ({ file, fileList, event }) => {
    if (this.isJPG && this.isLt3M) {
      this.setState({ fileList })
    }
    if (file.response) {
      if (file.response.code !== ERR_OK) {
        message.error('上传到服务器失败，请重新上传')
        this.coverUrlLarge = ''
        this.coverUrlMiddle = ''
        this.coverUrlSmall = ''
        this.setState({ fileList: [] })
        return
      }
      this.coverUrlLarge = file.response.data.coverUrlLarge
      this.coverUrlMiddle = file.response.data.coverUrlMiddle
      this.coverUrlSmall = file.response.data.coverUrlSmall
    }
  }
  sourceChange(value) {
    this.props.getCommonSmallTypes(value)
    this.props.form.setFieldsValue({
      categoryId: ''
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
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        confirmLoading={this.props.editOrEditConfirmLoading}
        width={800}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="听单名称"
            >
              {getFieldDecorator('title', {
                initialValue: this.props.addOrEditInitValues.title,
                rules: [
                  {
                    required: true, message: '请输入听单名称',
                  }
                ],
              })(
                <Input placeholder="请输入听单名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="封面图"
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
                initialValue: this.props.addOrEditInitValues.source ? this.props.addOrEditInitValues.source + '' : '1',
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
                    this.props.commonSmallTypes.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }

                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="听单类型"
            >
              {getFieldDecorator('contentType', {
                initialValue: this.props.addOrEditInitValues.contentType ? this.props.addOrEditInitValues.contentType + '' : '1',
                rules: [
                  {
                    required: true, message: '请选择听单类型',
                  }
                ],
              })(
                <Select allowClear disabled={this.props.addOrEditTitle === '编辑听单'}>
                  <Option value="1">专辑</Option>
                  <Option value="2">声音</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择内容"
            >
              {getFieldDecorator('contentIds', {
                initialValue: this.props.addOrEditInitValues.contentIds ? this.props.addOrEditInitValues.contentIds.split(',').join('\n') : '',
                rules: [
                  {
                    required: true, message: '请输入选择内容',
                  }
                ],
              })(
                <TextArea style={{ height: 100, maxHeight: 100 }} placeholder="请输入选择内容" />
              )}
            </FormItem>

          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfListenAddOrEdit = Form.create()(SelfListenAddOrEdit)
export default WrapperSelfListenAddOrEdit
