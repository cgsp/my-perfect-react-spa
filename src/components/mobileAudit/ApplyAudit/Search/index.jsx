import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
} from 'antd'
import { inject, observer } from 'mobx-react'
import { sessionCache } from '../../../../utils/cache'
const { Item } = Form
const { Option } = Select

@inject('applyAudit')
@observer
class FormSearch extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      this.props.currentPageNum()
      values.page_no = 1
      values.page_size = 10
      if (!values.app_type || values.app_type === -1) {
        values.app_type = '1,2'
      }
      let params = sessionCache.get('paixu_mobAudit') || {}

      values.order_by = params.order_by || 1
      if (params.is_desc === false) {
        values.is_desc = false
      } else {
        values.is_desc = true
      }
      sessionCache.put('mobile_value', values)
      this.props.applyAudit.fetchApplyData(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    let { serchCondition } = this.props
    if (serchCondition.app_type === '1,2') {
      serchCondition.app_type = -1
    }
    return (
      <div>
        <Form layout="inline" className="company-search" onSubmit={this.handleSubmit}>
          <Item style={{ marginLeft: '30px', marginBottom: '10px' }} label="应用名称">
            {getFieldDecorator('app_name', {
              initialValue: serchCondition.app_name
            })(<Input style={{ width: 220 }} autoComplete='off' />)}
          </Item>
          <Item style={{ marginLeft: '60px', marginBottom: '10px' }} label="应用类型">
            {getFieldDecorator('app_type', {
              initialValue: serchCondition.app_type || undefined
            })(
              <Select placeholder="请选择应用类型" style={{ width: 160 }}>
                <Option value={-1}> 全部 </Option>
                <Option value={1}> 移动应用 </Option>
                <Option value={2}> 网站应用 </Option>
              </Select>
            )}
          </Item>
          <Item style={{ marginLeft: '60px', marginBottom: '10px' }} label="状态">
            {getFieldDecorator('audit_state', {
              initialValue: serchCondition.audit_state || undefined
            })(
              <Select placeholder="请选择状态" style={{ width: 160 }}>
                <Option value={-1}> 全部 </Option>
                <Option value={2}> 待审核 </Option>
                <Option value={3}> 已通过 </Option>
                <Option value={4}> 未通过 </Option>

              </Select>
            )}
          </Item>
          <Item style={{ marginLeft: 30, marginBottom: '10px' }} label="审批类型">
            {getFieldDecorator('audit_type', {
              initialValue: serchCondition.audit_type || undefined
            })(
              <Select placeholder="请选择审批类型" style={{ width: 160 }}>
                <Option value={-1}> 全部 </Option>
                <Option value={1}> 应用上线申请 </Option>
                <Option value={2}> 应用信息修改申请 </Option>

              </Select>
            )}
          </Item>
          <Item style={{ marginLeft: 20, marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit">
              查询
                        </Button>
          </Item>
        </Form>
      </div>
    )
  }
}
const ApplyFormSearch = Form.create()(FormSearch)
export default ApplyFormSearch
