import React, {Component} from 'react'
import './style.scss'
import Editor from '../../../components/Editor'
import {Link} from 'react-router-dom'
import {inject} from 'mobx-react'
import api, {http} from '../../../service'
import {toJS} from 'mobx'
import {
    Breadcrumb,
    Form,
    Input,
    Select,
    InputNumber,
    Radio,
    Row,
    Col,
    Button,
    message
} from 'antd'
import {getQsByName} from '../../../utils'
const {Option} = Select
const {Item} = Form
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
export default class DocConentEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            catagoriesAll: [],
            singleEditData: {},
            maxOrderNum: 1,
            confirmButton: false
        }
        this.docId = getQsByName('docId')
        if (!this.docId) {
            message.error('docId不能为空')
            return
        }

    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            const {categoryId, orderNum, title,onlineStatus, content} = values
            if(this.docId && categoryId && orderNum && title && (onlineStatus===0 || onlineStatus===1) && content){
                this.setState({confirmButton: true})
                this.updateDocContent(this.docId, values)
            }

        })
    }

    updateDocContent=(keyword, params)=> {
        http.put(`${api.DEVELOPERSDOCS}/${keyword}`, params).then((res)=>{
               const data= res.data || {}
            const {code, message}=data
            if (code===0) {
                this.props.history.push('/developerDoc/DocContent')
            }else{
                this.setState({confirmButton: false})
                message.error(message)
            }
           }).catch((error)=>{
                this.setState({confirmButton: false})
               console.log(error)
           })
    }

    gotoDocContent = () => {
        this.props.history.push('/developerDoc/DocContent?fromPage=childPage')
    }

    componentWillMount() {
        this.docId && this.searchAndShow(this.docId)
    }

    searchAndShow = (keyword) => {
        http.get(`${api.DEVELOPERSDOCS}/${keyword}`).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code === 0){
                const editData = toJS(data.data) || {}
                this.fetchDocMaxOrderNum({category_id: editData.categoryId})
                this.setState({
                    singleEditData: editData
                })
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }


    componentDidMount() {
        this.fetchCatagoriesAll()
        const {maxOrderNum} = toJS(this.props.docContent)
    }

    fetchCatagoriesAll = () => {
        http.get(api.CATEGORIES).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code === 0) {
                this.setState({
                    catagoriesAll: data.data
                })
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    showCatagoriesAll = () => {
        const catagoriesAll = this.state.catagoriesAll
        return (catagoriesAll && catagoriesAll.length > 0 && catagoriesAll.map((item, index) => {
            return (
                <Option value={item.id} className='test' key={item.id}>{item.name}</Option>
            )
        }))
    }

    tipsFunc = (currency) =>{
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

    render() {
        const {getFieldDecorator} = this.props.form
        const {singleEditData, maxOrderNum, confirmButton} = this.state
        if (!(singleEditData && Object.keys(singleEditData).length > 0)) {
            return null
        }
        return (
            <div className="cata-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/help/content">文档内容列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>编辑开发者文档</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="help-edit-form" onSubmit={this.handleSubmit}>
                    <Item>
                        <h3>编辑开发者文档</h3>
                    </Item>
                    <Item {...formLayout} label="文档标题">
                        {getFieldDecorator('title', {
                            initialValue: singleEditData.title,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入文档标题'
                                }
                            ]
                        })(<Input placeholder="请输入文档标题" autoComplete="off"/>)}
                    </Item>
                    <Row type="flex" align="middle">
                        <Col span={5} style={{textAlign: 'right', marginBottom: 24}}>
                            所属文档分类：
                        </Col>
                        <Col span={6}>
                            <Item>
                                {getFieldDecorator('categoryId', {
                                    initialValue: singleEditData.categoryId,
                                    rules: [
                                        {
                                            required: true,

                                        }
                                    ]
                                })(
                                    <Select placeholder="请选择文档分类" style={{width: '60%'}} onChange={this.tipsFunc}>
                                        {this.showCatagoriesAll()}
                                    </Select>
                                )}
                            </Item>
                        </Col>
                    </Row>

                    <Item {...formLayout} label="状态">
                        {getFieldDecorator('onlineStatus', {
                            initialValue: singleEditData.onlineStatus,
                            rules: [
                                {
                                    required: true
                                }
                            ]
                        })(
                            <Radio.Group>
                                <Radio value={1}>上线</Radio>
                                <Radio value={0}>下线</Radio>
                            </Radio.Group>
                        )}
                    </Item>
                    <Item {...formLayout} label="文档序号"   help={maxOrderNum ? `请在1到${maxOrderNum}之间选择` : ''}>
                        {getFieldDecorator('orderNum', {
                            initialValue: singleEditData.orderNum,
                            rules: [
                                {
                                    required: true,
                                    message:''
                                }
                            ]
                        })(<InputNumber min={1} max={maxOrderNum}/>)}
                    </Item>
                    <Item {...editorFormLayout} label="文档内容">
                        {getFieldDecorator('content', {
                            initialValue: singleEditData.content,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入文档内容'
                                }
                            ]
                        })(<Editor setFieldsValue={singleEditData.content}/>)}
                    </Item>
                    <div className="button">
                        <Button type="primary" htmlType="submit" style={{marginRight: 30}} disabled = {confirmButton}>
                            保存
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
