import { observable, action } from 'mobx'
import { http } from '@Service'
import { apiGetNavList } from '@Service/setting'
import { message } from 'antd'
import { SUCCESS_OK, noAuthCode } from '@Constants'
import { handleAppButtons } from '@Utils/getAppButton'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/my-storages'

// 根据获取的导航数据，筛选出前端的路由列表
function screenRoutesList(arr) {
  let routesList = []
  // 获取权限路由导航
  arr.forEach(item => {
    if (item.childResources && item.childResources.length) {
      item.childResources.forEach(secondItem => {
        if (secondItem.childResources && secondItem.childResources.length) {
          secondItem.childResources.forEach(thirdItem => {
            routesList.push(thirdItem.routePath)
          })
        } else {
          routesList.push(secondItem.routePath)
        }
      })
    } else {
      routesList.push(item.routePath)
    }
  })

  // 获取一级导航，以及一级导航的第一个跳转页面
  let firsrArr = []
  const routesArr = routesList.slice()
  arr.forEach(item => {
    let bol = false
    // let toUrl
    routesArr.forEach(route => {
      if (!bol && route.indexOf(item.routePath) > -1 && item.routePath.indexOf('!F1-') > -1) {
        firsrArr.push({
          name: item.name,
          toUrl: route,
          path: item.routePath
        })
        bol = true
      }
    })
  })
  return {
    routesList,
    firsrArr
  }
}


class Store {
  @observable appNavListData = mySessionStorageGet('app-nav-list', [])
  @observable appRoutesList = mySessionStorageGet('app-route-list', [])
  @observable appFirstRoutesList = mySessionStorageGet('app-first-route-list', [])
  @observable appButtonList = mySessionStorageGet('app-button-list', [])
  @observable appRolesList = mySessionStorageGet('app-rules-list', [])

  @action
  geteUserNavBarData(callBack) {
    http.get(apiGetNavList).then((res) => {
      const resp = res
      // console.log(resp)
      if (resp.code !== SUCCESS_OK && resp.code !== noAuthCode) {
        message.error(resp.message)
        return
      }

      const rolesList = resp.data.roles || []

      let menuTree = [{
        name: '首页',
        routePath: '/!F1-index',
        childResources: [
          {
            icon: 'home',
            name: '首页',
            routePath: '/!F1-index',
          }
        ]
      }]

      let buttonList = []
      // 如果正常
      if (resp.code === SUCCESS_OK) {
        // console.log(JSON.parse(res.data))
        let resNav
        if (resp.data.menuTree) {
          resNav = JSON.parse(resp.data.menuTree).childResources
        }
        else {
          resNav = undefined
        }
        menuTree = menuTree.concat(resNav || [])

        if (resp.data.functionList) {
          buttonList = resp.data.functionList
        }
        else {
          buttonList = undefined
        }
      }
      mySessionStorageSet('app-nav-list', menuTree)
      mySessionStorageSet('app-route-list', screenRoutesList(menuTree).routesList)
      mySessionStorageSet('app-button-list', handleAppButtons(buttonList))
      mySessionStorageSet('app-first-route-list', screenRoutesList(menuTree).firsrArr)
      mySessionStorageSet('app-rules-list', rolesList)
      this.appNavListData = menuTree
      this.appRoutesList = screenRoutesList(menuTree).routesList
      this.appButtonList = handleAppButtons(buttonList)
      this.appFirstRoutesList = screenRoutesList(menuTree).firsrArr
      this.appRolesList = rolesList
      // console.log(menuTree)
      // console.log(screenRoutesList(menuTree).routesList)
      // console.log(handleAppButtons(buttonList))
      // console.log(screenRoutesList(menuTree).firsrArr)
      callBack && callBack(res)
    })
  }
}

export default new Store()
