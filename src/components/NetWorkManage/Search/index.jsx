import React from 'react'
import {
    Form,
    Input,
    Button,
    Select,
    message
} from 'antd'
import {inject,observer} from 'mobx-react'
import api, {http} from './../../../service'
const {Item} = Form
const {Option} = Select

@inject('netWorkManage')
@observer
class FormDocSearch extends React.Component {
    state = {
        developerNameArr: [],
        letterTypeArr: []
    }
    componentWillMount(){
        this.fetchDeveloperName()
        this.letterType()
    }
    handleSearch = (e) => {
        e.preventDefault()
        const {currentPage} = this.props
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_no = currentPage
            values.page_size = 10
            // TODO: 执行搜索
            this.props.netWorkManage.fetchLettersData(values)
        })
    }

    fetchDeveloperName = () =>{
        http.get(api.LETTERSMAP).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code === 0) {
                data.data.push({id: -1, developerName: '全部' })
                this.setState({developerNameArr: data.data})
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    letterType = () =>{
        http.get(api.LETTERSTYPE).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code === 0) {
                data.data.push({id: -1, name: '全部'})
                this.setState({letterTypeArr: data.data})
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    showCatagoriesAll = (data) =>{
        console.log('show zhanshi',data)
        return (data && data.length >0  && data.map((item,index)=>{
            return (
                <Option value={item.id} className='test' key={item.id}>{item.name ? item.name : item.developerName}</Option>
            )
        }))
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const {letterTypeArr, developerNameArr} = this.state
        return (
            <div>
                <Form layout="inline" className='letter-search' onSubmit={this.handleSearch}>
                    <Item label="站内信类型">
                        {getFieldDecorator('type')(
                            <Select placeholder="请选择类型"
                                    style={{ width: 200 }}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {this.showCatagoriesAll(letterTypeArr)}
                            </Select>
                        )}
                    </Item>
                    <Item style={{ marginLeft: 20 }} label="读取状态">
                        {getFieldDecorator('read_status')(
                            <Select placeholder="请选择状态" style={{ width: 160 }}>
                                <Option value="-1"> 全部 </Option>
                                <Option value="1"> 已读 </Option>
                                <Option value="0"> 未读 </Option>
                            </Select>
                        )}
                    </Item>
                    <Item style={{ marginLeft: 20 }} label="开发者">
                        {getFieldDecorator('developer_id')(
                            <Select style={{ width: 180 }}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {this.showCatagoriesAll(developerNameArr)}
                            </Select>
                        )}
                    </Item>
                    <Item style={{ marginLeft: 30 }} label="站内信标题">
                        {getFieldDecorator('title')(<Input style={{ width: 220 }} autoComplete='off'/>)}
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
const NetFormSearch = Form.create()(FormDocSearch)
export default NetFormSearch