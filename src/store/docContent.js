import { observable, action } from 'mobx'
import api, { http } from './../service'
import { timestampToTime } from './../utils'

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
  fetchDocContentData(params) {
    http.get(api.DEVELOPERSDOCS, params).then((res) => {
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
    }).catch((e) => {
      console.log(e)
    })
  }

  @action
  fetchDocMaxOrderNum(params) {
    http.get(api.MAXDOCORDERNUM, params).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        console.log('data.data', data.data)
        this.maxOrderNum = data.data
      } else {
        message.error(message)
      }

    }).catch((e) => {
      console.log(e)
    })
  }

  // TODO: 获取分类列表
  @action
  fetchCatagoriesAll() {
    http.get(api.CATEGORIES).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        data.data.unshift({ id: -1, name: '全部' })
        this.cataList = data.data
      } else {
        message.error(message)
      }
    }).catch((e) => {
      console.log(e)
    })
  }

  @action
  editModeOk(keyword, params, callback) {
    keyword = `/${keyword}`
    const url = `${api.DEVELOPERSDOCS}${keyword}`
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
    }).catch((e) => {
      console.log(e)
    })
  }
}

export default new Store()
