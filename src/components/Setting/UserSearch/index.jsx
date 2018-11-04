import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  List,
  Col,
  Row
} from 'antd'
import { inject, observer } from 'mobx-react'
import './style.scss'
import { toJS } from 'mobx'
const { Item } = Form
const { Option } = Select
// const formLayout = {
//   labelCol: {
//     span: 6
//   },
//   wrapperCol: {
//     span: 18
//   }
// }
@inject('SettingAuthAccount')
@observer
class FormSearch extends React.Component {
  componentDidMount() {
    this.props.SettingAuthAccount.fetchRole()
  }

  handleSubmit = (e) => {
    e.preventDefault()


    this.props.form.validateFieldsAndScroll((errors, values) => {
      console.log('搜索', values)
      this.props.SettingAuthAccount.fetchUserList(values)
    })

  }


  showRole = () => {
    const { roleInfo } = toJS(this.props.SettingAuthAccount)
    const { data } = roleInfo
    console.log('roleInfo 用户管理', roleInfo)

    return (data && data.length > 0 && data.map((item, index) => {
      return (
        <Option value={item.roleId} key={index}> {item.roleName} </Option>)
    }))
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <List className="user-search-list" bordered>
        <Form layout="inline" onSubmit={this.handleSubmit} className="ant-advanced-search-form">
          <Row gutter={24}>
            <Col span={8}>
              <Item label="真实姓名" className="form-item">
                {getFieldDecorator('realName')(<Input autoComplete="off" />)}
              </Item>
            </Col>
            <Col span={8}>
              <Item label="角色名称" className="form-item">
                {getFieldDecorator('roleId')(
                  <Select placeholder="请选择角色">
                    {this.showRole()}
                  </Select>
                )}
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
      </List>
    )
  }
}
const UserSearch = Form.create()(FormSearch)
export default UserSearch
