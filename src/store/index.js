import { observable, action } from 'mobx'
import { TOKEN, ENV } from '../utils/helper'
// import appCords from './appCords'
import catagories from './catagories'
import docContent from './docContent'
import helpTop from './helpTop'

import announcement from './announcement'
import helpContent from './helpContent'
import netWorkManage from './netWorkManage'
import userManages from './userManages'
import developerAudit from './developerAudit'
import applyAudit from './applyAudit'
import cookie from 'js-cookie'

class Store {
  @observable loading = false
  @observable token = TOKEN.replace('_token', '') + cookie.get(TOKEN)
  @observable isLogin = !!cookie.get(TOKEN)
  @observable env = ENV // production test

  @action
  changeLoading(state) {
    // console.log('changeLoading', state)
    this.loading = state
  }
}

export default {
  index: new Store(),
    // appCords,
    catagories,
    docContent,
    helpTop,
    announcement,
    helpContent,
    netWorkManage,
    userManages,
    developerAudit,
    applyAudit,
  // helpCenter
}
