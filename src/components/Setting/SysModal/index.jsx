/* eslint-disable */
import React from 'react'
import {
  Form,
  Input,
  Select,
  Row
} from 'antd'
import { inject, observer } from 'mobx-react'
import './style.scss'
const { Item } = Form
const { Option } = Select

class SysModal extends React.Component {

  changeSelect = () => {
    console.log('随意切换')
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { mark } = this.props
    if (mark == 'addFirst') {
      return (
        <Form>
          <Item label="菜单名称" {...formLayout}>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请填写菜单名称',
                },
              ],
            })(<Input autoComplete="off" />)}
          </Item>
          <Item label="类型" {...formLayoutSystem}>
            <span>一级菜单</span>
          </Item>
          <Item label="URL路径" {...formLayout}>
            {getFieldDecorator('routePath', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请填写URL路径',
                },
              ],
            })(<Input autoComplete="off" />)}
          </Item>
        </Form>
      )
    } else if (mark == 'addChildNode') {
      const { addInitData } = this.props
      return (
        <Form>
          <Item label="父节点名称" {...formLayoutSystem}>
            <span>{addInitData.name}</span>
          </Item>
          <Item label="子节点名称" {...formLayout}>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请添加子节点名称'
                },
              ],
            })(<Input autoComplete="off" />)}
          </Item>
          <Item label="类型" {...formLayout}>
            {getFieldDecorator('type', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select placeholder="请选择类型" onChange={this.changeSelect}>
              <Option value={0}> 菜单 </Option>
              <Option value={1}> 功能操作 </Option>
            </Select>)}
          </Item>
          <Item label="URL路径" {...formLayout}>
            {getFieldDecorator('routePaths', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请填写URL路径',
                },
              ],
            })(<Input autoComplete="off" />)}
          </Item>
          <Item label="权限字符串" {...formLayout}>
            {getFieldDecorator('routePath', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请填写权限字符串',
                },
              ],
            })(<Input autoComplete="off" />)}
          </Item>
        </Form>
      )
    }


  }
}

export default SysModal
/* eslint-enable */
