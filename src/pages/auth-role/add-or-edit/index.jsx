import React, { Component } from 'react'
import { Form, Input, Modal, Tree } from 'antd'
import { PropTypes } from 'prop-types'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item


class AddOrEditRole extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
    addOrEditOnCheck: PropTypes.func,
    checkedKeys: PropTypes.array,
    authData: PropTypes.array,
  }


  // onCheck = (checkedKeys, e) => {
  //   console.log('onCheck', checkedKeys)
  //   console.log('halfChecked', e.halfCheckedKeys)
  //   this.setState({ checkedKeys, halfCheckedKeys: e.halfCheckedKeys })
  // }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const title = this.props.addOrEditTitle
        this.props.addOrEditOk(values, title)
      }
    })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.childResources && item.childResources.length) {
        return (
          <TreeNode title={item.name} key={item.resourceId} dataRef={item}>
            {this.renderTreeNodes(item.childResources)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={item.resourceId} />
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

    // console.log(this.props.checkedKeys)
    const checkedKeys = this.props.checkedKeys.map(item => item + '')
    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={600}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {
                getFieldDecorator('roleName', {
                  initialValue: this.props.addOrEditInitValues.roleName,
                  rules: [
                    {
                      required: true, message: '请输入角色名称',
                    },
                    {
                      max: 10, message: '角色名称不能超过10个字符',
                    }
                  ],
                })(
                  <Input style={{ width: '100%' }} placeholder="请输入角色名称" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色code"
            >
              {
                getFieldDecorator('roleCode', {
                  initialValue: this.props.addOrEditInitValues.roleCode,
                  rules: [
                    {
                      required: true, message: '请输入角色code',
                    },
                    {
                      max: 20, message: '角色code不能超过20个字符',
                    }
                  ],
                })(
                  <Input style={{ width: '100%' }} placeholder="请输入角色code" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色描述"
            >
              {
                getFieldDecorator('desc', {
                  initialValue: this.props.addOrEditInitValues.desc,
                  rules: [
                    {
                      required: true, message: '请输入角色描述',
                    },
                    {
                      max: 30, message: '角色描述不能超过30个字符',
                    }
                  ],
                })(
                  <Input style={{ width: '100%' }} placeholder="请输入角色描述" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限设置"
            >
              <div style={{ height: 300, maxHeight: 300, overflowX: 'scroll' }}>
                <Tree
                  checkable
                  autoExpandParent={true}
                  onCheck={this.props.addOrEditOnCheck}
                  checkedKeys={checkedKeys}
                  defaultExpandAll={true}
                >
                  {this.renderTreeNodes(this.props.authData)}
                </Tree>
              </div>
            </FormItem>
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperAuthRoleAddOrEdit = Form.create()(AddOrEditRole)
export default WrapperAuthRoleAddOrEdit



