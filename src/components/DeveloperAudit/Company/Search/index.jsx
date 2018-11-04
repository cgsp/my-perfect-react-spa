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
const basicInfo = {
    company: {
        title: '公司名称',
        name:'corp_name'
    },
    personal:{
        title: '开发者姓名',
        name:'developer_name'
    }
}

@inject('developerAudit')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            const {mark} = this.props
            values.page_no = 1
            values.page_size = 10


            this.props.currentPageNum()
            if(mark === 'company'){
                let params = sessionCache.get('paixu_company') || {}
                values.order_by = params.order_by || 1
                if( params.is_desc === false){
                    values.is_desc = false
                }else {
                    values.is_desc = true
                }
                sessionCache.put('developer_value', values)
                this.props.developerAudit.fetchCompanyData(values)
            }else if(mark==='personal'){
                let params = sessionCache.get('paixu_person') || {}
                values.order_by = params.order_by || 1
                if( params.is_desc === false){
                    values.is_desc = false
                }else {
                    values.is_desc = true
                }
                sessionCache.put('developer_value_person', values)
                this.props.developerAudit.fetchPersonalData(values)
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {mark, serchCondition} = this.props
        return (
            <div className="company-search">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label={basicInfo[mark].title}>
                        {getFieldDecorator(basicInfo[mark].name, {
                            initialValue: serchCondition.corp_name || serchCondition.developer_name
                        })(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>
                    {mark === 'company' && <Item style={{marginLeft: 30}} label={'公司联系人'}>
                        {getFieldDecorator('corp_dev_name', {
                            initialValue: serchCondition.corp_dev_name
                        })(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>}
                    <Item style={{marginLeft: 30}} label="状态">
                        {getFieldDecorator('audit_state', {
                            initialValue: serchCondition.audit_state || undefined
                        })(
                            <Select placeholder="请选择状态" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={2}> 待审核 </Option>
                                <Option value={3}> 已通过 </Option>
                                <Option value={4}> 未通过 </Option>
                            </Select>
                        )}
                    </Item>
                    <Item style={{marginLeft: 20}}>
                        <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                            查询
                        </Button>
                    </Item>
                </Form>
            </div>
        )
    }
}
const ConpanyFormSearch = Form.create()(FormSearch)
export default ConpanyFormSearch