import React from 'react'
import {
    Form,
    Input,
    Button,
    Select,
} from 'antd'
import {inject,observer} from 'mobx-react'
import {sessionCache} from '../../../../utils/cache'
const {Item} = Form
const {Option} = Select

@inject('applyAudit')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        const { currentPage } = this.props
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
                    <Item style={{marginLeft: 30}} label="设备类型">
                        {getFieldDecorator('hardware_type')(
                            <Select placeholder="设备类型" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={1}> 儿童机器人 </Option>
                                <Option value={2}> 儿童故事机 </Option>
                                <Option value={3}> 儿童手表 </Option>
                                <Option value={4}> 智能音箱 </Option>
                                <Option value={5}> 白色家电 </Option>
                                <Option value={6}> 智能穿戴 </Option>
                                <Option value={0}> 其他 </Option>
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