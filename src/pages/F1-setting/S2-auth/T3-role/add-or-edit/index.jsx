import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const TextArea = Input.TextArea

class AddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.props.addOrEditOk(values, this.props.addOrEditTitle)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const line = this.props.addOrEditInitValues
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
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={500}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem
            {...formItemLayout}
            label="角色名称"
          >
            {getFieldDecorator('roleName', {
              initialValue: line.roleName ? line.roleName : undefined,
              rules: [
                {
                  required: true, message: '请选择角色',
                },
                {
                  max: 15, message: '角色名称长度须小于15个字符',
                }
              ],
            })(
              <Input placeholder="请输入角色名称" autoComplete="off" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="角色Code"
          >
            {getFieldDecorator('roleCode', {
              initialValue: line.roleCode ? line.roleCode : undefined,
              rules: [
                {
                  required: true, message: '请输入角色Code',
                },
                {
                  max: 20, message: '角色Code长度须小于20个字符',
                }
              ],
            })(
              <Input placeholder="请输入角色Code" autoComplete="off" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="角色描述"
          >
            {
              getFieldDecorator('desc', {
                initialValue: line.desc ? line.desc : undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入角色描述',
                  },
                  {
                    max: 50,
                    message: '角色描述应该小于50个字符',
                  }
                ]
              })(
                <TextArea
                  style={{ height: 100, maxHeight: 100 }}
                  placeholder="请输入角色描述"
                  autoComplete="off"
                />
              )
            }
          </FormItem>
        </Form>
      </Modal >
    )
  }
}

const WrapperAddOrEdit = Form.create()(AddOrEdit)
export default WrapperAddOrEdit
