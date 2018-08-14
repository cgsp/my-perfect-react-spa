import React from 'react'
import {
    Form,
    Input,
    Button,
    Select,
} from 'antd'
import {inject,observer} from 'mobx-react'
const {Item} = Form
const {Option} = Select

@inject('applyAudit')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        const {currentPage} = this.props

        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_no = currentPage
            values.page_size = 10
            this.props.applyAudit.fetchApplyData(values)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" className = "company-search" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label="应用名称">
                        {getFieldDecorator('app_key')(<Input style={{width: 220}} autoComplete='off'/>)}
                    </Item>
                    <Item style={{marginLeft: 30}} label="应用类型">
                        {getFieldDecorator('app_type')(
                            <Select placeholder="请选择应用类型" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={1}> 移动应用 </Option>
                                <Option value={2}> 网站应用 </Option>
                            </Select>
                        )}
                    </Item>
                    <Item style={{marginLeft: 30}} label="状态">
                        {getFieldDecorator('audit_state')(
                            <Select placeholder="请选择状态" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={2}> 待审核 </Option>
                                <Option value={3}> 审核通过 </Option>
                                <Option value={4}> 审核未通过 </Option>

                            </Select>
                        )}
                    </Item>
                    <Item style={{marginLeft: 30}}  label="审批类型">
                        {getFieldDecorator('audit_type')(
                            <Select placeholder="审批类型" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={1}> 应用上线申请 </Option>
                                <Option value={2}> 应用信息修改申请 </Option>

                            </Select>
                        )}
                    </Item>
                    <Item style={{marginLeft: 20}}>
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