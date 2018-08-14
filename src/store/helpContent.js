import {observable, action, toJS, runInAction} from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'

class Store {
    @observable helpMaxOrderNum = 1
    @observable data = {
        dataList: [],
        totalNum: 0,
        totalPage: 0,
        currentPage: 0,
        pageSize: 0,
    }
    @observable treeCategory = []

    @action
    saveMangeData(params) {
        this.data = {
            ...params
        }
    }

    @action
    fetchHelpConData(params) {
        http.get(api.HELPCENTERQA, params).then((res)=>{
                const data = res.data || {}
                const {code, message}=data
                if(code === 0){
                    data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
                        item.createdTime = timestampToTime(item.createdTime)
                        item.updatedTime = timestampToTime(item.updatedTime)
                        item.key = item.id
                        item.helpCate = `${item.parentTitle}-${item.categoryTitle}`
                    })
                    this.saveMangeData(data.data)
                }else {
                    message.error(message)
                }
            }).catch((error)=>{
               console.log(error)
            })
    }

    // TODO: 创建
    @action
    async updateHelpConData(key,params) {
        try {
            const {data} = await http.put(`${api.HELPCENTERQA}/${key}`, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async deleteHelpConData(params) {
        try {
            const {data} = await http.put(api.QADELETECON, params)
            const {code, message}=data
            if (code) throw message
            this.fetchHelpConData()
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async offlineHelpConData(params) {
        try {
            const {data} = await http.put(api.QAOFFLINECON, params)
            const {code, message}=data
            if (code) throw message
            this.fetchHelpConData()
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async fetchMaxOrderNum(params) {
        try {
            const {data} = await http.get(api.QAMAXORDERNUMCON,params)
            const {code, message}=data

            if (code) throw message
            this.helpMaxOrderNum = data.data
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async fetchCategoryTree() {
         http.get(api.QACATETREE).then((res)=>{
             const data = res.data || {}
             const {code, message}=data
             if(code === 0 ){
                 this.treeCategory = data.data
             }else {
                 message.error(message)
             }
         }).catch((error)=>{
            console.log(error)
         })
    }
}

export default new Store()
