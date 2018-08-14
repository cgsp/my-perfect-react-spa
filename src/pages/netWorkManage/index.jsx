import React, { Component } from 'react'
import './style.scss'
import { Form, Input, Select, Button, Table, Modal, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import NetFormSearch from '../../components/NetWorkManage/Search'
import api, {http} from './../../service'

@inject('netWorkManage')
@observer
export default class StationLetters extends Component {
    constructor(props){
        super(props)
        this.state = {
            letterConfirmVisiable: false,
            deleteConfirmVisiable: false,
            visible: false,
            title: '',
        }
        this.element = document.createElement('div')
    }

    componentWillMount(){
        // TODO: 所属分类
        this.props.netWorkManage.fetchLettersData()
    }

    handleEdit = (record) => {
        this.getContent(record.id)
    }

    getContent = (letterId) =>{
        http.get(`${api.LETTERS}/${letterId}`).then((res)=>{
            const data = res.data || {}
            const {code, message} = data
            if (code === 0) {
                const {content, title} = data.data
                this.setState({
                    letterConfirmVisiable: true,
                    title,
                })
                this.element.innerHTML = content
                document.getElementById('letterContent').appendChild(this.element)
            }else{
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    handleLetterConfirmOk = () => {
        this.setState({
            visible: false,
        })
    }

    closeLetterConfirm = () => {
        this.setState({
            letterConfirmVisiable: false
        })
    }

    handlePageChange = page => {
        this.props.netWorkManage.fetchLettersData({page_no: page, page_size: 10 })
    }

    render() {
        const context = this
        const {letterConfirmVisiable, title } = this.state
        let {data} = this.props.netWorkManage
        data = toJS(data)
        const {dataList, totalNum, currentPage } =data
        const { handleLetterConfirmOk, closeLetterConfirm, handlePageChange } = this

        const columns = [
            {
                width: 100,
                dataIndex: 'id',
                title: 'ID'
            },
            {
                width: 100,
                dataIndex: 'typeName',
                title: '站内信类型',
            },
            {
                align: 'center',
                width: 100,
                dataIndex: 'title',
                title: '站内信标题'
            },
            {
                align: 'center',
                width: 100,
                dataIndex: 'sendTime',
                title: '发送时间'
            },
            {
                align: 'center',
                width: 140,
                dataIndex: 'developerName',
                title: '开发者'
            },
            {
                width: 100,
                dataIndex: 'readStatus',
                title: '状态',
                render(text) {
                    const statusMap = {
                        0: '未读',
                        1: '已读',
                    }
                    return statusMap[text]
                }
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'readTime',
                title: '读取时间'
            },
            {
                align: 'center',
                key: 'action',
                width: 120,
                title: '操作',
                render(_, record,index) {
                    return [
                        <div key="1">
                            <a onClick={() => context.handleEdit(record,index)}>查看内容</a>
                        </div>
                    ]
                }
            }
        ]

        return (
            <div className="letter-content-container">
                <p className="letter-title">站内信管理</p>
                <NetFormSearch currentPage = {currentPage}/>
                <Table className="table"
                       columns={columns}
                       dataSource={dataList}
                       pagination={{
                           total: totalNum,
                           onChange: handlePageChange
                       }}
                />
                <Modal
                    className="letter-center-remove-confirm"
                    title='站内信内容'
                    visible={letterConfirmVisiable}
                    okType="danger"
                    onOk={handleLetterConfirmOk}
                    onCancel={closeLetterConfirm}
                    bodyStyle={{textAlign: 'center'}}
                >
                    <p style={{marginBottom: 20}}>{title}</p>
                    <div id="letterContent"></div>
                </Modal>
            </div>
        )
    }
}
