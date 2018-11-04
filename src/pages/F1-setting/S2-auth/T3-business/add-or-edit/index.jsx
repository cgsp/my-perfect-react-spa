import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item

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
      const title = this.props.addOrEditTitle
      this.props.addOrEditOk(values, title)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
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

    let show = true
    if (this.props.addOrEditTitle === '新增一级渠道') {
      show = false
    }
    if (this.props.addOrEditInitValues.type === '一级渠道' && this.props.addOrEditTitle === '编辑渠道') {
      show = false
    }
    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={600}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          {
            !show ? null :
              <FormItem
                {...formItemLayout}
                label="上级渠道名称"
              >
                <Input
                  disabled
                  value={this.props.addOrEditTitle === '编辑渠道' ? this.props.addOrEditInitValues.fatherName : this.props.addOrEditInitValues.name}
                />
              </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="渠道名称"
          >
            {getFieldDecorator('name', {
              initialValue: this.props.addOrEditTitle === '编辑渠道' ? this.props.addOrEditInitValues.name : undefined,
              rules: [
                {
                  required: true, message: '请输入渠道名称',
                }
              ],
            })(
              <Input
                placeholder="请输入渠道名称"
                autoComplete="off"
              />
            )}
          </FormItem>
        </Form>
      </Modal >
    )
  }
}

const WrapperAddOrEdit = Form.create()(AddOrEdit)
export default WrapperAddOrEdit
