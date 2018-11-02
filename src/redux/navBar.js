import { mySessionStorageGet, mySessionStorageSet } from '@Utils/myStorages'

const NAV_BAR_SUCCESS = 'NAV_BAR_SUCCESS'
const initState = {
  appNavListData: mySessionStorageGet('app-nav-list', []),
  appRoutesList: mySessionStorageGet('app-route-list', []),
}

export function navBarReducer(state = initState, action) {
  switch (action.type) {
    case NAV_BAR_SUCCESS:
      return { ...state, appNavListData: action.menuTree, appRoutesList: screenRoutesList(action.menuTree) }
    default:
      return state
  }
}


function getSuccess(menuTree) {
  return { type: NAV_BAR_SUCCESS, menuTree }
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

export function getNavBarData(callBack) {
  return (dispatch) => {
    let menuTree = [
      {
        name: '首页',
        routePath: 'index',
        icon: 'home'
      },
      {
        name: '新建子站',
        routePath: 'child-table-add',
        icon: 'setting'
      }
    ]
    dispatch(getSuccess(menuTree))
    mySessionStorageSet('app-nav-list', menuTree)
    mySessionStorageSet('app-route-list', screenRoutesList(menuTree))
    callBack && callBack()
  }
}


