import React, {Component} from 'react'
import './style.scss'
import {
    Table,
} from 'antd'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import {sessionCache} from '../../../utils/cache'
import ConpanyFormSearch from '../../../components/DeveloperAudit/Company/Search'

@inject('developerAudit')
@observer
export default class CompanyAudit extends Component {
    componentDidMount() {
        this.props.developerAudit.fetchCompanyData({page_no: 1, page_size: 10 })
    }

    handleEditBtnClick = (info, status) => {

        sessionCache.put('comAuditOperation',info)
        if(status === '审核测试'){
            this.props.history.push(`/developerAudit/Company/CompanyAudit`)
        }else if(status === '查看'){
            this.props.history.push(`/developerAudit/Company/CompanyAuditDetail`)
        }

    }

    handlePageChange = page => {
        this.props.developerAudit.fetchCompanyData({page_no: page, page_size: 10 })
    }

    render() {
        const context = this
        const {companyData} = toJS(this.props.developerAudit)
        const {dataList, totalNum, currentPage} = companyData
        const columns = [
            {
                align: 'center',
                width: 200,
                dataIndex: 'companyName',
                title: '公司名称'
            },
            {
                align: 'center',
                width: 200,
                dataIndex: 'companySite',
                title: '公司主页'
            },
            {
                align: 'center',
                width: 140,
                dataIndex: 'companyDesc',
                title: '公司简介'
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
                        1: '未审核',
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
                            <a onClick={() => context.handleEditBtnClick(record, status)}>{status}</a>
                        </div>
                    ]
                }
            }
        ]
        return (
            <div className="help-top-container">
                <div className="company-title">企业开发者审批</div>
                <ConpanyFormSearch mark="company" currentPage = {currentPage}/>
                <Table
                    className="table"
                    columns={columns}
                    dataSource={dataList}
                    pagination={{
                        total: totalNum,
                        onChange: this.handlePageChange
                    }}
                />
            </div>
        )
    }
}
