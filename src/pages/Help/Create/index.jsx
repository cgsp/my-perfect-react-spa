import React, {Component} from 'react'
import './style.scss'
import Editor from '../../../components/Editor'
import {inject, observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import {sessionCache} from '../../../utils/cache'
import {
    Breadcrumb,
    Form,
    Input,
    InputNumber,
    Radio,
    Button,
    Cascader,
    message
} from 'antd'
import api, {http} from './../../../service'
import {toJS} from 'mobx'
const {Item} = Form
const FormItem = Form.Item
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

@inject('helpContent')
@observer
@Form.create({})
export default class HelpCreate extends Component {
    state = {
        confirmStatus: false
    }

    getCategoryId = (categoryIdArr) => {
        if (categoryIdArr && categoryIdArr.length > 0) {
            categoryIdArr = categoryIdArr[categoryIdArr.length - 1]
            return categoryIdArr
        }
    }

    getIteminfo = (id, info) => {
        const category_id = this.getCategoryId(id)
        category_id && this.props.helpContent.fetchMaxOrderNum({category_id})
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            values.categoryId = this.getCategoryId(values.categoryId)
            const {question, categoryId, orderNum, onlineStatus, answer} = values
            if(question && categoryId && orderNum && onlineStatus && answer){
                this.setState({confirmStatus: true})
                this.confirmCreateHelpCon(values)
            }
        })
    }

    confirmCreateHelpCon = (params) =>{
        http.post(api.HELPCENTERQA, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code === 0){
                this.props.history.push('/help/content')
            }else {
                this.setState({confirmStatus: false})
                message.error(message)
            }
        }).catch((error)=>{
            this.setState({confirmStatus: false})
            console.log(error)
        })
    }


    gotoDocHelp = () => {
        this.props.history.push('/help/content')
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const treeCategory = sessionCache.get('treeCategory') || []
        const {helpMaxOrderNum} = toJS(this.props.helpContent)
        return (
            <div className="help-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/help/content">帮助问题列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>创建问题内容</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="help-edit-form" onSubmit={this.handleSubmit}>
                    <Item>
                        <h3>创建问题内容</h3>
                    </Item>
                    <Item {...formLayout} label="问题标题">
                        {getFieldDecorator('question', {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写问题标题'
                                }
                            ]
                        })(<Input placeholder="请输入问题标题" autoComplete="off"/>)}
                    </Item>

                    <FormItem
                        {...formLayout}
                        label="所属分类"
                    >
                        {getFieldDecorator('categoryId', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择问题分类'
                                }
                            ]
                        })(
                            <Cascader options={treeCategory} placeholder="请选择一级和二级分类" onChange={this.getIteminfo}
                                      style={{width: 200}} />
                        )}
                    </FormItem>

                    <Item {...formLayout} label="问题序号">
                        {getFieldDecorator('orderNum', {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写问题序号'
                                }
                            ]
                        })(<InputNumber min={1} max={helpMaxOrderNum + 1}/>)}
                    </Item>
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

                    <Item {...editorFormLayout} label="解答内容">
                        {getFieldDecorator('answer', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message:'请填写解答内容'

                                }
                            ]
                        })(<Editor />)}
                    </Item>
                    <div className="button">
                        <Button type="primary" htmlType="submit" className="buttonLen" disabled = {this.state.confirmStatus}>
                            创建
                        </Button>
                        <Button type="primary" ghost onClick={this.gotoDocHelp}>
                            取消
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}
