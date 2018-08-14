import {observable, action, toJS, runInAction} from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'
import {sessionCache} from './../utils/cache'

class Store {
    @observable maxOrderNum = 0
    @observable secMaxOrderNum = 0
    @observable data = {
        dataList: [],
        totalNum: 0,
        totalPage: 0,
        currentPage: 0,
        pageSize: 0,
    }
    @observable secondData = {
        dataList: [],
        totalNum: 0,
        totalPage: 0,
        currentPage: 0,
        pageSize: 0,
    }
    @observable cataList = []
    @observable qaCategoryAll = []

    @action
    saveMangeData(params) {
        this.data = {
            ...this.data,
            ...params
        }
    }

    @action
    saveMangeSecondData(params) {
        this.secondData = {
            ...this.secondData,
            ...params
        }
    }

    @action
    async fetchHelpTopData(params) {
        try {
            const {data} = await http.get(api.QACATEGORIES, params)
            const {code, message}=data
            if (code) throw message
            data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
                item.createdTime = timestampToTime(item.createdTime)
                item.updatedTime = timestampToTime(item.updatedTime)
                item.key = item.id
            })
            this.saveMangeData(data.data)

        } catch (e) {
            message.error(e)
        }
    }

    @action
    async fetchSecondHelpSecondData(params) {
        try {
            const {data} = await http.get(api.SECONDCATEGORIES, params)
            const {code, message}=data
            if (code) throw message
            data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
                item.createdTime = timestampToTime(item.createdTime)
                item.updatedTime = timestampToTime(item.updatedTime)
                item.key = item.id
            })
            this.saveMangeSecondData(data.data)
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async deleteHelpTopData(params) {
        try {
            const {data} = await http.put(api.QADELETE, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async offlineHelpTopData(params) {
        try {
            const {data} = await http.put(api.QAOFFLINE, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async fetchMaxOrderNum() {
        try {
            const {data} = await http.get(api.QAMAXORDERNUM)
            const {code, message}=data
            if (code) throw message
            this.maxOrderNum = data.data
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async createHelpTopData(params) {
        try {
            const {data} = await http.post(api.QACATEGORIES, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

    @action
    editHelpTopData(keyWords,params,level) {
        http.put(`${api.QACATEGORIES}/${keyWords}`, params).then((res)=>{
                const data =res.data || {}
                const {code, message}=data
                if(code===0){
                   const params =  sessionCache.get('helpTop_value')
                    level === 'helpTop' ?
                        this.fetchHelpTopData(params) : this.fetchSecondHelpSecondData()
                }else {
                    message.error(message)
                }
            }).catch((error)=>{
                console.log(error)
            })
    }

    @action
    async fetchQaCategoryAll() {
        try {
            const {data} = await http.get(api.QACATEGORYALL)
            const {code, message}=data
            if (code) throw message
            this.qaCategoryAll = data.data
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async fetchSecMaxOrderNum(params) {
        try {
            const {data} = await http.get(api.SECMAXORDERNUM,params)
            const {code, message}=data
            if (code) throw message
            this.secMaxOrderNum = data.data
        } catch (e) {
            message.error(e)
        }
    }



}

export default new Store()
