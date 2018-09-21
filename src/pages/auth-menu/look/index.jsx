import React, { Component } from 'react'
import { Form, Modal, Tree } from 'antd'
import { PropTypes } from 'prop-types'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item


class lookRole extends Component {
  static propTypes = {
    lookTitle: PropTypes.string,
    lookVisible: PropTypes.bool,
    lookInitValues: PropTypes.object,
    lookOk: PropTypes.func,
    lookCancel: PropTypes.func,
    lookOnCheck: PropTypes.func,
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
        this.props.lookOk(values)
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }

    // console.log(this.props.checkedKeys)
    const checkedKeys = this.props.checkedKeys.map(item => item + '')
    return (
      <Modal
        title={this.props.lookTitle}
        visible={this.props.lookVisible}
        onCancel={this.props.lookCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={600}
      >
        <div style={{ maxHeight: 550, overflowY: 'auto' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="树形预览"
            >
              <div style={{ height: 300, maxHeight: 300, overflowX: 'scroll' }}>
                <Tree
                  autoExpandParent={true}
                  onCheck={this.props.lookOnCheck}
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

const WrapperAuthMenulook = Form.create()(lookRole)
export default WrapperAuthMenulook



