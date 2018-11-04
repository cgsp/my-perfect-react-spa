import { observable, action } from 'mobx'
import api, { http } from './../service'
import {
  message
} from 'antd'
import { timestampToTime } from './../utils'
class Store {
  @observable companyData = {}
  @observable personalData = {}

  @action
  async fetchCompanyData(params) {
    try {
      const { data } = await http.get(api.ENTERDEVELOPERS, params)
      const { code, message } = data
      if (code) throw message

      const componyObj = data.data
      componyObj.dataList && componyObj.dataList.length > 0 && componyObj.dataList.map((item, index) => {
        item.applyTime = item.applyTime ? timestampToTime(item.applyTime) : '一一'
        item.auditTime = item.auditTime ? timestampToTime(item.auditTime) : '一一'

        if (item.auditState === 2) {
          item.auditor = '一一'
          item.operation = '审核'
        } else {
          item.operation = '查看'
        }
        item.key = index
      })
      this.companyData = componyObj
    } catch (e) {
      message.error(e)
    }
  }

  @action
  async saveCompanyData(key, params) {
    try {
      const { data } = await http.put(`${api.ENTERDEVELOPERS}/${key}`, params)
      const { code, message } = data
      if (code) throw message
    } catch (e) {
      message.error(e)
    }
  }

  @action
  async fetchPersonalData(params) {
    try {
      const { data } = await http.get(api.INDIVIDEVELOPERS, params)
      const { code, message } = data
      if (code) throw message
      const personalObj = data.data

      personalObj.dataList && personalObj.dataList.length > 0 && personalObj.dataList.map((item, index) => {
        item.applyTime = item.applyTime ? timestampToTime(item.applyTime) : '一一'
        item.auditTime = item.auditTime ? timestampToTime(item.auditTime) : '一一'
        if (item.auditState === 2) {
          item.auditor = '一一'
          item.operation = '审核'
        } else {
          item.operation = '查看'
        }
        item.key = index
      })
      this.personalData = personalObj
    } catch (e) {
      message.error(e)
    }
  }

  @action
  async savePersonalData(key, params) {
    try {
      const { data } = await http.put(`${api.ENTERDEVELOPERS}/${key}`, params)
      const { code, message } = data
      if (code) throw message
    } catch (e) {
      message.error(e)
    }
  }
}

export default new Store()
