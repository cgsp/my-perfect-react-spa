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

@inject('catagories')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            sessionCache.put('catagories_value', values)
            this.props.catagories.fetchCatagoriesData(values)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label="文档分类">
                        {getFieldDecorator('category_name')(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>
                    <Item style={{marginLeft: 30}} label="状态">
                        {getFieldDecorator('online_status')(
                            <Select placeholder="请选择状态" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={1}> 上线 </Option>
                                <Option value={0}> 下线 </Option>
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
const CatagoryFormSearch = Form.create()(FormSearch)
export default CatagoryFormSearch