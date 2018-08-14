import React, {Component} from 'react'
import './style.scss'
import {
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import CatagoryFormSearch from '../../../components/Catagory/Search'
import AddAndEditForm from '../../../components/Catagory/AddAndEditForm'
import api, {http} from './../../../service'
import {sessionCache} from './../../../utils/cache'

@inject('catagories')
@observer
export default class Catagories extends Component {
    state = {
        removeConfirmVisiable: false,
        contentModalVisiable: false,
        isAddContentModel: false,
        // TODO: 弹窗出现内容为下线操作
        isRemoveMode: false,
        catagoryId: 0,
        editData: {
            categoryName:'',
            orderNum:0,
            onlineStatus:0
        },
        confirmButton: false,

    }

    componentDidMount() {
        this.props.catagories.fetchCatagoriesData()
        this.props.catagories.fetchMaxOrderNum()
        sessionCache.remove('catagories_value')
    }
    rowSelectionKeys = []
    rowSelectionIds=[]


    fetchCatagoryId = (value)=>{
        let catagoryIdArr=[]
        value.map((item,index)=>{
            catagoryIdArr.push(item.id)
        })
        return catagoryIdArr
    }

    handleRowSelectionChange = (e,value) => {
        console.log('value zxzx',e, value)
        this.rowSelectionKeys = e
        this.rowSelectionIds=this.fetchCatagoryId(value)
    }

    // TODO: 点击删除按钮让弹框出现
    handleContentRemove = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true
            })
        }
    }

    // TODO: 下线和删除中的弹框中的确认
    handleRemoveConfirmOk = () => {
        // TODO: 执行删除操作
        this.closeRemoveConfirm()
        // Todo：下线和删除操作调接口
        if(this.state.isRemoveMode){
            this.props.catagories.removeItem(this.rowSelectionIds,this.handleDodropCallback)
        }else{
            this.props.catagories.deleteCataItem(this.rowSelectionIds,this.handleDodropCallback)
        }

    }

    closeRemoveConfirm = () => {
        this.setState({
            removeConfirmVisiable: false,
            isRemoveMode: false
        })
    }

    // TODO: 下线操作
    removeCateItem = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true,
                isRemoveMode: true
            })
        }
    }

    handleContentModalOk = (e) => {
        e.preventDefault()
        // TODO：编辑确定之后和创建确定之后的操作
        this.addAndEditForm.props.form.validateFields((errors, values) => {
            // TODO: 创建操作
            const { categoryName, orderNum, onlineStatus} = values
            if(this.state.isAddContentModel && categoryName && orderNum && (onlineStatus==0 || onlineStatus==1)){
                this.setState({confirmButton: true})
                this.confirmCreateData(values)
            }else if (!this.state.isAddContentModel && this.state.catagoryId){
                this.setState({confirmButton: true})
                this.editModeOk(this.state.catagoryId,values)
            }
        })
    }

    confirmCreateData(params){
        http.post(api.CATEGORIESSHOW, params).then((res)=>{
                const {data} = res
                const {code, message}=data
                if (code === 0){
                    this.closeContentModal()
                    this.handleDodropCallback()
                }else{
                    message.error(message)
                }
            }).catch((error)=>{
                console.log(error)
            })
    }

    editModeOk(keyword,params){
        http.put(`${api.CATEGORIESSHOW}/${keyword}`, params).then((res)=>{
            const {data} = res
            const {code, message}=data
            if (code === 0){
                this.closeContentModal()
                this.handleDodropCallback()
            }else{
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    closeContentModal = () => {
        this.addAndEditForm.props.form.resetFields()
        this.setState({
            contentModalVisiable: false,
        })
    }

    handleAddBtnClick = () => {
        this.setState({
            contentModalVisiable: true,
            isAddContentModel: true,
            editData:{},
            confirmButton: false,

        })
    }

    handleEditBtnClick = (info) => {
        // TODO: 拉取分类表单信息
        this.setState({
            contentModalVisiable: true,
            isAddContentModel: false,
            catagoryId: info.id,
            editData:{
                categoryName:info.title,
                orderNum:info.orderNum,
                onlineStatus:info.onlineStatus,
            },
            confirmButton: false,

        })
    }

    // TOdo:上移和下移
    handleUpAndDownMove = (itemInfo,isUpAndDown) =>{
        const {maxOrderNum} = this.props.catagories
        if((itemInfo.orderNum===1 && isUpAndDown === 'up') || (itemInfo.orderNum===maxOrderNum && isUpAndDown === 'down')){
            return
        }
        const moveData= {
            categoryName:itemInfo.title,
            orderNum:isUpAndDown === 'up' ? Number(itemInfo.orderNum)-1 : Number(itemInfo.orderNum)+1,
            onlineStatus:itemInfo.onlineStatus,
        }
        this.props.catagories.editModeOk(itemInfo.id, moveData, this.handleDodropCallback)
    }


    handleDodropCallback = () => {
      const params = sessionCache.get('catagories_value')
      this.props.catagories.fetchCatagoriesData(params)
    }

    render() {
        const context = this
        const {
            removeConfirmVisiable,
            contentModalVisiable,
            isAddContentModel,
            isRemoveMode,
            confirmButton
        } = this.state
        const {maxOrderNum,catagoriesList} = toJS(this.props.catagories)
        const {
            handleContentRemove,
            handleRemoveConfirmOk,
            closeRemoveConfirm,
            handleAddBtnClick,
            handleContentModalOk,
            closeContentModal,
            removeCateItem
        } = this


        const rowSelection = {
            onChange: this.handleRowSelectionChange,
        }
        const columns = [
            {
                width: 200,
                dataIndex: 'title',
                title: '文档分类'
            },
            {
                width: 200,
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
                align: 'center',
                key: 'operation',
                width: 120,
                title: '操作',
                render(_, record) {
                    return [
                        <div key="1" style={{marginBottom: 4}}>
                            <a onClick={() => context.handleUpAndDownMove(record,'up')} style={{marginRight: 4}}>上移</a>
                            <a onClick={() => context.handleUpAndDownMove(record,'down')}>下移</a>
                        </div>,
                        <div key="2">
                            <a onClick={() => context.handleEditBtnClick(record)}>编辑</a>
                        </div>
                    ]
                }
            }
        ]
        return (
            <div className="help-top-container">
                <div className="doc-cata">文档分类</div>
                <CatagoryFormSearch/>
                <div className="action-container">
                    <Button type="primary" onClick={handleAddBtnClick}>
                        创建
                    </Button>
                    <Button type="danger" onClick={handleContentRemove}>
                        删除
                    </Button>
                    <Button onClick={removeCateItem}>下线</Button>
                </div>
                <Table
                    className="table"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={catagoriesList}
                />
                <Modal
                    className="help-top-remove-confirm"
                    title={isRemoveMode ? '下线文档分类':'删除文档分类'}
                    visible={removeConfirmVisiable}
                    okType="danger"
                    onOk={handleRemoveConfirmOk}
                    onCancel={closeRemoveConfirm}
                >
                     确认{isRemoveMode ? '下线':'删除'}文档分类么?
                </Modal>

                <Modal
                    className="help-top-modal"
                    title={isAddContentModel ? '新增文档分类' : '编辑文档分类'}
                    visible={contentModalVisiable}
                    onOk={handleContentModalOk}
                    onCancel={closeContentModal}
                >
                    <AddAndEditForm
                        wrappedComponentRef={ref => (this.addAndEditForm = ref)}
                        isAddContentModel={this.state.isAddContentModel}
                        handleContentModalOk = {handleContentModalOk}
                        closeContentModal = {closeContentModal}
                        editData = {this.state.editData}
                        maxOrderNum = {maxOrderNum}
                        confirmButton = {confirmButton}
                    />
                </Modal>

            </div>
        )
    }
}
