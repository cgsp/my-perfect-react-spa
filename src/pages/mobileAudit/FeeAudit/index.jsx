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
export default class FeeAudit extends Component {
    state={
        removeConfirmVisiable: false,
        itemInfo:{}
    }

    componentDidMount() {
        this.props.applyAudit.fetchFeeData({page_no: 1, page_siez: 10})
    }


    handlePassBtnClick = (info) => {
        this.passServer(info.id,{auditState: info.auditState})
    }

    passServer = (key, params) =>{
        http.put(`${api.DISTRIBUTION}/${key}`, params).then((res)=>{
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
        this.feeReject.props.form.validateFieldsAndScroll((errors, values) => {
            console.log(values)
            const {itemInfo} = this.state
            const {auditId, auditState } = itemInfo
            if(values.auditFailReason && auditId && auditState){
                this.passServer(auditId, { auditState, auditFailReason: values.auditFailReason })
            }
        })
    }



    closeConfirm = () => {
        this.setState({
            removeConfirmVisiable: false
        })
    }



    handlePageChange = page => {
        console.log(page)
        this.props.applyAudit.fetchFeeData({page_no: page, page_size: 10 })
    }






    render() {
        const context = this
        const {feeData} = toJS(this.props.applyAudit)
        const {dataList, totalNum, currentPage} = feeData
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
                dataIndex: 'applyTime1',
                title: '联系人'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'applyTime2',
                title: '手机号'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'applyTime3',
                title: '邮箱'
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
                <div className="server-title">付费分销接入审批(移动&网站应用)</div>
                <CommonSearch mark = 'fee' currentPage = {currentPage}/>
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
                        wrappedComponentRef={ref => (this.feeReject = ref)}

                    />
                </Modal>
            </div>
        )
    }
}
