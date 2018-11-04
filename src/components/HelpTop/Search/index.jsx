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

@inject('helpTop')
@observer
class FormSearch extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            this.props.currentPage()
            values.page_no = 1
            values.page_size = 10
            sessionCache.put('helpTop_value',values)
            // TODO: 执行搜索
            this.props.helpTop.fetchHelpTopData(values)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label="一级分类名称">
                        {getFieldDecorator('category_name')(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>
                    <Item style={{ marginLeft: 30 }} label="状态">
                        {getFieldDecorator('online_status')(
                            <Select placeholder="请选择状态" style={{ width: 120 }}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={1}> 上线 </Option>
                                <Option value={0}> 下线 </Option>
                            </Select>
                        )}
                    </Item>
                    <Item style={{ marginLeft: 20 }}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Item>
                </Form>
            </div>
        )
    }
}
const HelpTopFormSearch = Form.create()(FormSearch)
export default HelpTopFormSearch