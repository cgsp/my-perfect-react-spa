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
      values.page_no = 1
      values.page_size = 10
      values.app_type = 3
      let params = sessionCache.get('paixu_intellApply') || {}
      values.order_by = params.order_by || 1
      if (params.is_desc === false) {
        values.is_desc = false
      } else {
        values.is_desc = true
      }
      sessionCache.put('intellApply_value', values)
      this.props.currentPageNum()
      this.props.applyAudit.fetchApplyData(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { serchCondition } = this.props
    return (
      <div>
        <Form layout="inline" className="company-search" onSubmit={this.handleSubmit}>
          <Item style={{ marginLeft: '30px', marginBottom: '10px' }} label="应用名称">
            {getFieldDecorator('app_name', {
              initialValue: serchCondition.app_name
            })(<Input style={{ width: 220 }} autoComplete='off' />)}
          </Item>
          <Item style={{ marginLeft: '60px', marginBottom: '10px' }} label="设备类型">
            {getFieldDecorator('hardware_type', {
              initialValue: serchCondition.hardware_type || undefined
            })(
              <Select placeholder="请选择设备类型" style={{ width: 160 }}>
                <Option value={-1}> 全部 </Option>
                <Option value={1}> 其他 </Option>
                <Option value={2}> 儿童机器人 </Option>
                <Option value={3}> 儿童故事机 </Option>
                <Option value={4}> 儿童手表 </Option>
                <Option value={5}> 智能音箱 </Option>
                <Option value={6}> 白色家电 </Option>
                <Option value={7}> 智能穿戴 </Option>
                <Option value={8}> 车机硬件 </Option>
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
          <Item style={{ marginLeft: '30px', marginBottom: '10px' }} label="审批类型">
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
          <Item style={{ marginLeft: '30px', marginBottom: '10px' }}>
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
