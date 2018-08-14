import {observable, action} from 'mobx'
import api, {http} from './../service'
import {
    message
} from 'antd'
import {timestampToTime} from './../utils'

class Store {
    @observable data = {
        dataList:[]
    }


    @action
    saveMangeData(params) {
        this.data = {
            ...this.data,
            ...params
        }
    }

    @action
    async fetchUsersInfo() {
    }

}

export default new Store()
