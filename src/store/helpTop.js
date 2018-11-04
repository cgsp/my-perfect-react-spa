import { observable, action } from 'mobx'
import api, { http } from './../service'
import {
  message
} from 'antd'
import { timestampToTime } from './../utils'
import { sessionCache } from './../utils/cache'

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
  fetchHelpTopData(params) {
    http.get(api.QACATEGORIES, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
          item.createdTime = timestampToTime(item.createdTime)
          item.updatedTime = timestampToTime(item.updatedTime)
          item.key = item.id
        })
        this.saveMangeData(data.data)
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  fetchSecondHelpSecondData(params) {
    http.get(api.SECONDCATEGORIES, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
          item.createdTime = timestampToTime(item.createdTime)
          item.updatedTime = timestampToTime(item.updatedTime)
          item.key = item.id
        })
        this.saveMangeSecondData(data.data)
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  deleteHelpTopData(params, callback) {
    http.put(api.QADELETE, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        message.success('删除成功')
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  offlineHelpTopData(params, callback) {
    http.put(api.QAOFFLINE, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        message.success('下线成功')
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  fetchMaxOrderNum() {
    http.get(api.QAMAXORDERNUM).then((res) => {
      const { data } = res
      const { code, message } = data
      if (code === 0) {
        this.maxOrderNum = data.data
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  async createHelpTopData(params) {
    try {
      const { data } = await http.post(api.QACATEGORIES, params)
      const { code, message } = data
      if (code) throw message
    } catch (e) {
      message.error(e)
    }
  }

  @action
  editHelpTopData(keyWords, params, level) {
    http.put(`${api.QACATEGORIES}/${keyWords}`, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        const params = sessionCache.get('helpTop_value')
        level === 'helpTop' ?
          this.fetchHelpTopData(params) : this.fetchSecondHelpSecondData()
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  async fetchQaCategoryAll() {
    try {
      const { data } = await http.get(api.QACATEGORYALL)
      const { code, message } = data
      if (code) throw message
      this.qaCategoryAll = data.data
    } catch (e) {
      message.error(e)
    }
  }

  @action
  async fetchSecMaxOrderNum(params) {
    try {
      const { data } = await http.get(api.SECMAXORDERNUM, params)
      const { code, message } = data
      if (code) throw message
      this.secMaxOrderNum = data.data
    } catch (e) {
      message.error(e)
    }
  }



}

export default new Store()
