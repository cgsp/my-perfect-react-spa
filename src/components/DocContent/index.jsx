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

@inject('docContent')
@observer
class FormDocSearch extends React.Component {
    showCatagoriesAll = () =>{
        const {data} = this.props
        data.push({id: -1, name: '全部'})
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
            sessionCache.put('doc_value',values)
            this.props.docContent.fetchDocContentData(values)
        })
    }



    render() {
        const {getFieldDecorator} = this.props.form
        const {serchCondition} = this.props
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSearch}>
                    <Item style={{ marginLeft: 30 }} label="文档标题">
                        {getFieldDecorator('title',{
                            initialValue: serchCondition.title
                        })(<Input style={{ width: 220 }} autoComplete='off'/>)}
                    </Item>
                    <Item style={{ marginLeft: 20 }} label="所属分类">
                        {getFieldDecorator('category_id',{
                            initialValue: serchCondition.category_id
                        })(
                            <Select placeholder="所属分类" style={{ width: 180 }}>
                                {this.showCatagoriesAll()}
                            </Select>
                        )}
                    </Item>
                    <Item style={{ marginLeft: 20 }} label="状态">
                        {getFieldDecorator('online_status',{
                            initialValue: serchCondition.online_status
                        })(
                            <Select placeholder="请选择状态"  style={{ width: 160 }}>
                                <Option value="-1"> 全部 </Option>
                                <Option value="1"> 上线 </Option>
                                <Option value="0"> 下线 </Option>
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
const ConFormSearch = Form.create()(FormDocSearch)
export default ConFormSearch