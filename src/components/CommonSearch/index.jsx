import React from 'react'
import {
    Form,
    Input,
    Button,
    Select,
} from 'antd'
import {inject,observer} from 'mobx-react'
import {sessionCache} from '../../utils/cache'
const {Item} = Form
const {Option} = Select

@inject('applyAudit')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        const {mark, currentPage} = this.props
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_size = 10
            values.page_no = currentPage
            if(mark==='fee'){
                this.props.applyAudit.fetchFeeData(values)
            }else if(mark==='server' || mark==='intellServer'){
                this.props.applyAudit.fetchServerData(values)
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" className = "server-search" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label="应用名称">
                        {getFieldDecorator('app_key')(<Input style={{width: 220}}/>)}
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
const CommonSearch = Form.create()(FormSearch)
export default CommonSearch