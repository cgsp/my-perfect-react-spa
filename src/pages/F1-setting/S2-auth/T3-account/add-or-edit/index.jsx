import React, { Component } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'
import { myCompareArr } from '@Utils/my-compare-arr'

const FormItem = Form.Item
const Option = Select.Option

class AddOrEdit extends Component {
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
    const businessList = this.props.addOrEditInitValues.businessList || []
    const oldRolesIdAndNames = this.props.addOrEditInitValues.oldRolesIdAndNames || []
    let businessShow = false
    oldRolesIdAndNames.forEach(element => {
      if (element.indexOf('商务') > -1) {
        businessShow = true
      }
    })
    this.state = {
      roleList,
      businessList,
      businessShow
    }
    this.roleListChange = this.roleListChange.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const roleIds = values.roleIds.map((item) => {
        return item.split('~~')[0] - 0
      })
      delete values.roleIds

      // console.log(this.props.addOrEditInitValues.oldRolesIds, roleIds)
      // return

      const bindRoleId = myCompareArr(this.props.addOrEditInitValues.oldRolesIds, roleIds).addBindResourcesIds
      const unbindRoleId = myCompareArr(this.props.addOrEditInitValues.oldRolesIds, roleIds).unbindResourcesIds
      values.bindRoleId = bindRoleId
      values.unbindRoleId = unbindRoleId
      this.props.addOrEditOk(values)
      // console.log(values)
    })
  }

  roleListChange(e) {
    console.log(e)
    const list = e
    let businessShow = false
    list.forEach(element => {
      if (element.indexOf('商务') > -1) {
        businessShow = true
      }
    })
    this.setState({
      businessShow
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
            label="角色"
          >
            {getFieldDecorator('roleIds', {
              initialValue: this.props.addOrEditInitValues.oldRolesIdAndNames.slice(),
              rules: [
                {
                  required: true, message: '请选择角色',
                }
              ],
            })(
              <Select
                mode="multiple"
                allowClear
                getPopupContainer={trigger => trigger.parentNode}
                onChange={this.roleListChange}
              >
                {
                  this.state.roleList.map((item) => (
                    <Option key={item.roleId} value={`${item.roleId}~~${item.roleName}`}>{item.roleName}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          {
            this.state.businessShow ?
              <FormItem
                {...formItemLayout}
                label="商务渠道"
              >
                {getFieldDecorator('businessTypeCategoryId', {
                  initialValue: this.props.addOrEditInitValues.businessTypeCategoryId ? this.props.addOrEditInitValues.businessTypeCategoryId : undefined,
                  rules: [
                    {
                      required: true, message: '请选择商务渠道',
                    }
                  ],
                })(
                  <Select
                    allowClear
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {
                      this.state.businessList.map((item) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem> :
              null
          }
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
        </Form>
      </Modal >
    )
  }
}

const WrapperAddOrEdit = Form.create()(AddOrEdit)
export default WrapperAddOrEdit
