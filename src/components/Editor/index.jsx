import React, { Component } from 'react'
import { message } from 'antd'
import { getUploadUrl } from '../../utils/index'
import { inject } from 'mobx-react'
import E from 'wangeditor'
import './style.scss'

@inject('index')
export default class Editor extends Component {
  componentDidMount() {
    // 初始化编辑器
    this.init()
    // 初始化编辑器内容
    this.editor.txt.html(this.props.setFieldsValue)
  }
  init = () => {
    this.editor = new E('#editorToolbar', '#editorTextArea')
    // 图片上传的事件处理函数
    this.editor.customConfig.customUploadImg = async function(files, insert) {
      try {
        message.info('正在上传图片')
        const url = await getUploadUrl(files)
        insert(url)
        message.destroy()
      } catch (err) {
        message.destroy()
        console.error(err)
        message.error('图片上传失败')
      }
    }
    this.bindEditorEvent()
    this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'image',  // 插入图片
        'table',  // 表格
        'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
    this.editor.customConfig.fontNames = [
          'Xingkai SC',
          'PingFang SC',
          'STHeiti',
          'STXinwei',
          'Yuanti SC',
          'Yapi SC',
          'Hannotate SC',
    ]
    this.editor.customConfig.zIndex = 1
    this.editor.create()
  }

  bindEditorEvent = () => {
    this.editor.customConfig.onblur = this.handleBlur
    this.editor.customConfig.onchange = this.handleChange
  }
  handleChange = html => {
    typeof this.props.onChange === 'function' && this.props.onChange(html)
  }
  handleBlur = html => {
    console.log('blur')
  }
  render() {
    //  console.log('editor', this.props)
    return (
      <div className="admin-editor-container">
        <div className="toolbar" id="editorToolbar" />
        <div className="textarea" id="editorTextArea" />
      </div>
    )
  }
}
