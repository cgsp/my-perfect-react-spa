import React, { Component } from 'react'
import './style.scss'
import { Upload, Icon, Tooltip, message } from 'antd'
import { getUploadUrl, getUuid } from '../../utils'

function getFileList(url) {
  if (!url) return []
  return [
    {
      uid: getUuid(),
      url,
      status: 'done'
    }
  ]
}

export default class IconUrlUploader extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.isSaveIconUploader) {
      const value = state.fileList.map(({ url }) => url)[0]
      props.onChange(value)
      props.onSaveIconUploader()
      return {
        isInitFromProps: true
      }
    } else if (props.isCancleSaveIconUploader) {
      const value = state.valueFromProps
      props.onChange(value)
      props.onCancleSaveIconUploader()
      return {
        isInitFromProps: true
      }
    }

    if (!state.isInitFromProps) return null

    if (props.value === null) {
      // value 为空默认值为空''
      return {
        ...state,
        valueFromProps: props.value,
        fileList: []
      }
    } else {
      return {
        ...state,
        valueFromProps: props.value,
        fileList: [
          {
            url: props.value,
            uid: getUuid(),
            status: 'done'
          }
        ]
      }
    }
  }
  state = {
    isInitFromProps: true,
    loading: false,
    fileList: [],
    valueFromProps: ''
  }
  get uploadButton() {
    return (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
      </div>
    )
  }

  handleBeforeUpload = async file => {
    if (file.size / 1024 / 1024 > 2) {
      message.error('应用截图需上传小于2M图片')
      // eslint-disable-next-line
      throw '应用截图需上传小于2M图片'
    }
    const url = await getUploadUrl(file)
    this.setState({
      isInitFromProps: false,
      fileList: getFileList(url)
    })
    // eslint-disable-next-line
    throw '应用图标上传成功'
  }
  render() {
    const { uploadButton, handleBeforeUpload } = this
    const { isFormEdit } = this.props
    const iconUrl = this.state.fileList[0] && this.state.fileList[0].url
    return (
      <Tooltip title={isFormEdit && iconUrl ? '点击再次上传应用图标' : null}>
        <div className="icon-uploader-container">
          {isFormEdit ? (
            <Upload
              style={{ width: '100%', height: '100%' }}
              className={`icon-uploader ${iconUrl ? '' : 'none-icon'}`}
              beforeUpload={handleBeforeUpload}
              accept="image/jpg,image/jpeg,image/bmp,image/png"
              fileList={this.state.fileList}
              showUploadList={false}
            >
              {iconUrl ? <img src={iconUrl} alt="icon" /> : uploadButton}
            </Upload>
          ) : (
            <div>
              {iconUrl ? (
                <div className="icon-uploader-image">
                  <img src={iconUrl} alt="icon" />
                </div>
              ) : (
                '未上传'
              )}
            </div>
          )}
        </div>
      </Tooltip>
    )
  }
}
