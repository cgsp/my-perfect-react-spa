import React, { Component } from 'react'
import { Modal, Form, Input, Select, Switch } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option

class Add extends Component {
  static propTypes = {
    addTitle: PropTypes.string,
    addVisible: PropTypes.bool,
    addInitValues: PropTypes.object,
    addOk: PropTypes.func,
    addCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    let showPathOrPath = 'path'
    if (this.props.addInitValues.nameType === '三级菜单') {
      showPathOrPath = 'code'
    }
    this.state = {
      showPathOrPath
    }
    this.thirdOrButton = this.thirdOrButton.bind(this)
  }

  handleSubmit = (e, showPathOrPath) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { addTitle } = this.props
      const { nameType, resourceId } = this.props.addInitValues

      if (addTitle === '新增一级菜单') {
        values.parentId = 0
        values.level = 1
      }
      if (nameType === '一级菜单') {
        values.parentId = resourceId
        values.level = 2
      } else if (nameType === '二级菜单') {
        values.parentId = resourceId
        if (showPathOrPath === 'code') {
          values.level = 1
        } else {
          values.level = 3
        }
      } else if (nameType === '三级菜单') {
        values.parentId = resourceId
        values.level = 1
      } else {

      }

      if (!values.adminFlag) {
        values.adminFlag = 0
      } else {
        values.adminFlag = 1
      }
      console.log(values)
      this.props.addOk(values)
    })
  }

  thirdOrButton(e) {
    if (e === 4) {
      this.setState({
        showPathOrPath: 'code'
      })
    } else {
      this.setState({
        showPathOrPath: 'path'
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const line = this.props.addInitValues
    const { addTitle } = this.props
    const { showPathOrPath } = this.state
    let showFatherName = !(addTitle === '新增一级菜单')
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


    return (
      <Modal
        title={this.props.addTitle}
        visible={this.props.addVisible}
        onCancel={this.props.addCancel}
        onOk={(e, showPathOrPath) => this.handleSubmit(e, this.state.showPathOrPath)}
        destroyOnClose={true}
        width={600}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          {
            !showFatherName ? null :
              <FormItem
                {...formItemLayout}
                label="父节点名称"
              >
                <Input
                  disabled
                  value={line.name}
                />
              </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="节点名称"
          >
            {getFieldDecorator('name', {
              initialValue: undefined,
              rules: [
                {
                  required: true, message: '请输入节点名称',
                }
              ],
            })(
              <Input
                placeholder="请输入节点名称"
                autoComplete="off"
              />
            )}
          </FormItem>
          {/* 一级菜单专属 */}
          {
            addTitle === '新增一级菜单' ?
              <div>
                <FormItem
                  {...formItemLayout}
                  label="节点类型"
                >
                  {getFieldDecorator('type', {
                    initialValue: 3,
                  })(
                    <Select
                      style={{ width: '100% ' }}
                      placeholder="请选择节点类型"
                      allowClear
                      disabled
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value={3}>一级菜单</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
              :
              null
          }
          {/* 新增二级菜单专属 */}
          {
            line.nameType === '一级菜单' ?
              <div>
                <FormItem
                  {...formItemLayout}
                  label="节点类型"
                >
                  {getFieldDecorator('type', {
                    initialValue: 3,
                  })(
                    <Select
                      style={{ width: '100% ' }}
                      placeholder="请选择节点类型"
                      allowClear
                      disabled
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value={3}>二级菜单</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="ICON小图标"
                >
                  {getFieldDecorator('icon', {
                    initialValue: undefined,
                    rules: [
                      {
                        required: true, message: '请输入ICON小图标',
                      }
                    ],
                  })(
                    <Input placeholder="请输入ICON小图标" />
                  )}
                </FormItem>
              </div>
              :
              null
          }
          {/* 新增三级菜单或者按钮专属 */}
          {
            line.nameType === '二级菜单' ?
              <div>
                <FormItem
                  {...formItemLayout}
                  label="节点类型"
                >
                  {getFieldDecorator('type', {
                    initialValue: 3,
                  })(
                    <Select
                      style={{ width: '100% ' }}
                      placeholder="请选择节点类型"
                      getPopupContainer={trigger => trigger.parentNode}
                      onChange={this.thirdOrButton}
                    >
                      <Option value={3}>三级菜单</Option>
                      <Option value={4}>功能按钮</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
              :
              null
          }
          {/* 新增按钮专属 */}
          {
            line.nameType === '三级菜单' ?
              <div>
                <FormItem
                  {...formItemLayout}
                  label="节点类型"
                >
                  {getFieldDecorator('type', {
                    initialValue: 4,
                  })(
                    <Select
                      style={{ width: '100% ' }}
                      disabled
                      placeholder="请选择节点类型"
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value={4}>功能按钮</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
              :
              null
          }
          {/* path或者是code */}
          {
            showPathOrPath === 'path'
              ?
              <FormItem
                {...formItemLayout}
                label="URL路径"
              >
                {getFieldDecorator('routePath', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: true, message: '请输入URL路径',
                    }
                  ],
                })(
                  <Input placeholder="请输入URL路径" />
                )}
              </FormItem>
              :
              <FormItem
                {...formItemLayout}
                label="权限字符串"
              >
                {getFieldDecorator('code', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: true, message: '请输入权限字符串',
                    }
                  ],
                })(
                  <Input placeholder="请输入权限字符串" />
                )}
              </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="仅管理员可见"
          >
            {getFieldDecorator('adminFlag', {
              valuePropName: 'checked',
              initialValue: false,
              rules: [
                {
                  required: true, message: '请选择',
                }
              ],
            })(
              <Switch />,
            )}
          </FormItem>
        </Form>
      </Modal >
    )
  }
}

const WrapperAdd = Form.create()(Add)
export default WrapperAdd
