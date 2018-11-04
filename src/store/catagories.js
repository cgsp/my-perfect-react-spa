import { observable, action } from 'mobx'
import api, { http } from './../service'
import { timestampToTime } from './../utils'
class Store {
  @observable maxOrderNum = 0
  @observable catagoriesList = []

  @action
  saveManageData(info) {
    this.catagoriesList = info
  }

  @action
  fetchCatagoriesData(params) {
    http.get(api.CATEGORIESSHOW, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code) throw message
      if (code === 0) {
        data.data && data.data.length > 0 && data.data.map((item, index) => {
          item.createdTime = timestampToTime(item.createdTime)
          item.updatedTime = timestampToTime(item.updatedTime)
          item.key = item.id
        })
        this.saveManageData(data.data)
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })

  }

  @action
  fetchMaxOrderNum() {
    http.get(api.MAXORDERNUM).then((res) => {
      const data = res.data || {}
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
  async deleteCataItem(reqParams, callback) {
    http.put(api.CATEDELETE, reqParams).then((res) => {
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
  removeItem(reqParams, callback) {
    http.put(api.CATEOFFLINE, reqParams).then((res) => {
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
  async confirmCreateData(params, callback) {
    http.post(api.CATEGORIESSHOW, params).then((res) => {
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
  async editModeOk(keyword, params, callback) {
    const url = `${api.CATEGORIESSHOW}/${keyword}`
    http.put(url, params).then((res) => {
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
}

export default new Store()
