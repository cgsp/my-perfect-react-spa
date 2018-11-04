import {observable, action} from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'

class Store {
    @observable data = {
    }

    @action
    saveMangeData(params) {
        this.data = {
            ...this.data,
            ...params
        }
    }

    @action
    async fetchLettersData(params) {
        try {
            const {data} = await http.get(api.LETTERS, params)
            const {code, message}=data
            if (code) throw message
            data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
                item.sendTime = timestampToTime(item.sendTime)
                if(item.readStatus === 0){
                    item.readTime = '一一'
                }else{
                    item.readTime = timestampToTime(item.readTime)
                }
                item.key = index
            })
            this.saveMangeData(data.data)

        } catch (e) {
            message.error(e)
        }
    }

}

export default new Store()
