import React, { Component } from 'react'
import { Form, Row, Col, Input, Modal, Tree, Icon } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getNavAndAuthData } from '@Redux/navBarAndAuth'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item

@connect(
  state => state.navBarAndAuthReducer,
  { getNavAndAuthData }
)
export default class TreeModal extends Component {
  static propTypes = {
    treeModalVisible: PropTypes.bool,
    treeModalOk: PropTypes.func,
    treeModalCancel: PropTypes.func,
    getNavAndAuthData: PropTypes.func.isRequired,
    appNavAndAuthQian: PropTypes.array,
  }


  componentDidMount() {
    if (!this.props.appNavAndAuthQian.length) {
      this.props.getNavAndAuthData()
    }
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
        title="树状权限预览"
        visible={this.props.treeModalVisible}
        onOk={this.props.treeModalOk}
        onCancel={this.props.treeModalCancel}
      >
        <div style={{ height: 400, maxHeight: 400, overflowX: 'scroll' }}>
          <Tree
            autoExpandParent={true}
            defaultExpandAll={true}
          >
            {this.renderTreeNodes(this.props.appNavAndAuthQian)}
          </Tree>
        </div>
      </Modal >
    )
  }
}
