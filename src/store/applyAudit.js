import { observable, action } from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import { toJS } from 'mobx'
import {timestampToTime} from './../utils'
class Store {
    @observable data={}
    @observable serverData={}
    @observable feeData={}


    @action
    async fetchApplyData (params) {
        try {
            const {data} = await http.get(api.AUDITAPPS, params)
            const {code, message}=data
            if (code) throw message
            const {dataList} = data.data
            dataList && dataList.length > 0 && dataList.map((item, index) => {
                item.applyTime = timestampToTime(item.applyTime)
                if(item.auditState === 2){
                    item.auditor = '一一'
                    item.operation = '审核'
                }else{
                    item.operation = '查看'
                }
                item.key = index
            })
            this.data = data.data

        } catch (e) {
            message.error(e)
        }
    }

    @action
    async saveHighMobileData (key,params) {
        try {
            const {data} = await http.put(`${api.AUDITAPPS}/${key}`, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async fetchServerData (params) {
        try {
            const {data} = await http.get(api.SERVERACCESS, params)
            const {code, message}=data
            if (code) throw message
            const {dataList} = data.data
            dataList && dataList.length > 0 && dataList.map((item, index) => {
                item.applyTime = timestampToTime(item.applyTime)
                if(item.auditState != 4){
                    item.auditFailReason = '一一'
                }
                if(item.auditState === 2){
                    item.auditor = '一一'
                    item.operation = ['通过','驳回']
                }
                item.key = index
            })
            this.serverData = data.data

        } catch (e) {
            message.error(e)
        }
    }

    @action
    async passServer (key,params) {
        try {
            const {data} = await http.put(`${api.SERVERACCESS}/${key}`, params)
            const {code, message}=data
            if (code) throw message
            message.success('驳回成功')
            this.props.applyAudit.fetchServerData()
        } catch (e) {
            message.error(e)
        }
    }


    @action
    async fetchFeeData (params) {
        try {
            const {data} = await http.get(api.DISTRIBUTION, params)
            const {code, message}=data
            if (code) throw message
            const {dataList} = data.data
            dataList && dataList.length > 0 && dataList.map((item, index) => {
                item.applyTime = timestampToTime(item.applyTime)
                if(item.auditState != 4){
                    item.auditFailReason = '一一'
                }
                if(item.auditState === 2){
                    item.auditor = '一一'
                    item.operation = ['通过','驳回']
                }
                item.key = index
            })
            this.feeData = data.data

        } catch (e) {
            message.error(e)
        }
    }






}

export default new Store()
