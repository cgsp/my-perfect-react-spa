import React, { Component } from 'react'
import { Form, Row, Col, Input, Modal, Icon, Select } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const Option = Select.Option


export default class AddOrEditMenu extends Component {
  static propTypes = {
    newname: PropTypes.string,
    newnameChange: PropTypes.func,
    url: PropTypes.string,
    urlChange: PropTypes.func,
    icon: PropTypes.string,
    iconChange: PropTypes.func,
    code: PropTypes.string,
    codeChange: PropTypes.func,
    name: PropTypes.string,
    modalTitle: PropTypes.string,
    modalVisible: PropTypes.bool,
    modalConfirmLoading: PropTypes.bool,
    modalOk: PropTypes.func,
    modalCancel: PropTypes.func,
    modalAlertMessage: PropTypes.string,
    modalAlertVisible: PropTypes.bool,
    appNavAndAuthPlain: PropTypes.array,
  }


  render() {
    return (
      <Modal
        title={`新增${this.props.modalTitle}`}
        visible={this.props.modalVisible}
        onOk={() => this.props.modalOk(this.props.modalTitle)}
        confirmLoading={this.props.modalConfirmLoading}
        onCancel={this.props.modalCancel}
      >
        {
          this.props.modalAlertVisible ? (
            <div style={{ color: 'red' }}>
              <Icon type="info-circle-o" style={{ fontSize: 14, color: 'red' }} />
              <span style={{ marginLeft: 10 }}>
                {this.props.modalAlertMessage}
              </span>
            </div>
          ) : null
        }
        <Row>
          <Col span={24}>
            <FormItem label={`${this.props.modalTitle}名称`}>
              <Input placeholder={`请输入${this.props.modalTitle}名称`} value={this.props.newname} onChange={this.props.newnameChange} />
            </FormItem>
          </Col>
          {
            this.props.modalTitle === '一级菜单' ? null : (
              <Col span={24}>
                <FormItem label="父节点名称">
                  <Input value={this.props.name} disabled />
                </FormItem>
              </Col>
            )
          }
          {
            this.props.modalTitle === '一级菜单' ? (
              <Col span={24}>
                <FormItem label="一级菜单图标">
                  <Input value={this.props.icon} onChange={this.props.iconChange} placeholder="请输入一级菜单的图标字符串" />
                </FormItem>
              </Col>
            ) : null
          }
          <Col span={24}>
            <FormItem label="新增节点的类型">
              <Select
                style={{ width: '100% ' }}
                disabled
                value={(() => {
                  let type
                  switch (this.props.modalTitle) {
                    case '一级菜单':
                      type = '一级菜单'
                      break
                    case '二级菜单':
                      type = '二级菜单'
                      break
                    case '三级菜单':
                      type = '三级菜单'
                      break
                    case '功能':
                      type = '功能'
                      break
                    default:
                      break
                  }
                  return type
                })()}
              >
                <Option value="一级菜单">一级菜单</Option>
                <Option value="二级菜单">二级菜单</Option>
                <Option value="三级菜单">三级菜单</Option>
                <Option value="功能">功能</Option>
              </Select>
            </FormItem>
          </Col>
          {
            this.props.modalTitle === '一级菜单' || '二级菜单' || '三级菜单' ? (
              <Col span={24}>
                <FormItem label="url路径">
                  <Input value={this.props.url} placeholder="请输入菜单的url路径" onChange={this.props.urlChange} />
                </FormItem>
              </Col>
            ) : null
          }
          {
            this.props.modalTitle === '一级菜单' || '二级菜单' || '三级菜单' ? null : (
              <Col span={24}>
                <FormItem label="权限字符串">
                  <Input value={this.props.code} placeholder="请输入该功能的权限字符串" onChange={this.props.codeChange} />
                </FormItem>
              </Col>
            )
          }
        </Row>
      </Modal >
    )
  }
}
