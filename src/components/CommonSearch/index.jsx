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
        const {mark} = this.props
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_size = 10
            values.page_no = 1

            this.props.handleCurrentPage()
            if(mark==='fee'){
                values.app_type= '1,2'
                let params = sessionCache.get('paixu_mobFee') || {}
                values.order_by = params.order_by || 1
                if( params.is_desc === false){
                    values.is_desc = false
                }else {
                    values.is_desc = true
                }
                sessionCache.put('serverAndFee', values)
                this.props.applyAudit.fetchFeeData(values)
            }else if(mark==='server'){
                values.app_type= '1,2'
                let params = sessionCache.get('paixu_mobServer') || {}
                values.order_by = params.order_by || 1
                if( params.is_desc === false){
                    values.is_desc = false
                }else {
                    values.is_desc = true
                }
                sessionCache.put('serverAndFee', values)
                this.props.applyAudit.fetchServerData(values)
            }else if(mark==='intellServer'){
                let params = sessionCache.get('paixu_intellServer') || {}
                values.order_by = params.order_by || 1
                if( params.is_desc === false){
                    values.is_desc = false
                }else {
                    values.is_desc = true
                }
                values.app_type= 3
                sessionCache.put('server_intell', values)
                this.props.applyAudit.fetchServerData(values)
            }

        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const { serchCondition } = this.props
        return (
            <div>
                <Form layout="inline" className = "server-search" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 0}} label="应用名称">
                        {getFieldDecorator('app_name',{
                            initialValue: serchCondition.app_name
                        })(<Input style={{width: 220}} autoComplete='off'/>)}
                    </Item>
                    <Item style={{marginLeft: 30}} label="状态">
                        {getFieldDecorator('audit_state',{
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