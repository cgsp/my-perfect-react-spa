import React, { Component } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'

const Option = Select.Option
const FormItem = Form.Item


@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesions }
)
class SelfTagTagAddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const title = this.props.addOrEditTitle
        this.props.addOrEditOk(values, title)
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
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
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={() => this.handleSubmit()}
        confirmLoading={this.props.editOrEditConfirmLoading}
        width={800}
        destroyOnClose={true}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="所属维度"
            >
              {getFieldDecorator('dimension', {
                initialValue: this.props.addOrEditInitValues.dimensionId,
                rules: [
                  {
                    required: true, message: '请选择所属维度',
                  }
                ],
              })(
                <Select
                  allowClear
                  placeholder="请选择所属维度"
                >
                  {
                    this.props.commonDimesions.map(item => (
                      <Option key={item.dimensionId} value={item.dimensionId}>{item.dimensionName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否新建维度"
            >
              <Button type="primary">新建</Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="听单名称"
            >
              {getFieldDecorator('tagName', {
                initialValue: this.props.addOrEditInitValues.tagName,
                rules: [
                  {
                    required: true, message: '请输入标签名称',
                  }
                ],
              })(
                <Input placeholder="请输入标签名称" />
              )}
            </FormItem>

          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfTagTagAddOrEdit = Form.create()(SelfTagTagAddOrEdit)
export default WrapperSelfTagTagAddOrEdit
