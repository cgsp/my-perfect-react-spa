import React, {Component} from 'react'
import './style.scss'
import { Select, Button, Table, Modal, message} from 'antd'
import {inject, observer} from 'mobx-react'
import {toJS} from 'mobx'
import {sessionCache} from '../../../utils/cache'
import {formatAddress} from '../../../utils/index'
import ConFormSearch from '../../../components/HelpContent/Search'

@inject('helpContent', 'helpTop')
@observer
export default class HelpContent extends Component {
    state = {
        idDeleteModel: false,
        removeConfirmVisiable: false,
        parentId: 0,
    }

    componentWillMount() {
        this.props.helpContent.fetchHelpConData({page_no: 1, page_size: 10 })
    }

    rowSelectionKeys = []
    rowSelectionIds = []

    // TOdo:上移和下移
    handleUpAndDownMove = (itemInfo,isUpAndDown) =>{
        this.props.helpContent.fetchMaxOrderNum({category_id: itemInfo.categoryId}).then(()=>{
            const {helpMaxOrderNum} = this.props.helpContent
            if(itemInfo.orderNum===1 && isUpAndDown === 'up'){
                message.warning('已是所属二级分类下的第一序号，无法上移')
                return
            }
            if(itemInfo.orderNum===helpMaxOrderNum && isUpAndDown === 'down'){
                message.warning('已是所属二级分类下的最后一个序号，无法下移')
                return
            }
           const updateData= {
                question:itemInfo.question,
                categoryId:itemInfo.categoryId,
                orderNum:isUpAndDown === 'up' ? Number(itemInfo.orderNum)-1 : Number(itemInfo.orderNum)+1,
                onlineStatus:itemInfo.onlineStatus,
                answer: itemInfo.answer,
            }
            this.props.helpContent.updateHelpConData(itemInfo.id,updateData)
        })
    }

    fetchDocContentId = (value)=>{
        let catagoryIdArr=[]
        value.map((item,index)=>{
            catagoryIdArr.push(item.id)
        })
        return catagoryIdArr
    }

    handleRowSelectionChange = (e, value)=> {
        this.rowSelectionKeys = e
        this.rowSelectionIds=this.fetchDocContentId(value)
    }
    handleEdit = record => {
        console.log(record)
        this.props.history.push(`/help/edit_${record.key}?qaId=${record.id}`)
    }

    handleContentCreate = ()=>{
        this.props.history.push(`/help/Create`)
    }

    handleContentRemove = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true,
                idDeleteModel: false,
            })
        }
    }

    handleContentDelete = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true,
                idDeleteModel: true,
            })
        }
    }

    handleRemoveConfirmOk = () => {
        console.log(this.rowSelectionIds)
        this.closeRemoveConfirm()
        if(this.state.idDeleteModel){
            // TODO: 执行删除操作
            this.props.helpContent.deleteHelpConData(this.rowSelectionIds)
        }else{
            // TODO: 执行下线操作
            this.props.helpContent.offlineHelpConData(this.rowSelectionIds)
        }
    }

    closeRemoveConfirm = () => {
        this.setState({
            removeConfirmVisiable: false
        })
    }

    handlePageChange = page => {
        this.props.helpContent.fetchHelpConData({page_no: page, page_size: 10 })
    }

    render() {
        const context = this
        const {removeConfirmVisiable,idDeleteModel} = this.state
        const {handleContentRemove,
            handleContentDelete,
            handleRemoveConfirmOk,
            closeRemoveConfirm,
            handleContentCreate,
            handlePageChange
        } = this
        const {data} = toJS(this.props.helpContent)
        const {dataList, totalNum, currentPage} = data
        const rowSelection = {
            onChange: this.handleRowSelectionChange
        }
        const columns = [
            {
                align: 'center',
                width: 200,
                dataIndex: 'question',
                title: '问题标题'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'helpCate',
                title: '所属帮助分类'
            },
            {
                align: 'center',
                width: 100,
                dataIndex: 'orderNum',
                title: '序号'
            },
            {
                align: 'center',
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
                width: 200,
                dataIndex: 'createdTime',
                title: '创建时间',
                align: 'center',
            },
            {
                width: 200,
                dataIndex: 'updatedTime',
                title: '最后操作时间',
                align: 'center',
            },
            {   align: 'center',
                key: 'action',
                width: 120,
                title: '操作',
                render(_, record) {
                    return [
                        <div key="1" style={{marginBottom: 4}}>
                            <a onClick={() => context.handleUpAndDownMove(record,'up')}>上移</a>
                            <a onClick={() => context.handleUpAndDownMove(record,'down')}>下移</a>
                        </div>,
                        <div key="2">
                            <a onClick={() => context.handleEdit(record)}>编辑</a>
                        </div>
                    ]
                }
            }
        ]

        return (
            <div className="help-content-container">
                <div className="help-top">帮助内容</div>
                <ConFormSearch  currentPage= {currentPage}/>
                <div className="action-container">
                    <Button type="primary" onClick={handleContentCreate}>创建</Button>
                    <Button type="danger" onClick={handleContentDelete}>
                        删除
                    </Button>
                    <Button onClick={handleContentRemove}>下线</Button>
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
                    title={idDeleteModel ? '删除帮助问题' : '下线帮助问题'}
                    visible={removeConfirmVisiable}
                    okType="danger"
                    onOk={handleRemoveConfirmOk}
                    onCancel={closeRemoveConfirm}
                >
                    {idDeleteModel ? '确认删除该帮助问题么？' : '确认下线该帮助问题么?'}
                </Modal>
            </div>
        )
    }
}
