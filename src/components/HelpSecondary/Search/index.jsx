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

@inject('helpTop')
@observer
class FormSearch extends React.Component {
    showCatagoriesAll = () =>{
        const {data} =this.props
        data.push({id: -1, name: '全部' })
        return (data && data.length >0  && data.map((item,index)=>{
            return (
                <Option value={item.id} className='test' key={item.id}>{item.name}</Option>
            )
        }))
    }

    handleSearch = (e) => {
        const {currentPage} = this.props
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_no = currentPage
            values.page_size = 10
            this.props.helpTop.fetchSecondHelpSecondData(values)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSearch}>
                    <Item style={{marginLeft: 30}} label="二级分类名称">
                        { getFieldDecorator('category_name') ( <Input style = {{width: 220}} autoComplete="off"/> ) }
                    </Item>
                    <Item style={{marginLeft: 15}} label="所属一级分类">
                        { getFieldDecorator('parent_id')(
                            <Select placeholder="请选择分类" style={{width: 220}}>
                                {this.showCatagoriesAll()}
                            </Select>
                        ) }
                    </Item>
                    <Item style={{marginLeft: 15}} label="状态">
                        {getFieldDecorator('online_status')(
                            <Select placeholder="请选择状态" style={{width: 120}}>
                                <Option value={-1}> 全部 </Option>
                                <Option value={1}> 上线 </Option>
                                <Option value={0}> 下线 </Option>

                            </Select>
                        )}
                    </Item>
                    <Item style={{ marginLeft: 20 }}>
                        <Button type="primary" htmlType="submit" >
                            查询
                        </Button>
                    </Item>
                </Form>
            </div>
        )
    }
}
const SecFormSearch = Form.create()(FormSearch)
export default SecFormSearch