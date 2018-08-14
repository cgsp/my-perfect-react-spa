import React, { Component } from 'react'
import {
    message
} from 'antd'
import { toJS } from 'mobx'
import api,{http} from '../../service'
import { Select, Form, Row, Col,} from 'antd'
const { Option } = Select
const { Item } = Form
const diffObj={
    secCategory: {url: api.QACATEGORYALL, id: 'parentId'},
    mainCategory: {url: api.CATEGORIES, id: 'categoryId'},
}

export default class docCatagories extends Component {
    state={
        categoryData:[]
    }
    componentDidMount(){
        http.get(diffObj[this.props.mark].url).then((res)=>{
            const data= res.data || {}
            const {message,code}= data
            if(code === 0 ){
                this.setState({categoryData: toJS(data.data)})
            }else {
                message.error(message)
            }
        })
    }

    showCatagoriesAll = () =>{
        const {categoryData} = this.state
        return (categoryData && categoryData.length >0  && categoryData.map((item,index)=>{
            return (
                <Option value={item.id} key={index}>{item.name}</Option>
            )
        }))
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return (
            <Col span={6}>
                <Item>
                    {getFieldDecorator(diffObj[this.props.mark].id, {
                        rules: [
                            {
                                required: true,
                                message: '请选择文档状态'
                            }
                        ]
                    })(
                        <Select style={{ width: 180 }} onChange={this.props.handleCurrencyChange}>
                            {this.showCatagoriesAll()}
                        </Select>
                    )}
                </Item>
            </Col>
        )
    }
}
