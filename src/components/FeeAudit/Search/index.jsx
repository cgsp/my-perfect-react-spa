import React from 'react'
import {
    Form,
    Input,
    Button,
    Select,
} from 'antd'
import {inject,observer} from 'mobx-react'
import {sessionCache} from '../../../utils/cache'
const {Item} = Form
const {Option} = Select

@inject('applyAudit')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        const {mark} = this.props
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_size = 10
            values.page_no = 1
            this.props.handleCurrentPage()
            if(mark==='fee'){
                values.app_type= '1,2'
                this.props.applyAudit.fetchFeeData(values)
            }else if(mark==='server'){
                values.app_type= '1,2'
                this.props.applyAudit.fetchServerData(values)
            }else if(mark==='intellServer'){
                values.app_type= 3
                this.props.applyAudit.fetchServerData(values)
            }
            sessionCache.put('serverAndFee', values)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" className = "withdraw-search" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 0, marginBottom: '30px'}} label="开发者名称">
                        {getFieldDecorator('app_name')(<Input style={{width: 220}} autoComplete='off'/>)}
                    </Item>
                    <Item style={{marginLeft: 30}} label="所属渠道">
                        {getFieldDecorator('audit_channel')(
                            <Select placeholder="请选择所属渠道" style={{width: 180}}>
                                <Option value={-1}> 商务渠道 </Option>
                            </Select>
                        )}
                    </Item>
                    <Item style={{marginLeft: 30}} label="审批类型">
                        {getFieldDecorator('audit_type')(
                            <Select placeholder="请选择审批类型" style={{width: 180}}>
                                <Option value={-1}> 新增提现账户 </Option>
                                <Option value={0}> 修改提现账户 </Option>
                            </Select>
                        )}
                    </Item>
                    <Item style={{marginLeft: 30}} label="状态">
                        {getFieldDecorator('audit_state')(
                            <Select placeholder="请选择状态" style={{width: 180}}>
                                <Option value={-1}> 待商务审核 </Option>
                                <Option value={2}> 待技术支持审核 </Option>
                                <Option value={3}> 已通过 </Option>
                                <Option value={4}> 未通过 </Option>
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
const Search = Form.create()(FormSearch)
export default Search