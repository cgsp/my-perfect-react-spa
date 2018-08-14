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
import ConpanyFormSearch from '../../../components/DeveloperAudit/Company/Search'
const {Item} = Form
const {Option} = Select

@inject('developerAudit')
@observer
export default class PersonalAudit extends Component {

    componentDidMount() {
        this.props.developerAudit.fetchPersonalData()
    }

    handleEditBtnClick = (info, status) => {
        sessionCache.put('perAuditOperation',info)
        if(status === '审核'){
            this.props.history.push(`/developerAudit/Personal/PersonalAudit`)
        }else if(status === '查看'){
            this.props.history.push(`/developerAudit/Personal/PersonalAuditDetail`)
        }
    }

    handlePageChange = (page) => {
        this.props.developerAudit.fetchPersonalData({page_no: page, page_size: 10 })
    }

    render() {
        const context = this
        const {personalData} = toJS(this.props.developerAudit)
        const {dataList, totalNum, currentPage} = personalData
        const columns = [
            {
                align: 'center',
                width: 200,
                dataIndex: 'developerName',
                title: '开发者名称'
            },
            {
                align: 'center',
                width: 140,
                dataIndex: 'developerIntro',
                title: '开发者简介'
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
                        2: '未审核',
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
                <div className="company-title">个人开发者审批</div>
                <ConpanyFormSearch mark="personal" currentPage = {currentPage}/>
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
