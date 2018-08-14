import React, {Component} from 'react'
import './style.scss'
import {
    Form,
    Table,
    message,
    Modal,
} from 'antd'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import api, {http} from './../../../service'

import CommonSearch from '../../../components/CommonSearch'
import CommonReject from '../../../components/CommonReject'

@inject('applyAudit')
@Form.create({})
@observer
export default class IntellServer extends Component {
    state={
        removeConfirmVisiable: false,
        itemInfo:{}
    }

    componentDidMount() {
        this.props.applyAudit.fetchServerData()
    }


    handlePassBtnClick = (info) => {
        this.passFee(info.id,{auditState: info.auditState})
    }

    passFee = (key, params) =>{
        http.put(`${api.SERVERACCESS}/${key}`, params).then((res)=>{
            const data = res.data || {}
            const {code, message}=data
            if (code === 0) {
                if(params.auditFailReason){
                    message.success('驳回成功')
                    this.closeConfirm()
                }else{
                    message.success('审批成功')
                }
                this.props.applyAudit.fetchServerData()
            }else {
                message.error(message)
            }
        }).catch((error)=>{
            console.log(error)
        })

    }

    handleFailBtnClick = (record) => {
        this.setState({
            removeConfirmVisiable: true,
            itemInfo: {
                auditId: record.id,
                auditState:record.auditState,
            }
        })
    }

    handleConfirmOk = () =>{
        this.intellServerReject.props.form.validateFieldsAndScroll((errors, values) => {
            console.log(values)
            const {itemInfo} = this.state
            const {auditId, auditState } = itemInfo
            if(values.auditFailReason && auditId && auditState){
                this.passFee(auditId, { auditState, auditFailReason: values.auditFailReason })
            }
        })
    }



    closeConfirm = () => {
        this.setState({
            removeConfirmVisiable: false
        })
    }



    handlePageChange = page => {
        this.props.applyAudit.fetchServerData({page_no: page, page_size: 10 })
    }






    render() {
        const context = this
        const {serverData} = toJS(this.props.applyAudit)
        const {dataList, totalNum, currentPage} = serverData
        const {removeConfirmVisiable} = this.state
        const {closeConfirm,handleConfirmOk, handlePageChange} = this
        const columns = [
            {
                align: 'center',
                width: 200,
                dataIndex: 'appKey',
                title: '应用名称'
            },
            {
                align: 'center',
                width: 140,
                dataIndex: 'appType',
                title: '应用分类',
                render(text) {
                    const statusMap = {
                        1: '移动应用',
                        2: '网站应用',
                        3: '智能硬件',
                    }
                    return statusMap[text]
                }
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'platform',
                title: '应用平台'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'developerName',
                title: '所属开发者'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'applyTime',
                title: '申请时间'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'auditState',
                title: '状态',
                render(text) {
                    const statusMap = {
                        2: '待审核',
                        3: '审核通过',
                        4: '审核未通过'
                    }
                    return statusMap[text]
                }
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'auditor',
                title: '审批人'
            },
            {
                dataIndex: 'operation',
                width: 120,
                title: '操作',
                render(status, record) {
                    if(status && status.length>0){
                        return [
                            <div key="1" style={{marginBottom: 4}}>
                                <a onClick={() => context.handlePassBtnClick(record)}>{status[0]}</a>
                            </div>,
                            <div key="2">
                                <a onClick={() => context.handleFailBtnClick(record)}>{status[1]}</a>
                            </div>
                        ]
                    }else {
                        return [
                            <div key="1" style={{marginBottom: 4}}>
                                <p>一一</p>
                            </div>
                        ]
                    }
                }
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'auditFailReason',
                title: '驳回原因'
            }
        ]
        return (
            <div className="server-top-container">
                <div className="server-title">服务端接入审批(智能硬件)</div>
                <CommonSearch mark = 'intellServer' currentPage = {currentPage}/>
                <Table
                    className="table"
                    columns={columns}
                    dataSource={dataList}
                    pagination={{
                        total: totalNum,
                        onChange: handlePageChange

                    }}
                />
                <Modal
                    className="server-reject-confirm"
                    title={'审核驳回意见'}
                    visible={removeConfirmVisiable}
                    okType="danger"
                    onOk={handleConfirmOk}
                    onCancel={closeConfirm}
                >
                    <CommonReject
                        wrappedComponentRef={ref => (this.intellServerReject = ref)}
                    />
                </Modal>
            </div>
        )
    }
}
