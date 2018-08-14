import {observable, action} from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'

class Store {
    @observable maxOrderNum = 1
    @observable data = {
        dataList: [],
        totalNum: 0,
        totalPage: 0,
        currentPage: 0,
        pageSize: 0,
    }
    @observable cataList = []

    @action
    saveMangeData(params) {
        this.data = {
            ...this.data,
            ...params
        }
    }

    @action
    async fetchDocContentData(params) {
        try {
            const {data} = await http.get(api.DEVELOPERSDOCS, params)
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
   fetchDocMaxOrderNum(params) {
        http.get(api.MAXDOCORDERNUM, params).then((res)=>{
                const data = res.data || {}
                const {code, message}=data
                if(code===0){
                    console.log('data.data',data.data)
                    this.maxOrderNum = data.data
                }else{
                    message.error(message)
                }

        }).catch ((e)=>{
                message.error(e)
            })
    }




    @action
    async deleteDocItem(reqParams) {
        try {
            const {data} = await http.put(api.DOCDELETE, reqParams)
            const {code, message} = data
            if (code) throw message
            // TODO: 展示修改后的数据列表
            this.fetchDocContentData()
        } catch (e) {
            message.error(e)
        }
    }

    // TODO: 文档下线按钮
    @action
    async removeDocItem(reqParams) {
        try {
            const {data} = await http.put(api.DOCOFFLINE, reqParams)
            const {code, message} = data
            if (code) throw message
            // TODO: 展示修改后的数据列表
            this.fetchDocContentData()
        } catch (e) {
            message.error(e)
        }
    }

    // TODO: 获取分类列表
    @action
    async fetchCatagoriesAll() {
        try {
            const {data} = await http.get(api.CATEGORIES)
            const {code, message}=data
            if (code) throw message
            this.cataList = data.data
        } catch (e) {
            message.error(e)
        }
    }

    // TODO: 更新接口
    @action
    async updateDocContent(keyword, params) {
        try {
            keyword = `/${keyword}`
            const url = `${api.DEVELOPERSDOCS}${keyword}`
            const {data} = await http.put(url, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async editModeOk(keyword,params, callback){
        try {
            keyword = `/${keyword}`
            const url = `${api.DEVELOPERSDOCS}${keyword}`
            const {data} = await http.put(url, params)
            const {code, message}=data
            if (code) throw message
            if(typeof callback == 'function'){
                callback()
            }

        } catch (e) {
            message.error(e)
        }
    }

}

export default new Store()
