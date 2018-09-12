import React, { Component } from 'react'
import { Modal, Form, Input, message, Select } from 'antd'
import { ERR_OK } from '@Constants'
import { PropTypes } from 'prop-types'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input


class ChildTablesave extends Component {
  static propTypes = {
    saveTitle: PropTypes.string,
    saveVisible: PropTypes.bool,
    saveInitValues: PropTypes.object,
    saveOk: PropTypes.func,
    saveCancel: PropTypes.func,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.props.saveOk(values)
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

    return (
      <Modal
        title={this.props.saveTitle}
        visible={this.props.saveVisible}
        onCancel={this.props.saveCancel}
        onOk={(e) => this.handleSubmit(e)}
        width={800}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="子站名称"
            >
              {getFieldDecorator('siteName', {
                initialValue: this.props.saveInitValues.siteName,
                rules: [
                  {
                    required: true, message: '请输入子站名称',
                  },
                  {
                    max: 20, message: '名称须小于20个字符',
                  }
                ],
              })(
                <Input placeholder="请输入子站名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="子站简介"
            >
              {getFieldDecorator('description', {
                initialValue: this.props.saveInitValues.description,
                rules: [
                  {
                    max: 200,
                    message: '子站简介应该小于200个字符',
                  },
                  {
                    required: true,
                    message: '请输入子站简介',
                  }
                ]
              })(
                <TextArea style={{ height: 100, maxHeight: 100 }} placeholder="请输入子站简介" />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperChildTablesave = Form.create()(ChildTablesave)
export default WrapperChildTablesave
