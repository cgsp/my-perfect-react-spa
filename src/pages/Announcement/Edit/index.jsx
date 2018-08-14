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
    Button,
    message
} from 'antd'
import {getQsByName} from '../../../utils'
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

@inject('announcement')
@Form.create({})
export default class AnnounceEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            catagoriesAll: [],
            singleEditData: {},
            confirmStatus: false,
        }
        this.bulletinId = getQsByName('bulletinId')
    }

    componentWillMount() {
        if (!this.bulletinId) {
            message.error('bulletinId不能为空')
            return
        }
        this.searchAndShow(this.bulletinId)
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            const { title, content} = values
            if(this.bulletinId && title && content){
                this.setState({confirmStatus: true})
                this.editAnnouncement(this.bulletinId, values)
            }
        })
    }

    editAnnouncement = (bulletinId,params) =>{
        http.put(`${api.BULLETIN}/${bulletinId}`, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code === 0) {
                message.success('编辑成功')
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

    gotoAnnounceIndex = () => {
        this.props.history.push('/announcement/index')
    }

    searchAndShow = async(keyword) => {
        try {
            keyword = `/${keyword}`
            const url = `${api.BULLETIN}${keyword}`
            const {data} = await http.get(url)
            const {code, message}=data
            if (code) throw message
            this.setState({
                singleEditData: toJS(data.data)
            })
        } catch (e) {
            message.error(e)
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {singleEditData} = this.state
        if (!(singleEditData && Object.keys(singleEditData).length > 0)) {
            return null
        }
        return (
            <div className="cata-edit-container">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/announcement/index">平台公告列表</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>编辑公告</Breadcrumb.Item>
                </Breadcrumb>
                <Form className="help-edit-form" onSubmit={this.handleSubmit}>
                    <Item>
                        <h3>编辑公告</h3>
                    </Item>
                    <Item {...formLayout} label="公告标题">
                        {getFieldDecorator('title', {
                            initialValue: singleEditData.title,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入公告标题'
                                }
                            ]
                        })(<Input placeholder="请输入文档标题" autoComplete="off"/>)}
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
                        <Button type="primary" htmlType="submit" style={{marginRight: 30}} disabled = {this.state.confirmStatus}>
                            保存
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
