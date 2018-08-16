import { apiGetNavList } from '@Api'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/myStorages'

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
    if (item.children.length) {
      item.children.forEach(secondItem => {
        if (!secondItem.children.length) {
          routesList.push(secondItem.path)
        } else {
          secondItem.children.forEach(thirdItem => {
            routesList.push(thirdItem.path)
          })
        }
      })
    }
  })
  return routesList
}

export function getNavBarData() {
  return (dispatch) => {
    // 发送请求
    apiGetNavList()
      .then((res) => {
        dispatch(getSuccess(res))
        mySessionStorageSet('app-nav-list', res)
        mySessionStorageSet('app-route-list', screenRoutesList(res))
      })
  }
}


