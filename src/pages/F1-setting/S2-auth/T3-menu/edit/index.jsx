import React, { Component } from 'react'
import { Modal, Form, Input, Select, Switch } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option

class Edit extends Component {
  static propTypes = {
    editTitle: PropTypes.string,
    editVisible: PropTypes.bool,
    editInitValues: PropTypes.object,
    editOk: PropTypes.func,
    editCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    let showPathOrPath = 'path'
    if (this.props.editInitValues.nameType === '功能按钮') {
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
      const { editTitle } = this.props
      const { nameType, resourceId, parentId, sort } = this.props.editInitValues

      if (editTitle === '编辑一级菜单') {
        values.parentId = 0
        values.resourceId = resourceId
        values.level = 1
      }
      if (nameType === '二级菜单') {
        values.parentId = parentId
        values.resourceId = resourceId
        values.level = 2
      } else if (nameType === '三级菜单') {
        values.parentId = parentId
        values.resourceId = resourceId
        values.level = 3
      } else if (nameType === '功能按钮') {
        values.parentId = parentId
        values.resourceId = resourceId
        values.level = 1
      } else {

      }

      if (!values.adminFlag) {
        values.adminFlag = 0
      } else {
        values.adminFlag = 1
      }
      values.sort = sort
      // console.log(values)
      this.props.editOk(values)
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
    const line = this.props.editInitValues
    const { editTitle } = this.props
    const { showPathOrPath } = this.state
    let showFatherName = !(editTitle === '编辑一级菜单')
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
        title={this.props.editTitle}
        visible={this.props.editVisible}
        onCancel={this.props.editCancel}
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
                  value={line.parentName}
                />
              </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="节点名称"
          >
            {getFieldDecorator('name', {
              initialValue: line.name,
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
          {/* 编辑一级菜单专属 */}
          {
            editTitle === '编辑一级菜单' ?
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
          {/* 编辑二级菜单专属 */}
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
                    initialValue: line.icon,
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
          {/* 编辑三级菜单专属 */}
          {
            line.nameType === '三级菜单' ?
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
                      disabled
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value={3}>三级菜单</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
              :
              null
          }
          {/* 编辑按钮专属 */}
          {
            line.nameType === '功能按钮' ?
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
                  initialValue: line.routePath,
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
                  initialValue: line.code,
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
              initialValue: line.adminFlag === 1,
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

const WrapperEdit = Form.create()(Edit)
export default WrapperEdit
