import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Row, Col, Input, Modal, Tree } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getNavAndAuthData } from '@Redux/navBarAndAuth'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item

@connect(
  state => state.navBarAndAuthReducer,
  { getNavAndAuthData }
)
@withRouter
export default class AddOrEditRole extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    rolename: PropTypes.string,
    roleNameChange: PropTypes.func,
    roledesc: PropTypes.string,
    roleDescChange: PropTypes.func,
    modalConfirmLoading: PropTypes.bool,
    modalOk: PropTypes.func,
    modalCancel: PropTypes.func,
    checkedKeys: PropTypes.array,
    onCheck: PropTypes.func,
    getNavAndAuthData: PropTypes.func.isRequired,
    appNavAndAuthQian: PropTypes.array,
    appNavAndAuthChecked: PropTypes.array,
    location: PropTypes.object
  }


  componentDidMount() {
    if (!this.props.appNavAndAuthQian.length) {
      this.props.getNavAndAuthData()
    }
  }

  onCheck = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys)
    console.log('halfChecked', e.halfCheckedKeys)
    this.setState({ checkedKeys, halfCheckedKeys: e.halfCheckedKeys })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }

  render() {
    return (
      <Modal
        title={this.props.modalTitle}
        visible={this.props.modalVisible}
        onOk={() => this.props.modalOk(this.props.modalTitle, this.state)}
        confirmLoading={this.props.modalConfirmLoading}
        onCancel={this.props.modalCancel}
      >

        <Row>
          <Col span={24}>
            <FormItem label="角色名称">
              <Input placeholder="请输入角色名称" value={this.props.rolename} onChange={this.props.roleNameChange} />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="角色描述">
              <Input placeholder="请输入角色描述" value={this.props.roledesc} onChange={this.props.roleDescChange} />
            </FormItem>
          </Col>
        </Row>
        <div>权限设置</div>
        <div style={{ height: 250, maxHeight: 250, overflowX: 'scroll' }}>
          <Tree
            checkable
            autoExpandParent={true}
            onCheck={this.props.onCheck}
            checkedKeys={this.props.checkedKeys}
            defaultExpandAll={true}
          >
            {this.renderTreeNodes(this.props.appNavAndAuthQian)}
          </Tree>
        </div>
      </Modal >
    )
  }
}
