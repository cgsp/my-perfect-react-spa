import { observable, action } from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'
class Store {
    @observable maxOrderNum=0
    @observable catagoriesList=[]

    @action
    saveManageData (info){
        this.catagoriesList = info
    }

    @action
   fetchCatagoriesData (params) {
        http.get(api.CATEGORIESSHOW, params).then((res)=>{
                    const data = res.data || {}
                    const {code, message}=data
                    if (code) throw message
            if(code===0){
                data.data && data.data.length > 0 && data.data.map((item, index) => {
                    item.createdTime = timestampToTime(item.createdTime)
                    item.updatedTime = timestampToTime(item.updatedTime)
                    item.key = index
                })
                this.saveManageData(data.data)
            }else{
                message.error(message)
            }
        }).catch((error)=>{
               console.log(error)
           })

    }

    @action
    async fetchMaxOrderNum (){
        try {
            const {data} = await http.get(api.MAXORDERNUM)
            const {code, message}=data
            if (code) throw message
            this.maxOrderNum = data.data
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async deleteCataItem (reqParams, callback) {
        try {
            const {data} = await http.put(api.CATEDELETE, reqParams)
            const {code, message} = data
            if (code) throw message
            // TODO: 展示修改后的数据列表
            if (typeof callback == 'function') {
                callback()
            }
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async removeItem (reqParams,callback) {
        try {
            const {data} = await http.put(api.CATEOFFLINE, reqParams)
            const {code, message} = data
            if (code) throw message
            // TODO: 展示修改后的数据列表
            if (typeof callback == 'function') {
                callback()
            }
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async confirmCreateData(params, callback){
        try {
            const {data} = await http.post(api.CATEGORIESSHOW, params)
            const {code, message}=data
            if (code) throw message
            if (typeof callback == 'function') {
                callback()
            }
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async editModeOk(keyword,params,callback){
    try {
        const url = `${api.CATEGORIESSHOW}/${keyword}`
        const {data} = await http.put(url, params)
        const {code, message}=data
        if (code) throw message
        if (typeof callback == 'function') {
            callback()
        }
    } catch (e) {
        message.error(e)
    }
    }
}

export default new Store()
