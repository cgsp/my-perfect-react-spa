import React from 'react'
import {
    Form,
    Input,
    Button,
    Select,
    Cascader,
    message
} from 'antd'
import {inject,observer} from 'mobx-react'
import api, {http} from './../../../service'
import {sessionCache} from '../../../utils/cache'
import {formatAddress} from '../../../utils/index'
const {Item} = Form
const {Option} = Select
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

@inject('helpContent')
@observer
class FormSearch extends React.Component {
    state = {
        treeCategory: []
    }
    componentWillMount(){
        this.fetchCategoryTree()
    }

    fetchCategoryTree = () =>{
        http.get(api.QACATETREE).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code === 0 ){
                const treeData = formatAddress(data.data)
                sessionCache.put('treeCategory', treeData || [])
                treeData.push({id: -1, name: '全部', children: [], value: -1, label: '全部'})
                this.setState({treeCategory: treeData})
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    handleSearch = (e) => {
        e.preventDefault()
        const {currentPage} = this.props
        this.props.form.validateFieldsAndScroll((errors, values) => {
            let categoryId = values.category_id
            if(categoryId && categoryId.length>0){
                categoryId = categoryId[categoryId.length-1]
                values.category_id = categoryId
            }
            values.page_no = currentPage
            values.page_size = 10
            this.props.helpContent.fetchHelpConData(values)
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const {treeCategory} = this.state
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSearch}>
                    <Item style={{marginLeft: 30}} label="问题标题">
                        {getFieldDecorator('title')(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>


                    <FormItem
                        {...formItemLayout}
                        label="所属分类"
                        style={{marginLeft: 20}}
                    >
                        {getFieldDecorator('category_id')(
                            <Cascader options={treeCategory} placeholder="请选择一级和二级分类" style={{width: 200}}/>
                        )}
                    </FormItem>


                    <Item style={{marginLeft: 20}} label="状态">
                        {getFieldDecorator('online_status')(
                            <Select placeholder="请选择状态" style={{width: 160}}>
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
const ConFormSearch = Form.create()(FormSearch)
export default ConFormSearch