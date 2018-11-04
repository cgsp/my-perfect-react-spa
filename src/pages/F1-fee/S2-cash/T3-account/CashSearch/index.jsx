import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  Col,
  Row
} from 'antd'
// import { inject, observer } from 'mobx-react'
import './styles.scss'
const { Item } = Form
const { Option } = Select

class FormSearch extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()


  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className="cash-search-form">
        <Row>
          <Col span={8}>
            <Item label="开发者名称" className="form-item">
              {getFieldDecorator('developerName')(<Input autoComplete="off" style={{ width: '200px' }} />)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="账户状态" className="form-item">
              {getFieldDecorator('accountStatus')(
                <Select placeholder="请选择状态" style={{ width: '200px' }}>
                  <Option value={0}> 正常 </Option>
                  <Option value={1}> 停用 </Option>
                </Select>)}
            </Item>
          </Col>
          <Col span={8}>
            <Item label="所属渠道" className="form-item">
              {getFieldDecorator('channels')((
                <Select placeholder="请选择所属商务渠道" style={{ width: '200px' }}>
                  <Option value={0}> 运营商线 </Option>
                  <Option value={1}> 电商线 </Option>
                  <Option value={2}> 金融线 </Option>
                </Select>))}
            </Item>
          </Col>
          <Col span={8}>
            <Item className="form-item" >
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
const CashSearch = Form.create()(FormSearch)
export default CashSearch
