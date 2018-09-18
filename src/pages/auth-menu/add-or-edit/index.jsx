import React, { Component } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option

class AuthAccountAddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    handleType: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      thirdOrButton: '三级菜单'
    }
    this.addThirdOrButton = this.addThirdOrButton.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      let level
      let type
      switch (this.props.addOrEditTitle) {
        case '新增一级菜单':
          level = '1'
          type = '菜单'
          break
        case '编辑一级菜单':
          level = '1'
          type = '菜单'
          break
        case '二级菜单':
          level = '2'
          type = '菜单'
          break
        case '三级菜单':
          level = '3'
          type = '菜单'
          break
        case '按钮':
          level = null
          type = '按钮'
          break
        default:
          break
      }

      if (this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '新增') {
        if (values.thirdOrButton === '三级菜单') {
          level = '3'
          type = '菜单'
        } else if (values.thirdOrButton === '按钮') {
          level = null
          type = '按钮'
        } else {

        }
      }

      const ajaxType = this.props.handleType === '新增' ? '新增' : '编辑'
      values = { ...values, ...{ level, type, ajaxType } }
      if (!values.code) {
        values.code = null
      }
      if (!values.path) {
        values.path = null
      }
      if (!values.icon) {
        values.icon = null
      }
      this.props.addOrEditOk(values, this.props.handleType)

      // console.log(values)
    })
  }

  addThirdOrButton(v) {
    console.log(v)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let formItemLayout
    if (this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '新增') {
      formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
      }
    } else {
      formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      }
    }
    let modalTitle
    let nodeTitle

    if (this.props.addOrEditTitle === '新增一级菜单') {
      modalTitle = this.props.addOrEditTitle
      nodeTitle = '一级菜单名称'
    } else if (this.props.addOrEditTitle === '编辑一级菜单') {
      modalTitle = this.props.addOrEditTitle
      nodeTitle = '一级菜单名称'
    } else if (this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '新增') {
      modalTitle = '新增三级菜单或按钮'
      nodeTitle = '三级菜单或按钮'
    } else {
      modalTitle = `${this.props.handleType}${this.props.addOrEditTitle}`
      nodeTitle = `${this.props.addOrEditTitle}名称`
    }
    return (
      <Modal
        title={modalTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={700}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          {
            this.props.addOrEditTitle === '新增一级菜单' || this.props.addOrEditTitle === '编辑一级菜单' ? null : (
              < FormItem
                {...formItemLayout}
                label="父节点名称"
              >
                <Input value={
                  this.props.handleType === '新增' ? this.props.addOrEditInitValues.name : this.props.addOrEditInitValues.parentName
                } disabled />
              </FormItem>
            )
          }
          <FormItem
            {...formItemLayout}
            label={nodeTitle}
          >
            {getFieldDecorator('name', {
              initialValue: this.props.handleType === '新增' ? '' : this.props.addOrEditInitValues.name,
              rules: [
                {
                  required: true, message: '请输入名称',
                },
                {
                  max: 10, message: '长度须小于10个字符',
                }
              ],
            })(
              <Input placeholder="请输入名称" />
            )}
          </FormItem>
          {
            this.props.addOrEditTitle === '新增一级菜单' || this.props.addOrEditTitle === '编辑一级菜单' ? (
              <FormItem
                {...formItemLayout}
                label="一级菜单图标"
              >
                {getFieldDecorator('icon', {
                  initialValue: this.props.addOrEditInitValues.icon,
                  rules: [
                    {
                      required: true, message: '请输入一级菜单图标',
                    }
                  ],
                })(
                  <Input placeholder="请输入一级菜单图标" />
                )}
              </FormItem>
            ) : null
          }
          {
            this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '新增'
              ? null :
              <FormItem
                {...formItemLayout}
                label="节点类型"
              >
                <Select
                  style={{ width: '100% ' }}
                  disabled
                  value={(() => {
                    let type
                    switch (this.props.addOrEditTitle) {
                      case '新增一级菜单':
                        type = '一级菜单'
                        break
                      case '编辑一级菜单':
                        type = '一级菜单'
                        break
                      case '二级菜单':
                        type = '二级菜单'
                        break
                      case '三级菜单':
                        type = '三级菜单'
                        break
                      case '按钮':
                        type = '按钮'
                        break
                      default:
                        break
                    }
                    return type
                  })()}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Option value="一级菜单">一级菜单</Option>
                  <Option value="二级菜单">二级菜单</Option>
                  <Option value="三级菜单">三级菜单</Option>
                  <Option value="按钮">按钮</Option>
                </Select>
              </FormItem>
          }
          {
            this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '新增' ?
              <FormItem
                {...formItemLayout}
                label="节点类型"
              >
                {getFieldDecorator('thirdOrButton', {
                  initialValue: this.state.thirdOrButton,
                  rules: [
                    {
                      required: true, message: '请选择节点类型',
                    }
                  ],
                })(
                  <Select
                    style={{ width: '100% ' }}
                    placeholder="请选择节点类型"
                    allowClear
                    onChange={(v) => this.setState({
                      thirdOrButton: v
                    })}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value="三级菜单">三级菜单</Option>
                    <Option value="按钮">按钮</Option>
                  </Select>
                )}
              </FormItem>
              :
              null
          }
          {
            (
              this.props.addOrEditTitle === '新增一级菜单' ||
              this.props.addOrEditTitle === '编辑一级菜单' ||
              this.props.addOrEditTitle === '二级菜单' ||
              (this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '编辑') ||
              (this.props.addOrEditTitle === '三级菜单' && this.props.handleType === '新增' && this.state.thirdOrButton === '三级菜单')
            )
              ?
              (
                <FormItem
                  {...formItemLayout}
                  label="Path地址"
                >
                  {getFieldDecorator('path', {
                    initialValue: this.props.handleType === '新增' ? '' : this.props.addOrEditInitValues.routePath,
                    rules: [
                      {
                        required: true, message: '请输入Path地址',
                      }
                    ],
                  })(
                    <Input placeholder="请输入Path地址" />
                  )}
                </FormItem>
              )
              : null
          }
          {
            this.props.addOrEditTitle === '按钮' || this.state.thirdOrButton === '按钮'
              ?
              (
                <FormItem
                  {...formItemLayout}
                  label="权限字符串"
                >
                  {getFieldDecorator('code', {
                    initialValue: this.props.handleType === '新增' ? '' : this.props.addOrEditInitValues.code,
                    rules: [
                      {
                        required: true, message: '请输入权限字符串',
                      }
                    ],
                  })(
                    <Input placeholder="请输入权限字符串" />
                  )}
                </FormItem>
              )
              : null
          }
        </Form>
      </Modal >
    )
  }
}

const WrapperAuthAccountAddOrEdit = Form.create()(AuthAccountAddOrEdit)
export default WrapperAuthAccountAddOrEdit
