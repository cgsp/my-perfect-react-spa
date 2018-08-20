import { authRolePageNavAndAuthList } from '@Api'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/myStorages'
import { myGetJsonTree } from '@Utils/myGetJsonTree'

const NAV_AUTH_SUCCESS = 'NAV_AUTH_SUCCESS'
const initState = {
  appNavAndAuthPlain: mySessionStorageGet('app-nav-auth-plain', []),
  appNavAndAuthQian: mySessionStorageGet('app-nav-auth-qian', [])
}

export function navBarAndAuthReducer(state = initState, action) {
  switch (action.type) {
    case NAV_AUTH_SUCCESS:
      return { ...state, appNavAndAuthPlain: action.payload, appNavAndAuthQian: handlePlainNavToQian(action.payload) }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: NAV_AUTH_SUCCESS, payload: data }
}


// 根据平铺的数据，获取嵌套的数据
function handlePlainNavToQian(arr) {
  const tempArr = arr.slice()
  // 0是根节点的pid
  const result = myGetJsonTree(tempArr, '0')
  return result
}


export function getNavAndAuthData() {
  return (dispatch) => {
    // 发送请求
    authRolePageNavAndAuthList()
      .then((res) => {
        dispatch(getSuccess(res))
        mySessionStorageSet('app-nav-auth-plain', res)
        mySessionStorageSet('app-nav-auth-qian', handlePlainNavToQian(res))
      })
  }
}



