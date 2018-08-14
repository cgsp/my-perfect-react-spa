import {observable, action} from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'

class Store {
    @observable data = {
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
    async fetchAnnounceData(params) {
        try {
            const {data} = await http.get(api.BULLETIN, params)
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
    async deleteAnnouncement(params) {
        try {
            const {data} = await http.put(api.BULLETINDELETE, params)
            const {code, message}=data
            if (code) throw message
            this.fetchAnnounceData()
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async createAnnouncement(params) {
        try {
            const {data} = await http.post(api.BULLETIN, params)
            const {code, message}=data
            if (code) throw message
            this.fetchAnnounceData()
        } catch (e) {
            message.error(e)
        }
    }

    @action
    async updateAnnouncement(keyWord,params) {
        try {
            const {data} = await http.put(`${api.BULLETIN}/${keyWord}`, params)
            const {code, message}=data
            if (code) throw message
        } catch (e) {
            message.error(e)
        }
    }

}

export default new Store()
