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
            const {mark, currentPage} = this.props
            values.page_no = currentPage
            values.page_size = 10
            if(mark === 'company'){
                this.props.developerAudit.fetchCompanyData(values)
            }else if(mark==='personal'){
                this.props.developerAudit.fetchPersonalData(values)
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {mark} = this.props
        return (
            <div className="company-search">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label={basicInfo[mark].title}>
                        {getFieldDecorator(basicInfo[mark].name)(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>
                    <Item style={{marginLeft: 30}} label="状态">
                        {getFieldDecorator('audit_state')(
                            <Select placeholder="请选择开发者状态" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={2}> 待审核 </Option>
                                <Option value={3}> 审核通过 </Option>
                                <Option value={4}> 审核未通过 </Option>
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