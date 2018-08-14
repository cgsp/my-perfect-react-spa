import React, {Component} from 'react'
import {Form, Input, Button, Table, Modal, message} from 'antd'
import './style.scss'
import {inject, observer} from 'mobx-react'
import {toJS} from 'mobx'
import AnnounceFormSearch from '../../components/Announcement/Search'
import api, {http} from './../../service'
const {Item} = Form


@inject('announcement')
@observer
export default class AnnounceMent extends Component {
    state = {
        deleteConfirmVisiable: false
    }
    rowSelectionKeys = []
    rowSelectionIds = []

    componentDidMount() {
        // TODO:获取内容文档列表
        this.props.announcement.fetchAnnounceData({page_no: 1, page_size: 10})
    }

    fetchDocContentId = (value) => {
        let catagoryIdArr = []
        value.map((item, index) => {
            catagoryIdArr.push(item.id)
        })
        return catagoryIdArr
    }

    handleRowSelectionChange = (e, value) => {
        console.log('value zxzx',e, value)
        this.rowSelectionKeys = e
        this.rowSelectionIds = this.fetchDocContentId(value)
    }
    handleEdit = (record) => {
        console.log(record)
        this.props.history.replace(`/announcement/edit_${record.key}?bulletinId=${record.id}`)
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
        this.deleteAnnouncement(this.rowSelectionIds)
    }

    deleteAnnouncement = (params) =>{
        http.put(api.BULLETINDELETE, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code===0) {
                this.closeDeleteConfirm()
                this.props.announcement.fetchAnnounceData()
            }else{
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    closeDeleteConfirm = () => {
        this.setState({
            deleteConfirmVisiable: false
        })
    }


    closeRemoveConfirm = () => {
        this.setState({
            deleteConfirmVisiable: false
        })
    }

    // TODO: 创建
    createDocContent = () => {
        console.log('创建页面')
        this.props.history.push(`/announcement/Create`)
    }

    handlePageChange = page => {
        console.log(page)
        this.props.announcement.fetchAnnounceData({page_no: page, page_size: 10 })
    }

    render() {
        const context = this
        const {deleteConfirmVisiable} = this.state
        let {data} = this.props.announcement
        data = toJS(data)
        const {dataList, totalNum, currentPage} =data
        const {handleContentDelete, handleDeleteConfirmOk, closeRemoveConfirm, createDocContent, handlePageChange} = this
        const rowSelection = {
            onChange: this.handleRowSelectionChange
        }
        const columns = [
            {
                width: 200,
                dataIndex: 'title',
                title: '公告标题'
            },
            {
                align: 'center',
                width: 140,
                dataIndex: 'lastOperatorName',
                title: '最后操作人'
            },
            {
                width: 200,
                dataIndex: 'createdTime',
                title: '创建时间'
            },
            {
                width: 200,
                dataIndex: 'updatedTime',
                title: '最后操作时间'
            },
            {
                key: 'action',
                width: 120,
                title: '操作',
                render(_, record, index) {
                    return [
                        <div key="1">
                            <a onClick={() => context.handleEdit(record, index)}>编辑</a>
                        </div>
                    ]
                }
            }
        ]

        return (
            <div className="help-content-container">
                <p className="announce-title">平台公告</p>
                <AnnounceFormSearch currentPage={currentPage}/>
                <div className="action-container">
                    <Button type="primary" onClick={createDocContent}>创建</Button>
                    <Button type="danger" onClick={handleContentDelete}>
                        删除
                    </Button>
                </div>
                <Table className="table"
                       rowSelection={rowSelection}
                       columns={columns}
                       dataSource={dataList}
                       pagination={{
                           total: totalNum,
                           onChange: handlePageChange
                       }}
                />
                <Modal
                    className="help-center-remove-confirm"
                    title="删除平台公告"
                    visible={deleteConfirmVisiable}
                    okType="danger"
                    onOk={handleDeleteConfirmOk}
                    onCancel={closeRemoveConfirm}
                >
                    确认删除该平台公告么？
                </Modal>

            </div>
        )
    }
}
