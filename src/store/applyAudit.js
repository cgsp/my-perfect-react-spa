import { observable, action } from 'mobx'
import api, { http } from './../service'
import {
  message
} from 'antd'
import { toJS } from 'mobx'
import { timestampToTime, numFormat, timestampToZeroTime } from './../utils'
class Store {
  @observable data = {}
  @observable serverData = {}
  @observable feeData = {}
  @observable currentInfo = {}

  @action
  async fetchApplyData(params) {
    try {
      const { data } = await http.get(api.AUDITAPPS, params)
      const { code, message } = data
      if (code) throw message
      const { dataList } = data.data
      dataList && dataList.length > 0 && dataList.map((item, index) => {
        item.applyTime = item.applyTime ? timestampToTime(item.applyTime) : '一一'
        item.auditTime = item.auditTime ? timestampToTime(item.auditTime) : '一一'
        item.estimatedOnlineDate = timestampToZeroTime(item.estimatedOnlineDate)
        item.primaryOrderCount = numFormat(item.primaryOrderCount)
        if (item.appBaseInfo && item.appBaseInfo.estimatedOnlineDate) {
          item.appBaseInfo.estimatedOnlineDate = timestampToZeroTime(item.appBaseInfo.estimatedOnlineDate)
        }
        if (item.appInfoBeforeAudit) {
          item.appInfoBeforeAudit.estimatedOnlineDate = timestampToZeroTime(item.appInfoBeforeAudit.estimatedOnlineDate)
          item.appInfoBeforeAudit.applyTime = item.appInfoBeforeAudit.applyTime ? timestampToTime(item.appInfoBeforeAudit.applyTime) : '一一'
          item.appInfoBeforeAudit.auditTime = item.appInfoBeforeAudit.auditTime ? timestampToTime(item.appInfoBeforeAudit.auditTime) : '一一'
          item.appInfoBeforeAudit.primaryOrderCount = numFormat(item.appInfoBeforeAudit.primaryOrderCount)
        }
        if (item.appType === 2) {
          item.clientOsTypes = '一一'
        }
        if (item.auditState === 2) {
          item.auditor = '一一'
          item.operation = '审核'
        } else {
          item.operation = '查看'
        }
        item.key = index
      })
      this.data = toJS(data.data)

    } catch (e) {
      message.error(e)
    }
  }

  @action
  async saveHighMobileData(key, params) {
    try {
      const { data } = await http.put(`${api.AUDITAPPS}/${key}`, params)
      const { code, message } = data
      if (code) throw message
    } catch (e) {
      message.error(e)
    }
  }

  @action
  async fetchServerData(params) {
    try {
      const { data } = await http.get(api.SERVERACCESS, params)
      const { code, message } = data
      if (code) throw message
      const { dataList } = data.data
      dataList && dataList.length > 0 && dataList.map((item, index) => {
        item.applyTime = item.applyTime ? timestampToTime(item.applyTime) : '一一'
        item.auditTime = item.auditTime ? timestampToTime(item.auditTime) : '一一'
        if (item.appType === 2) {
          item.clientOsTypes = '一一'
        }
        if (item.auditState !== 4) {
          item.auditFailReason = '一一'
        }
        if (item.auditState === 2) {
          item.auditor = '一一'
          item.operation = '审核'
        } else {
          item.operation = '查看'
        }
        item.key = index
      })

      this.serverData = toJS(data.data)

    } catch (e) {
      message.error(e)
    }
  }

  @action
  async passServer(key, params) {
    try {
      const { data } = await http.put(`${api.SERVERACCESS}/${key}`, params)
      const { code, message } = data
      if (code) throw message
      message.success('驳回成功')
      this.props.applyAudit.fetchServerData()
    } catch (e) {
      message.error(e)
    }
  }


  @action
  async fetchFeeData(params) {
    try {
      const { data } = await http.get(api.DISTRIBUTION, params)
      const { code, message } = data
      if (code) throw message
      const { dataList } = data.data
      dataList && dataList.length > 0 && dataList.map((item, index) => {
        item.applyTime = item.applyTime ? timestampToTime(item.applyTime) : '一一'
        item.auditTime = item.auditTime ? timestampToTime(item.auditTime) : '一一'
        if (item.auditState !== 4) {
          item.auditFailReason = '一一'
        }
        if (item.auditState === 2) {
          item.auditor = '一一'
          item.operation = ['通过', '驳回']
        }
        item.key = index
      })
      this.feeData = data.data

    } catch (e) {
      message.error(e)
    }
  }

  @action
  modifyCurrentData(params) {
    http.get(api.APP, params).then((res) => {
      const { data } = res || {}
      const { code, message } = data
      if (code === 0) {
        this.currentInfo = data.data
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }






}

export default new Store()
