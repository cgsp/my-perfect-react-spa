import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Tree } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { getNavAndAuthData } from '@Redux/navBarAndAuth'
const TreeNode = Tree.TreeNode

const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0' },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' },
    ],
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' },
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
  ],
}, {
  title: '0-2',
  key: '0-2',
}]

@connect(
  state => state.navBarAndAuthReducer,
  { getNavAndAuthData }
)
@withRouter
export default class AddOrEditRole extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    modalConfirmLoading: PropTypes.bool,
    modalOk: PropTypes.func,
    modalCancel: PropTypes.func,
    getNavAndAuthData: PropTypes.func.isRequired,
    appNavAndAuthQian: PropTypes.array,
    appNavAndAuthChecked: PropTypes.array,
    location: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      autoExpandParent: true,
      checkedKeys: ['0-0-0-0', '0-0-0-1', '0-0-0-2'],
    }
  }

  componentDidMount() {
    if (!this.props.appNavAndAuthQian.length) {
      this.props.getNavAndAuthData()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // // console.log(nextProps)
    // if (nextProps.appNavAndAuthQian.length) {
    //   this.refs.mask1.hide()
    // }
    return true
  }

  onExpand = (expandedKeys) => {
    // console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  onCheck = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys)
    console.log('halfChecked', e.halfCheckedKeys)
    this.setState({ checkedKeys })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
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
        onOk={() => this.props.modalOk(this.props.modalTitle)}
        confirmLoading={this.props.modalConfirmLoading}
        onCancel={this.props.modalCancel}
      >
        <Tree
          checkable
          onExpand={this.onExpand}
          defaultExpandAll={true}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
        
      </Modal>
    )
  }
}
