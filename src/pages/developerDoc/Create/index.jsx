import React, { Component } from 'react'
import './style.scss'
import Editor from '../../../components/Editor'
import DocCatagories from '../../../components/DocCatagories'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import { Link } from 'react-router-dom'
import api, {http} from './../../../service'

import {timestampToTime} from './../../../utils'
import {
    Breadcrumb,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Col,
    Button,
    message,
} from 'antd'
const { Item } = Form
const formLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 10
    }
}

const editorFormLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 19
    }
}

@inject('docContent')
@Form.create({})
export default class Create extends Component {
    state={
        maxOrderNum: 1,
        confirmButton: false
    }
   handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            const { title,categoryId, onlineStatus,orderNum,content } = values
            const isCreateDoc = title && categoryId && (onlineStatus===0 || onlineStatus===1) && orderNum && content
            if(isCreateDoc){
                this.setState({confirmButton: true})
                this.confirmCreateDocData(values)
            }
        })
    }

    confirmCreateDocData=(params)=> {
        http.post(api.DEVELOPERSDOCS, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code===0){
                this.props.history.push('/developerDoc/DocContent')
                message.success('创建成功')
            }else{
                message.error(message)
                this.setState({confirmButton: false})
            }
        }).catch((error)=>{
            console.log(error)
            this.setState({confirmButton: false})
        })
    }


    handleCurrencyChange = (currency) =>{
        this.fetchDocMaxOrderNum({category_id: currency})
        message.warning('请重新选择文档序号')
    }

    fetchDocMaxOrderNum(params) {
        http.get(api.MAXDOCORDERNUM, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code===0){
                this.setState({maxOrderNum: data.data})
            }else{
                message.error(message)
            }

        }).catch ((e)=>{
            message.error(e)
        })
    }

    gotoDocContent = ()=>{
        this.props.history.push('/developerDoc/DocContent?fromPage=childPage')
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const {maxOrderNum, confirmButton} = this.state
        return (
            <div className="help-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/developerDoc/DocContent">文档内容列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>创建开发者文档</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="help-edit-form" onSubmit={this.handleSubmit}>
                    <Item>
                        <h3>创建开发者文档</h3>
                    </Item>
                    <Item {...formLayout} label="文档标题">
                        {getFieldDecorator('title', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入文档标题'
                                }
                            ]
                        })(<Input placeholder="请输入文档标题" autoComplete="off"/>)}
                    </Item>
                    <Row type="flex" align="middle">
                        <Col span={5} style={{ textAlign: 'right', marginBottom: 24 }}>
                            所属文档分类：
                        </Col>
                        <DocCatagories mark = "mainCategory" form={this.props.form} handleCurrencyChange = {this.handleCurrencyChange}/>
                    </Row>
                    <Item {...formLayout} label="状态">
                        {getFieldDecorator('onlineStatus', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择状态'
                                }
                            ]
                        })(
                            <Radio.Group>
                                <Radio value={1}>上线</Radio>
                                <Radio value={2}>下线</Radio>
                            </Radio.Group>
                        )}
                    </Item>
                    <Item {...formLayout} label="文档序号" help={`文档序号请在1到${maxOrderNum + 1}范围选择`}>
                        {getFieldDecorator('orderNum', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择文档序号'
                                }
                            ]
                        })( <InputNumber min = { 1 } max = { maxOrderNum + 1 } /> ) }
                    </Item>
                    <Item {...editorFormLayout} label="文档内容">
                        {getFieldDecorator('content', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请填写文档内容'
                                }
                            ]
                        })(<Editor />)}
                    </Item>
                    <div className="button">
                        <Button type="primary" htmlType="submit" className="buttonLen" disabled = {confirmButton}>
                           创建
                        </Button>
                        <Button type="primary" ghost onClick={this.gotoDocContent}>
                            取消
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}
