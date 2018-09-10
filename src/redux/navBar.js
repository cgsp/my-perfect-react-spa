import { apiGetNavList } from '@Api'
import { ERR_OK } from '@Constants'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/myStorages'
import { message } from 'antd'

const NAV_BAR_SUCCESS = 'NAV_BAR_SUCCESS'
const initState = {
  appNavListData: mySessionStorageGet('app-nav-list', []),
  appRoutesList: mySessionStorageGet('app-route-list', []),
}

export function navBarReducer(state = initState, action) {
  switch (action.type) {
    case NAV_BAR_SUCCESS:
      return { ...state, appNavListData: action.payload, appRoutesList: screenRoutesList(action.payload) }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: NAV_BAR_SUCCESS, payload: data }
}

// 根据获取的导航数据，筛选出前端的路由列表
function screenRoutesList(arr) {
  let routesList = []
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
  return routesList
}

export function getNavBarData() {
  return (dispatch) => {
    // 发送请求
    apiGetNavList()
      .then((res) => {
        if (res.code !== ERR_OK) {
          message.error(res.message)
          return
        }
        let menuTree = [{
          name: '首页',
          routePath: 'index',
          icon: 'laptop'
        }]
        const resNav = JSON.parse(JSON.parse(res.data).menuTree).childResources
        console.log(JSON.parse(res.data))
        menuTree = menuTree.concat(resNav || [])
        // console.log(menuTree)
        dispatch(getSuccess(menuTree))
        mySessionStorageSet('app-nav-list', menuTree)
        mySessionStorageSet('app-route-list', screenRoutesList(menuTree))
      })
  }
}


