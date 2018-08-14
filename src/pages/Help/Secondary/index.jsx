import React, {Component} from 'react'
import './style.scss'
import {
    Select,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import api, {http} from './../../../service'
import {inject, observer} from 'mobx-react'
import {toJS} from 'mobx'
import {getCategoryId} from './../../../utils'
import SecFormSearch from '../../../components/HelpSecondary/Search'
import HelpSecAddAndEdit from '../../../components/HelpSecondary/AddAndEditForm'
const {Option} = Select


@inject('helpTop')
@observer
export default class HelpSecond extends Component {
    state = {
        removeConfirmVisiable: false,
        contentModalVisiable: false,
        isAddContentModel: false,
        isDeleteModel: false,
        // 保存服务端拉取属性
        editData: {},
        secMaxOrderNum: 1,
        limitClick: false,
    }

    componentDidMount() {
        this.props.helpTop.fetchSecondHelpSecondData({page_no: 1, page_size: 10 })
        this.props.helpTop.fetchQaCategoryAll()
    }

    rowSelectionKeys = []
    rowSelectionIds = []

    handleSearch = () => {
        this.searchForm.props.form.validateFieldsAndScroll((errors, values) => {
            // TODO: 执行搜索
            this.props.helpTop.fetchSecondHelpSecondData(values)
        })
    }
    handleRowSelectionChange = (e,values) => {
        this.rowSelectionKeys = e
        this.rowSelectionIds = getCategoryId(values)
    }
    handleEdit = record => {
        this.props.history.push(`/help/edit_${record.key}`)
    }
    handleContentRemove = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true,
                isDeleteModel: true,
            })
        }
    }
    handleContentOffline = () => {
        if (this.rowSelectionKeys.length) {
            this.setState({
                removeConfirmVisiable: true,
            })
        }
    }
    handleRemoveConfirmOk = () => {
        console.log(this.rowSelectionIds)
        this.closeRemoveConfirm()

        if(this.state.isDeleteModel){
            // TODO: 执行删除操作
            this.props.helpTop.deleteHelpTopData(this.rowSelectionIds).then(()=>{
                this.props.helpTop.fetchSecondHelpSecondData()
            })
        }else{
            // TODO: 执行下线操作
            this.props.helpTop.offlineHelpTopData(this.rowSelectionIds).then(()=>{
                this.props.helpTop.fetchSecondHelpSecondData()
            })
        }
    }

    closeRemoveConfirm = () => {
        this.setState({
            removeConfirmVisiable: false,
            isDeleteModel: false,
        })
    }
    handleContentModalOk = (e) => {
        e.preventDefault()
        this.addAndEditForm.props.form.validateFields((errors, values) => {
            // TODO: 创建操作
            const {categoryName, onlineStatus, orderNum, parentId} = values
            console.log(this.state.editData)
            if( categoryName && (onlineStatus===0 || onlineStatus===1) && orderNum && parentId){
                this.setState({limitClick: true})
                if(this.state.isAddContentModel){
                    this.createAndEdit(values)
                }else if(this.state.editData.id){
                    this.createAndEdit(values, this.state.editData.id)
                }
            }
        })
    }

    createAndEdit = (params,categoryId) =>{

        const promiseFunc = categoryId ?  http.put(`${api.QACATEGORIES}/${categoryId}`, params) : http.post(api.QACATEGORIES, params)
        promiseFunc.then((res)=>{
            const data= res.data || {}
            const {code, message}=data
            if (code===0){
                this.props.helpTop.fetchSecondHelpSecondData()
                this.closeContentModal()
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
            editData:{},
        })
    }
    handleAddBtnClick = () => {
        this.setState({
            contentModalVisiable: true,
            isAddContentModel: true,
            editdata: {},
            limitClick: false
        })
    }
    handleEditBtnClick = (info) => {
        // TODO: 拉取分类表单信息
        this.setState({
            contentModalVisiable: true,
            isAddContentModel: false,
            editData:info,
            secMaxOrderNum: info.orderNum,
            limitClick: false
        })
    }

    showCatagoriesAll = (qaCategoryAll) => {
        return (qaCategoryAll && qaCategoryAll.length > 0 && qaCategoryAll.map((item, index) => {
            return (
                <Option value={item.id} key={item.id}>{item.name}</Option>
            )
        }))
    }

    handleCurrencyChange =(currency)=>{
        this.fetchSecMaxOrderNum({parent_id: currency})
        message.warning('请重新选择文档序号')
    }

    fetchSecMaxOrderNum(params) {
        http.get(api.SECMAXORDERNUM, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if(code===0){
                this.setState({secMaxOrderNum: data.data})
            }else{
                message.error(message)
            }
        }).catch ((e)=>{
            message.error(e)
        })
    }
    // TOdo:上移和下移
    handleUpAndDownMove = (itemInfo,isUpAndDown) =>{
        this.props.helpTop.fetchSecMaxOrderNum({parent_id: itemInfo.parentId}).then(()=>{
            const {secMaxOrderNum} = this.props.helpTop
            console.log(secMaxOrderNum)
            if(itemInfo.orderNum===1 && isUpAndDown === 'up'){
                message.warning('该二级分类已是所属一级分类下的第一序号，无法上移！')
                return
            }else if(itemInfo.orderNum===secMaxOrderNum && isUpAndDown === 'down'){
                message.warning('该二级分类已是所属一级分类下的最后一个序号，无法下移！')
                return
            }
            const changeData= {
                categoryName:itemInfo.title,
                orderNum:isUpAndDown === 'up' ? Number(itemInfo.orderNum)-1 : Number(itemInfo.orderNum)+1,
                onlineStatus:itemInfo.onlineStatus,
                parentId:itemInfo.parentId,
            }
            this.props.helpTop.editHelpTopData(itemInfo.id,changeData,'helpSec')
        })
    }

    handlePageChange = page => {
        console.log(page)
        this.props.helpTop.fetchSecondHelpSecondData({page_no: page, page_size: 10 })
    }

    render() {
        const context = this
        const {secondData,qaCategoryAll} = toJS(this.props.helpTop)
        const { dataList, totalNum, currentPage } = secondData
        let {editData,secMaxOrderNum} = this.state
        const {
            removeConfirmVisiable,
            contentModalVisiable,
            isAddContentModel,
            isDeleteModel
        } = this.state
        const {
            handleContentRemove,
            handleContentOffline,
            handleRemoveConfirmOk,
            closeRemoveConfirm,
            handleContentModalOk,
            closeContentModal,
            handleAddBtnClick,
            handleCurrencyChange,
            handlePageChange
        } = this
        const rowSelection = {
            onChange: this.handleRowSelectionChange
        }
        const columns = [
            {
                width: 200,
                dataIndex: 'title',
                title: '帮助二级分类'
            },
            {
                width: 200,
                dataIndex: 'parentTitle',
                title: '帮助一级分类'
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
                render(_, record) {
                    return [
                        <div key="1" style={{marginBottom: 4}}>
                            <a onClick={() => context.handleUpAndDownMove(record,'up')}>上移</a>
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
            <div className="help-secondary-container">
                <div className="help-top">帮助支持二级分类</div>
                <SecFormSearch data={qaCategoryAll} currentPage = {currentPage}/>
                <div className="action-container">
                    <Button type="primary" onClick={handleAddBtnClick}>
                        创建
                    </Button>
                    <Button type="danger" onClick={handleContentRemove}>
                        删除
                    </Button>
                    <Button onClick={handleContentOffline}>下线</Button>
                </div>
                <Table
                    className="table"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataList}
                    pagination={{
                        total: totalNum,
                        onChange: handlePageChange
                    }}
                />
                <Modal
                    className="help-top-remove-confirm"
                    title={isDeleteModel ? '删除二级分类' : '下线二级分类'}
                    visible={removeConfirmVisiable}
                    okType="danger"
                    onOk={handleRemoveConfirmOk}
                    onCancel={closeRemoveConfirm}
                >
                    {isDeleteModel? '确认删除该二级分类么？删除后分类下的内容也将被删除!':'确认下线该二级分类么？下线后分类下的内容也将被下线!'}
                </Modal>

                <Modal
                    className="help-secondary-modal"
                    title={isAddContentModel ? '新增帮助二级分类' : '编辑帮助二级分类'}
                    visible={contentModalVisiable}
                    onOk={handleContentModalOk}
                    onCancel={closeContentModal}
                >
                    <HelpSecAddAndEdit
                        wrappedComponentRef={ref => (this.addAndEditForm = ref)}
                        isAddContentModel={isAddContentModel}
                        handleContentModalOk = {handleContentModalOk}
                        closeContentModal = {closeContentModal}
                        editData = {editData}
                        secMaxOrderNum = {secMaxOrderNum}
                        handleCurrencyChange={handleCurrencyChange}
                        data={qaCategoryAll}
                        confirmStatus = {this.state.limitClick}
                    />
                </Modal>
            </div>
        )
    }
}
