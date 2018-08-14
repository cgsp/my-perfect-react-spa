import React, {Component} from 'react'
import './style.scss'
import Editor from '../../../components/Editor'
import { inject, observer } from 'mobx-react'
import {Link} from 'react-router-dom'
import api, {http} from '../../../service'
import {getQsByName} from '../../../utils'
import {toJS} from 'mobx'
import {sessionCache} from '../../../utils/cache'
import {
    Breadcrumb,
    Form,
    Input,
    InputNumber,
    Radio,
    Cascader,
    Button,
    message
} from 'antd'
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
export default class HelpEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            singleEditData: {},
            helpSecMaxOrderNum:1,
            showValue: 0,
            confirmStatus: false,
        }
        this.qaId = getQsByName('qaId')
    }

    componentWillMount() {
        if (!this.qaId) {
            message.error('qaId不能为空')
            return
        }
        this.qaId && this.searchAndShow(this.qaId)
    }

    searchAndShow = (keyword) => {
        http.get(`${api.HELPCENTERQA}/${keyword}`).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code === 0){
                this.setState({
                    singleEditData: toJS(data.data),
                    helpSecMaxOrderNum: toJS(data.data).orderNum
                })
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    getCategoryId = (categoryIdArr) => {
        if (categoryIdArr && categoryIdArr.length > 0) {
            categoryIdArr = categoryIdArr[categoryIdArr.length - 1]
            return categoryIdArr
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            values.categoryId = this.getCategoryId(values.categoryId)
            const {question, categoryId, orderNum, onlineStatus, answer} = values

            if(question && categoryId && orderNum && (onlineStatus===0 || onlineStatus===1) && answer){
                this.setState({confirmStatus: true})
                this.updateHelpConData(this.qaId,values)
            }
        })
    }

    updateHelpConData = (key,params) =>{

        http.put(`${api.HELPCENTERQA}/${key}`, params).then((res)=>{
           const data = res.data || {}
           const {code, message}=data
           if(code === 0){
               message.success('编辑成功')
               this.props.history.push('/help/content')
           } else {
               message.error( message )
               this.setState({confirmStatus: false})
           }
        }).catch((error)=>{
            console.log( error )
            this.setState({confirmStatus: false})
        })
    }

    gotoDocHelp = ()=>{
        this.props.history.push('/help/content')
    }

    getCategoryId = (categoryIdArr) =>{
        if(categoryIdArr && categoryIdArr.length>0){
            categoryIdArr = categoryIdArr[categoryIdArr.length-1]
            return categoryIdArr
        }
    }

    getIteminfo=(id)=>{
        const category_id = this.getCategoryId(id)
        category_id && this.fetchSecMaxOrderNum({category_id})
    }

    fetchSecMaxOrderNum = (params) =>{
        http.get(api.QAMAXORDERNUMCON,params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code === 0){
                this.setState({helpSecMaxOrderNum: data.data})
                message.warning('请重新选择问题序号')
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }





    render() {
        const {getFieldDecorator} = this.props.form
        const {singleEditData, helpSecMaxOrderNum, confirmStatus} = this.state
        const treeCategory = sessionCache.get('treeCategory') || []

        if (!(singleEditData && Object.keys(singleEditData).length > 0)) {
            return null
        }

        console.log('singleEditData',singleEditData)
        return (
            <div className="help-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/help/content">帮助问题列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>编辑问题内容</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="help-edit-form" onSubmit={this.handleSubmit}>
                    <Item>
                        <h3>编辑问题内容</h3>
                    </Item>
                    <Item {...formLayout} label="问题标题">
                        {getFieldDecorator('question', {
                            initialValue: singleEditData.question,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入问题标题'
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
                                    type: 'array',
                                    required: true,
                                    message: '请选择所属分类'
                                }
                            ]
                        })(
                            <Cascader options = {treeCategory}
                                      onChange = {this.getIteminfo}
                                      style = {{width: 200}}
                                      defaultValue = {[singleEditData.parentId, singleEditData.categoryId]}
                            />
                        )}
                    </FormItem>


                    <Item {...formLayout} label="问题序号">
                        {getFieldDecorator('orderNum', {
                            initialValue: helpSecMaxOrderNum ? helpSecMaxOrderNum : 1,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择问题序号'
                                }
                            ]
                        })(<InputNumber min={1} max={helpSecMaxOrderNum === 0 ? 1 : helpSecMaxOrderNum}/>)}
                    </Item>
                    <Item {...formLayout} label="状态">
                        {getFieldDecorator('onlineStatus', {
                            initialValue: singleEditData.onlineStatus,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择状态'
                                }
                            ]
                        })(
                            <Radio.Group>
                                <Radio value={1}>上线</Radio>
                                <Radio value={0}>下线</Radio>
                            </Radio.Group>
                        )}
                    </Item>
                    <Item {...editorFormLayout} label="解答内容">
                        {getFieldDecorator('answer', {
                            initialValue: singleEditData.answer,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写解答内容'
                                }
                            ]
                        })(<Editor setFieldsValue = {singleEditData.answer}/>)}
                    </Item>
                    <div className="button">
                        <Button type="primary" htmlType="submit" className="buttonLen" disabled = {confirmStatus}>
                            保存
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
