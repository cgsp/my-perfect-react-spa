import React, { Component } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'
import { myCompareArr } from '@Utils/myCompareArr'

const FormItem = Form.Item
const Option = Select.Option

class AuthAccountAddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const roleList = this.props.addOrEditInitValues.roleList || []
    this.state = {
      roleList
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      const bindRoleId = myCompareArr(this.props.addOrEditInitValues.oldRoles, values.roleIds).addBindResourcesIds
      const unbindRoleId = myCompareArr(this.props.addOrEditInitValues.oldRoles, values.roleIds).unbindResourcesIds
      values.bindRoleId = bindRoleId
      values.unbindRoleId = unbindRoleId
      delete values.roleIds

      this.props.addOrEditOk(values)
      console.log(values)
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
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            <Input
              placeholder="请输入用户名"
              disabled
              value={this.props.addOrEditInitValues.userName}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="真实姓名"
          >
            <Input
              placeholder="请输入真实姓名"
              disabled
              value={this.props.addOrEditInitValues.realName}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="角色"
          >
            {getFieldDecorator('roleIds', {
              initialValue: this.props.addOrEditInitValues.oldRoles.slice(),
              rules: [
                {
                  required: true, message: '请选择角色',
                }
              ],
            })(
              <Select
                mode="multiple"
                allowClear
              >
                {
                  this.state.roleList.map((item) => (
                    <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal >
    )
  }
}

const WrapperAuthAccountAddOrEdit = Form.create()(AuthAccountAddOrEdit)
export default WrapperAuthAccountAddOrEdit
