import { authRolePageNavAndAuthList } from '@Api'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/myStorages'

const NAV_AUTH_SUCCESS = 'NAV_AUTH_SUCCESS'
const initState = {
  appNavAndAuthPlain: mySessionStorageGet('app-nav-auth-plain', []),
  appNavAndAuthQian: mySessionStorageGet('app-nav-auth-qian', []),
  appNavAndAuthChecked: mySessionStorageGet('app-nav-auth-checked', []),
}

export function navBarAndAuthReducer(state = initState, action) {
  switch (action.type) {
    case NAV_AUTH_SUCCESS:
      return { ...state, appNavAndAuthPlain: action.payload, appNavAndAuthQian: handlePlainNavToQian(action.payload).qian, appNavAndAuthChecked: handlePlainNavToQian(action.payload).checked }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: NAV_AUTH_SUCCESS, payload: data }
}

// 根据平铺的数据，获取嵌套的数据
function handlePlainNavToQian(arr) {
  let temp = {
    checked: [],
    qian: []
  }
  return temp
}

export function getNavAndAuthData() {
  return (dispatch) => {
    // 发送请求
    authRolePageNavAndAuthList()
      .then((res) => {
        dispatch(getSuccess(res))
        mySessionStorageSet('app-nav-auth-plain', res)
        mySessionStorageSet('app-nav-auth-qian', handlePlainNavToQian(res).qian)
        mySessionStorageSet('app-nav-auth-checked', handlePlainNavToQian(res).checked)
      })
  }
}


