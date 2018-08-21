import React, { Component } from 'react'
import { List, Form, Row, Col, Select, Modal } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option

export default class AddOrEditAccount extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    modalConfirmLoading: PropTypes.bool,
    modalOk: PropTypes.func,
    modalCancel: PropTypes.func,
    modalUserValue: PropTypes.string,
    modalRoleValue: PropTypes.array,
    modalHandleSelectSearch: PropTypes.func,
    modalHandleSelectChange: PropTypes.func,
    modalRoleSelectOptionsData: PropTypes.array,
    modalUserSelectOptionsData: PropTypes.array
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
        <List>
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.handleSearch}
            layout="vertical"
          >
            <Row>

              <Col span={24}>
                <FormItem label="用户名称" style={{ marginBottom: 0, marginTop: 10 }}>
                  <Select
                    showSearch
                    style={{ width: '100%', marginTop: 4 }}
                    placeholder="请输入搜索关键字"
                    allowClear={true}
                    value={this.props.modalUserValue}
                    onSearch={this.props.modalHandleSelectSearch}
                    onChange={this.props.modalHandleSelectChange}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    notFoundContent={'根据此关键字，无法搜索'}
                  >
                    {
                      this.props.modalUserSelectOptionsData.map(item => (
                        <Option key={item.value}>{item.text}</Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="角色名称" style={{ marginBottom: 10, marginTop: 10 }}>
                  <Select
                    style={{ width: '100%', marginTop: 4 }}
                    placeholder="请选择角色"
                    allowClear={true}
                    value={this.props.modalRoleValue}
                    onChange={this.props.modalHandleRoleSelectChange}
                    mode="multiple"
                  >
                    {
                      this.props.modalRoleSelectOptionsData.map(item => (
                        <Option key={item.key}>{item.text}</Option>
                      ))
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </List>
      </Modal>
    )
  }
}
