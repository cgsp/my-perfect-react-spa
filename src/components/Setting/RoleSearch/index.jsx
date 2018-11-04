import React from 'react'
import {
  Form,
  Input,
  Button,
  Col,
  Row
} from 'antd'
import { inject, observer } from 'mobx-react'
import './style.scss'
const { Item } = Form
// const { Option } = Select


@inject('SettingAuthRole')
@observer
class FormSearch extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    console.log('chaxun')
    this.props.form.validateFieldsAndScroll((errors, value) => {
      console.log('chaxun', value)
      if (value.roleName) {
        this.props.SettingAuthRole.fetchAuthRoleList({ roleName: value.roleName })
      } else {
        this.props.SettingAuthRole.fetchAuthRoleList()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (

      <Form layout="inline" onSubmit={this.handleSubmit} className="ant-advanced-search-form">
        <Row gutter={24}>
          <Col span={8}>
            <Item label="角色名称" className="form-item">
              {getFieldDecorator('roleName')(<Input autoComplete="off" />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item className="form-item">
              <Button type="primary" htmlType="submit">
                查询
                                </Button>
            </Item>
          </Col>
        </Row>

      </Form>

    )
  }
}
const RoleSearch = Form.create()(FormSearch)
export default RoleSearch
