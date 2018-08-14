import React, { Component } from 'react'
import './style.scss'
import Editor from '../../../components/Editor'
import { inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import {
    Breadcrumb,
    Form,
    Input,
    Button,
    message
} from 'antd'
import api, {http} from './../../../service'
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

@inject('announcement')
@Form.create({})
export default class AnnounceCreate extends Component {
    state = {
        confirmStatus: false
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            const {title, content} = values
            if(title && content){
                this.setState({confirmStatus: true})
                this.createAnnouncement(values)
            }
        })
    }

    createAnnouncement = (params) =>{
        http.post(api.BULLETIN, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code === 0) {
                message.success('创建成功')
                this.props.announcement.fetchAnnounceData()
                this.props.history.push('/announcement/index')
            }else {
                this.setState({confirmStatus: false})
                message.error(message)
            }
        }).catch((error)=>{
            this.setState({confirmStatus: false})
            console.log(error)
        })
    }
    gotoDocAnnounce = ()=>{
        this.props.history.push('/announcement/index')
    }

    gotoAnnounceIndex = () => {
        this.props.history.push('/announcement/index')
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="help-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/announcement/index">平台公告列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>创建公告</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="help-edit-form" onSubmit={this.handleSubmit}>
                    <Item>
                        <h3>创建公告</h3>
                    </Item>
                    <Item {...formLayout} label="公告标题">
                        {getFieldDecorator('title', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入公告标题'
                                }
                            ]
                        })(<Input placeholder="请输入公告标题" autoComplete="off"/>)}
                    </Item>
                    <Item {...editorFormLayout} label="文档内容">
                        {getFieldDecorator('content', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入文档内容'
                                }
                            ]
                        })(<Editor />)}
                    </Item>
                    <div className="button">
                        <Button type="primary" htmlType="submit" className="buttonLen" disabled = {this.state.confirmStatus}>
                            创建
                        </Button>
                        <Button type="primary" ghost onClick={this.gotoAnnounceIndex}>
                            取消
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}
