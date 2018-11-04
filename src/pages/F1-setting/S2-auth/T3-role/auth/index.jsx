import React, { Component } from 'react'
import { Form, Modal, Tree } from 'antd'
import { PropTypes } from 'prop-types'
const TreeNode = Tree.TreeNode


class Auth extends Component {
  static propTypes = {
    authTitle: PropTypes.string,
    authVisible: PropTypes.bool,
    authOk: PropTypes.func,
    authCancel: PropTypes.func,
    authTreeOnCheck: PropTypes.func,
    checkedKeys: PropTypes.array,
    authDataTree: PropTypes.array,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.authOk(values)
      }
    })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.childResources && item.childResources.length) {
        return (
          <TreeNode
            title={
              <span>
                <span>
                  {item.name}
                </span>
                {
                  item.type === 3
                    ?
                    <span className="tree-span tree-span-green">菜单</span>
                    :
                    <span className="tree-span tree-span-blue">按钮</span>
                }
              </span>
            }
            key={item.resourceId}
            dataRef={item}>
            {this.renderTreeNodes(item.childResources)}
          </TreeNode>
        )
      }
      return <TreeNode
        title={
          <span>
            <span>
              {item.name}
            </span>
            {
              item.type === 3
                ?
                <span className="tree-span tree-span-green">菜单</span>
                :
                <span className="tree-span tree-span-blue">按钮</span>
            }
          </span>
        }
        key={item.resourceId} />
    })
  }

  render() {
    const checkedKeys = this.props.checkedKeys.map(item => item + '')
    return (
      <Modal
        title={this.props.authTitle}
        visible={this.props.authVisible}
        onCancel={this.props.authCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={800}
        style={{
          top: 10,
          height: '700px'
        }}
      >
        <div>
          <Form
            onSubmit={this.handleSubmit}
          >
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <Tree
                checkable
                autoExpandParent={true}
                onCheck={this.props.authTreeOnCheck}
                checkedKeys={checkedKeys}
                defaultExpandAll={true}
              >
                {this.renderTreeNodes(this.props.authDataTree)}
              </Tree>
            </div>
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperAuth = Form.create()(Auth)
export default WrapperAuth



