import { observable, action } from 'mobx'
import api, { http } from './../service'
import { timestampToTime } from './../utils'

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
    http.get(api.HELPCENTERQA, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        data.data && data.data.dataList.length > 0 && data.data.dataList.map((item, index) => {
          item.createdTime = timestampToTime(item.createdTime)
          item.updatedTime = timestampToTime(item.updatedTime)
          item.key = item.id
          item.helpCate = `${item.parentTitle}-${item.categoryTitle}`
        })
        this.saveMangeData(data.data)
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  // TODO: 创建
  @action
  updateHelpConData(key, params, callback) {
    http.put(`${api.HELPCENTERQA}/${key}`, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
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
  deleteHelpConData(params, callback) {
    http.put(api.QADELETECON, params).then((res) => {
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
  offlineHelpConData(params, callback) {
    http.put(api.QAOFFLINECON, params).then((res) => {
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
  fetchMaxOrderNum(params) {
    http.get(api.QAMAXORDERNUMCON, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        this.helpMaxOrderNum = data.data
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action
  async fetchCategoryTree() {
    http.get(api.QACATETREE).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        this.treeCategory = data.data
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}

export default new Store()
