import React, {Component} from 'react'
import './style.scss'
import {
    Form,
    Input,
    Select,
    Button,
    Table,
} from 'antd'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import {sessionCache} from '../../../utils/cache'
import ApplyFormSearch from '../../../components/IntellApply/ApplyAudit/Search'
const {Item} = Form
const {Option} = Select

@inject('applyAudit')
@observer
export default class ApplyAudit extends Component {

    componentDidMount() {
        this.props.applyAudit.fetchApplyData()
    }

    handlePageChange = page => {
        console.log(page)
        this.props.applyAudit.fetchApplyData({page_no: page, page_size: 10 })
    }

    handleEditBtnClick = (info) => {
        sessionCache.put('auditData',info)
        // TODO: appType 1表示移动应用 2表示网站应用
        // TODO: appAuditType 1表示应用上线申请 2表示应用信息修改申请
        if(info.appAuditType === 1){
            sessionCache.put('OfflineData',info)
            // TODO: 去审核
            if(info.auditState === 2){
                this.props.history.push(`/intelligentAudit/IntellApply/Offline/Audit`)
            }else {
                this.props.history.push(`/intelligentAudit/IntellApply/Offline/Detail`)
            }
        }else if(info.appAuditType === 2){
            sessionCache.put('ModifyData',info)
            if(info.auditState === 2){
                this.props.history.push(`/intelligentAudit/IntellApply/Modify/Audit`)
            }else {
                this.props.history.push(`/intelligentAudit/IntellApply/Modify/Detail`)
            }
        }
    }


    render() {
        const context = this
        const {data} = toJS(this.props.applyAudit)
        const {dataList, totalNum, currentPage} = data
        const { handlePageChange } = this

        const columns = [
            {
                align: 'center',
                width: 200,
                dataIndex: 'appAuditType',
                title: '审批类型',
                render(text) {
                    const statusMap = {
                        1: '应用上线申请',
                        2: '应用信息修改申请',
                    }
                    return statusMap[text]
                }
            },
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
                title: '应用类型',
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
                align: 'center',
                dataIndex: 'operation',
                width: 120,
                title: '操作',
                render(status, record) {
                    return [
                        <div key="1">
                            <a onClick={() => context.handleEditBtnClick(record)}>{status}</a>
                        </div>
                    ]
                }
            }
        ]
        return (
            <div className="help-top-container">
                <div className="company-title">智能硬件应用审批</div>
                <ApplyFormSearch hardware = {[]} currentPage = {currentPage}/>
                <Table
                    className="table"
                    columns={columns}
                    dataSource={dataList}
                    pagination={{
                        total: totalNum,
                        onChange: handlePageChange

                    }}
                />
            </div>
        )
    }
}
