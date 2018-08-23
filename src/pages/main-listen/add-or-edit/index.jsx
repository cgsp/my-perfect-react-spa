import React, { Component } from 'react'
import { Modal, Form, Input, Upload, Icon, message, Select } from 'antd'
import { UP_IMG_ACTION } from '@Constants'
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
class MainListenAddOrEdit extends Component {
  static propTypes = {
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
      fileList: [],
      imgObj: {}
    }
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.addOrEditOk(values)
      }
    })
  }

  onImgRemove = () => {
    message.error('请至少选择一张图片上传')
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

  handleImgChange = ({ file, fileList, event }) => {
    // console.log(file)
    // console.log(fileList)
    // console.log(event)
    this.setState({ fileList })
  }
  bigTypeChange(value) {
    this.props.getCommonSmallTypes(value)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { previewVisible, previewImage, fileList } = this.state
    if (this.props.addOrEditInitValues.pic && !this.timer) {
      this.timer = setTimeout(() => {
        this.setState({
          fileList: [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: this.props.addOrEditInitValues.pic,
          }]
        }, () => {
          fileList = this.state.fileList
        })
      }, 0)
    }

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
        title="另存为自运营听单"
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={() => this.handleSubmit()}
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
              {getFieldDecorator('listenName', {
                initialValue: this.props.addOrEditInitValues.listenName,
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
              {getFieldDecorator('imgObj', {
                initialValue: this.state.imgObj,
                rules: [
                  {
                    required: true, message: '请选择图片',
                  }
                ],
              })(
                <div>
                  <Upload
                    action={action}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handleImgPreview}
                    onChange={this.handleImgChange}
                    onRemove={this.onImgRemove}
                    withCredentials={true}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类来源"
            >
              {getFieldDecorator('bigType', {
                initialValue: '主站分类',
                rules: [
                  {
                    required: true, message: '请选择分类来源',
                  }
                ],
              })(
                <Select allowClear onChange={(v) => this.bigTypeChange(v)}>
                  <Option value="主站分类">主站分类</Option>
                  <Option value="自运营分类">自运营分类</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类"
            >
              {getFieldDecorator('smallType', {
                initialValue: '咨询',
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
              {getFieldDecorator('type', {
                initialValue: this.props.addOrEditInitValues.type,
                rules: [
                  {
                    required: true, message: '请选择听单类型',
                  }
                ],
              })(
                <Select allowClear disabled>
                  <Option value="专辑">专辑</Option>
                  <Option value="声音">声音</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择内容"
            >
              {getFieldDecorator('voiceIds', {
                initialValue: this.props.addOrEditInitValues.voiceIds ? this.props.addOrEditInitValues.voiceIds.split(',').join('\n') : '',
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

const WrapperMainListenAddOrEdit = Form.create()(MainListenAddOrEdit)
export default WrapperMainListenAddOrEdit
