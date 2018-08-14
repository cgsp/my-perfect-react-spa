import React, { Component } from 'react'
import { Button, Table, Modal } from 'antd'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './style.scss'

@inject('userManages')
@observer
export default class UserManages extends Component {
    state = {
        confirmVisiable: false,
        deleteConfirmVisiable: false
    }

    componentDidMount() {
        // TODO:获取内容文档列表
        this.props.userManages.fetchUsersInfo()

    }

    rowSelectionKeys = []
    rowSelectionIds = []

    handleEdit = (record) => {
        this.props.history.replace(`/announcement/edit_${record.key}?bulletinId=${record.id}`)
    }
    handleContentRemove = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                confirmVisiable: true
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
        this.closeDeleteConfirm()
        this.props.announcement.deleteAnnouncement(this.rowSelectionIds)
    }

    closeDeleteConfirm = () => {
        this.setState({
            deleteConfirmVisiable: false
        })
    }


    closeRemoveConfirm = () => {
        this.setState({
            confirmVisiable: false
        })
    }

    // TODO: 创建
    createUser = () =>{
        this.setState({confirmVisiable: true})
    }



    render() {
        const context = this
        const {deleteConfirmVisiable } = this.state
        let {data} = this.props.userManages
        data = toJS(data)
        const {dataList} =data
        const { createUser, handleDeleteConfirmOk, closeRemoveConfirm } = this
        const columns = [
            {
                width: 200,
                dataIndex: 'title',
                title: '用户名'
            },
            {
                align: 'center',
                width: 300,
                dataIndex: 'lastOperatorName',
                title: '角色'
            },
            {
                align: 'center',
                key: 'action',
                width: 50,
                title: '操作',
                render(_, record,index) {
                    return [
                        <div key="1">
                            <a style = {{marginRight:10}} onClick={() => context.handleEdit(record,index)}>编辑</a>
                            <a>删除</a>
                        </div>
                    ]
                }
            }
        ]

        return (
            <div className="help-content-container">
                <p className="user-title">用户管理</p>
                <div className="action-container">
                    <Button type="primary" onClick={createUser}>新增用户</Button>
                </div>
                <Table className="table" columns={columns} dataSource={dataList} />
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
