import React, { Component } from 'react'
import './style.scss'
import {
  Button,
  Table,
  Modal,
  message,
} from 'antd'
import api, {http} from './../../../service'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import {getCategoryId} from './../../../utils'
import HelpTopFormSearch from '../../../components/HelpTop/Search'
import HelpAddAndEdit from '../../../components/HelpTop/AddAndEditForm'

@inject('helpTop')
@observer
export default class HelpTop extends Component {
  state = {
    removeConfirmVisiable: false,
    contentModalVisiable: false,
    isAddContentModel: false,
    isDeleteModel: false,
    // 保存服务端拉取属性
    editFormValues: {
    },
      limitClick: false
  }

  componentDidMount(){
    this.props.helpTop.fetchHelpTopData({page_no: 1, page_size: 10 })
    this.props.helpTop.fetchMaxOrderNum()
  }

  rowSelectionKeys = []
  rowSelectionIds = []


  handleRowSelectionChange = (e,values) => {
    this.rowSelectionKeys = e
    this.rowSelectionIds = getCategoryId(values)
  }
  handleEdit = record => {
    this.props.history.push(`/help/edit_${record.key}`)
  }
  handleContentRemove = () => {
    if (this.rowSelectionKeys.length){
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
              isDeleteModel: false,
          })
      }
  }

  handleRemoveConfirmOk = () => {
      console.log(this.rowSelectionIds)
      this.closeRemoveConfirm()
      if(this.state.isDeleteModel){
          // TODO: 执行删除操作
          this.props.helpTop.deleteHelpTopData(this.rowSelectionIds).then(()=>{
              this.props.helpTop.fetchHelpTopData()
          })
      }else{
          // TODO: 执行下线操作
          this.props.helpTop.offlineHelpTopData(this.rowSelectionIds).then(()=>{
              this.props.helpTop.fetchHelpTopData()
          })
      }
  }

  closeRemoveConfirm = () => {
    this.setState({
      removeConfirmVisiable: false
    })
  }


  handleContentModalOk = (e) => {
      e.preventDefault()
      this.addAndEditForm.props.form.validateFields((errors, values) => {
          const {categoryName, onlineStatus, orderNum} = values
         if( categoryName && (onlineStatus===0 || onlineStatus===1) && orderNum){
             this.setState({limitClick: true})
              if(this.state.isAddContentModel){
                  this.createAndEdit(values)
              }else if(this.state.editFormValues.categoryId){
                   this.createAndEdit(values, this.state.editFormValues.categoryId )
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
              this.props.helpTop.fetchHelpTopData()
              this.closeContentModal()

          }else{
              message.error(message)
              this.setState({limitClick: false})
          }
      }).catch((error)=>{
          console.log(error)
      })

  }





  closeContentModal = () => {
      this.addAndEditForm.props.form.resetFields()
    this.setState({
      contentModalVisiable: false,
        isDeleteModel: false,
    })
  }

  handleAddBtnClick = () => {
    this.setState({
      contentModalVisiable: true,
      isAddContentModel: true,
      editFormValues:{},
      limitClick: false
    })
  }

  handleEditBtnClick = (info) => {
    // TODO: 拉取分类表单信息
    console.log(info)
    this.setState({
      contentModalVisiable: true,
      isAddContentModel: false,
      editFormValues: {
          categoryName: info.title,
          orderNum: info.orderNum,
          onlineStatus: info.onlineStatus,
          categoryId: info.id
      },
      limitClick: false
    })
  }

    // TOdo:上移和下移
    handleUpAndDownMove = (itemInfo,isUpAndDown) =>{
        const {maxOrderNum} = this.props.helpTop
        if(itemInfo.orderNum===1 && isUpAndDown === 'up'){
            message.warning('已是所属一级分类下的第一序号，无法上移')
            return
        }
        if(itemInfo.orderNum===maxOrderNum && isUpAndDown === 'down'){
            message.warning('已是所属一级分类下的最后一个序号，无法下移')
            return
        }
       this.editData= {
            categoryName:itemInfo.title,
            orderNum:isUpAndDown === 'up' ? Number(itemInfo.orderNum)-1 : Number(itemInfo.orderNum)+1,
            onlineStatus:itemInfo.onlineStatus,
        }
        this.props.helpTop.editHelpTopData(itemInfo.id, this.editData, 'helpTop')
    }

    handlePageChange = page => {
        this.props.helpTop.fetchHelpTopData({page_no: page, page_size: 10 })
    }

  render() {
    const context = this
    const {
      removeConfirmVisiable,
      contentModalVisiable,
      isAddContentModel,
        isDeleteModel,
        editFormValues,
    } = this.state
    const {
      handleContentRemove,
      handleContentOffline,
      handleRemoveConfirmOk,
      closeRemoveConfirm,
      handleContentModalOk,
      closeContentModal,
      handleAddBtnClick,
        handlePageChange,
    } = this
    const {data,maxOrderNum} = this.props.helpTop
    let {dataList, totalNum, currentPage} =data
      dataList = toJS(dataList)
    const rowSelection = {
      onChange: this.handleRowSelectionChange
    }
    const columns = [
      {
        width: 200,
        dataIndex: 'title',
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
            <div key="1" style={{ marginBottom: 4 }}>
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
      <div className="help-top-container">
        <div className="help-top">帮助支持一级分类</div>
        <HelpTopFormSearch currentPage = {currentPage}/>
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
          title={isDeleteModel?'删除一级分类' : '下线一级分类'}
          visible={removeConfirmVisiable}
          okType="danger"
          onOk={handleRemoveConfirmOk}
          onCancel={closeRemoveConfirm}
        >
            {isDeleteModel? '确认删除该一级分类么？删除后分类下的内容也将被删除!':'确认下线该一级分类么？下线后分类下的内容也将被下线!'}
        </Modal>
        <Modal
          className="help-top-modal"
          title={isAddContentModel ? '新增帮助一级分类' : '编辑帮助一级分类'}
          visible={contentModalVisiable}
          onOk={handleContentModalOk}
          onCancel={closeContentModal}
        >
            <HelpAddAndEdit
                wrappedComponentRef={ref => (this.addAndEditForm = ref)}
                isAddContentModel={isAddContentModel}
                handleContentModalOk = {handleContentModalOk}
                closeContentModal = {closeContentModal}
                editData = {editFormValues}
                maxOrderNum = {maxOrderNum}
                confirmStatus = {this.state.limitClick}
            />
        </Modal>
      </div>
    )
  }
}
