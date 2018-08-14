import React, { Component } from 'react'
import './style.scss'
import { Button, Table, Modal,message } from 'antd'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import ConFormSearch from '../../../components/DocContent'
import api, {http} from './../../../service'
import {sessionCache} from '../../../utils/cache'
import {getQsByName} from '../../../utils'

@inject('docContent','catagories')
@observer
export default class DocContent extends Component {
    state = {
        removeConfirmVisiable: false,
        deleteConfirmVisiable: false
    }
    rowSelectionKeys = []
    rowSelectionIds = []
    serchCondition = {
        category_id: '所属分类',
        title: '',
        online_status: '请选择状态'
    }
    defaultPage_no = 1

    componentWillMount(){
        // TODO: 所属分类
        this.props.docContent.fetchCatagoriesAll()

    }
    componentDidMount() {
        // TODO:获取内容文档列表
        const formPage = getQsByName('fromPage')
        if (formPage == 'childPage') {
            const params = sessionCache.get('doc_value') || {}
            params.page_size = 10
            params.page_no = params.page_no || 1
            this.serchCondition.category_id = params.category_id
            this.serchCondition.title = params.title
            this.serchCondition.online_status = params.online_status
            this.defaultPage_no = params.page_no
            this.props.docContent.fetchDocContentData(params)
        } else {
            sessionCache.remove('doc_value')
            this.props.docContent.fetchDocContentData({page_no: 1, page_size: 10})
        }
        window.onunload = function () {
            sessionCache.remove('doc_value')
        }
    }

    fetchDocContentId = (value)=>{
        let catagoryIdArr=[]
        value.map((item,index)=>{
            catagoryIdArr.push(item.id)
        })
        return catagoryIdArr
    }

    handleRowSelectionChange = (e, value)=> {
        console.log('value zxzx',e, value)
        this.rowSelectionKeys = e
        this.rowSelectionIds=this.fetchDocContentId(value)
    }
    handleEdit = (record) => {
        this.props.history.replace(`/developerDoc/edit_${record.key}?docId=${record.id}`)
    }
    handleContentRemove = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true
            })
        }
    }

    handleContentDelete = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                deleteConfirmVisiable: true
            })
        }
    }

    handleDeleteConfirmOk = () => {
        // TODO: 执行删除操作 然后执行查询操作
        this.removeAndDelDocItem(this.rowSelectionIds, api.DOCDELETE, 'delect')
    }


    closeDeleteConfirm = () => {
        this.setState({
            deleteConfirmVisiable: false
        })
    }

    handleRemoveConfirmOk = () => {
        this.removeAndDelDocItem(this.rowSelectionIds, api.DOCOFFLINE, 'remove')
    }

    removeAndDelDocItem = (reqParams,url, mark) =>{
        http.put(url, reqParams).then((res)=>{
            const data = res.data || {}
            const {code, message} = data
            if (code === 0) {
                {mark === 'delect' ? this.closeDeleteConfirm() : this.closeRemoveConfirm()}
                this.handleDodropCallback()
            }else{
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    closeRemoveConfirm = () => {
        this.setState({
            removeConfirmVisiable: false
        })
    }

    // TODO: 创建
    createDocContent = () =>{
        this.props.history.push(`/developerDoc/Create`)
    }

    // TOdo:上移和下移
    handleUpAndDownMove = (itemInfo,isUpAndDown) =>{
        this.fetchDocMaxOrderNum(itemInfo,isUpAndDown)
    }

    fetchDocMaxOrderNum(itemInfo,isUpAndDown) {
        http.get(api.MAXDOCORDERNUM, {category_id: itemInfo.categoryId}).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code===0){
                const maxOrderNum = data.data
                if(itemInfo.orderNum===1 && isUpAndDown === 'up'){
                    message.warning('该分类已是所属分类下的第一序号，无法上移')
                    return
                }

                if(itemInfo.orderNum===maxOrderNum && isUpAndDown === 'down'){
                    message.warning('该分类已是所属分类下的最后一个序号，无法下移')
                    return
                }

                const editData = {
                    categoryId:itemInfo.categoryId,
                    orderNum:isUpAndDown === 'up' ? Number(itemInfo.orderNum)-1 : Number(itemInfo.orderNum)+1,
                    onlineStatus:itemInfo.onlineStatus,
                    title: itemInfo.title,
                    content: itemInfo.content,
                }
                this.props.docContent.editModeOk(itemInfo.id, editData, this.handleDodropCallback)
            }else{
                message.error(message)
            }
        }).catch ((e)=>{
           console.log(e)
        })
    }


    handlePageChange = page => {
        console.log(page)
        let params = sessionCache.get('doc_value') || {}
        params.page_no = page
        params.page_size = 10
        sessionCache.put('doc_value', params)
        this.props.docContent.fetchDocContentData(params)
    }
    handleAddColor = (str='') =>{
       let reg1 = /(已下线)/,
           reg2 = /(已上线)/,
           strArr = []

       if (reg1.test(str) || reg2.test(str)) {
           strArr = str.split('(')

           return strArr
       }
       strArr.push(str)
       return  strArr
    }

    handleDodropCallback = () => {
        const params = sessionCache.get('doc_value')
        this.props.docContent.fetchDocContentData(params)
    }

    render() {
        const context = this
        const {deleteConfirmVisiable,removeConfirmVisiable } = this.state
        const {data, cataList} = toJS(this.props.docContent)
        const {dataList,totalNum, currentPage} =data
        const { handleContentRemove,handleContentDelete,
            handleDeleteConfirmOk,handleRemoveConfirmOk,
            closeRemoveConfirm, createDocContent,
            handlePageChange,closeDeleteConfirm
        } = this
        const rowSelection = {

            onChange: this.handleRowSelectionChange
        }
        const columns = [
            {
                width: 150,
                dataIndex: 'title',
                title: '文档标题'
            },
            {
                width: 150,
                dataIndex: 'categoryName',
                title: '所属文档分类',
                render(status){
                    let strArr = context.handleAddColor(status)
                    return [
                        <span key="1">{strArr[0]}</span>,
                        <span key="2" style={{color: 'red'}}>{strArr[1] && `(${ strArr[1]}`}</span>
                    ]
                }
            },
            {
                align: 'center',
                width: 100,
                dataIndex: 'orderNum',
                title: '序号'
            },
            {
                width: 100,
                dataIndex: 'onlineStatus',
                title: '状态',
                render(text) {
                    const statusMap = {
                        1: '上线',
                        0: '下线'
                    }
                    return statusMap[text]
                }
            },
            {
                align: 'center',
                width: 140,
                dataIndex: 'lastOperatorName',
                title: '最后操作人'
            },
            {
                width: 150,
                dataIndex: 'createdTime',
                title: '创建时间'
            },
            {
                width: 150,
                dataIndex: 'updatedTime',
                title: '最后操作时间'
            },
            {
                key: 'action',
                width: 120,
                title: '操作',
                render(_, record,index) {
                    return [
                        <div key="1" style={{ marginBottom: 4 }}>
                            <a onClick={() => context.handleUpAndDownMove(record,'up')}>上移</a>
                            <a onClick={() => context.handleUpAndDownMove(record,'down')}>下移</a>
                        </div>,
                        <div key="2">
                            <a onClick={() => context.handleEdit(record,index)}>编辑</a>
                        </div>
                    ]
                }
            }
        ]

        return (
            <div className="docContent-container">
                <div className="doc-cata">文档内容</div>
                <ConFormSearch serchCondition={this.serchCondition} data = {cataList} currentPage = {currentPage}/>
                <div className="action-container">
                    <Button type="primary" onClick={createDocContent}>创建</Button>
                    <Button type="danger" onClick={handleContentDelete}>
                        删除
                    </Button>
                    <Button onClick={handleContentRemove}>下线</Button>
                </div>
                <Table className="table" rowSelection={rowSelection} columns={columns} dataSource={dataList}
                       pagination={{
                           total: totalNum,
                           onChange: handlePageChange,
                           defaultCurrent: this.defaultPage_no || 1
                       }}
                />
                <Modal
                    className="docContent-remove-confirm"
                    title="删除文档问题"
                    visible={deleteConfirmVisiable}
                    okType="danger"
                    onOk={handleDeleteConfirmOk}
                    onCancel={closeDeleteConfirm}
                >
                    确认删除该文档内容么？
                </Modal>
                <Modal
                    className="docContent-remove-confirm"
                    title="下线文档问题"
                    visible={removeConfirmVisiable}
                    okType="danger"
                    onOk={handleRemoveConfirmOk}
                    onCancel={closeRemoveConfirm}
                >
                    确认下线该文档内容么？
                </Modal>
            </div>
        )
    }
}
