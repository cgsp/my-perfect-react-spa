import { apiGetNavList } from '@Api'

const NAV_BAR_SUCCESS = 'NAV_BAR_SUCCESS'
const initState = {
  appNavListData: []
}

export function navBarReducer(state = initState, action) {
  switch (action.type) {
    case NAV_BAR_SUCCESS:
      return { ...state, appNavListData: action.payload }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: NAV_BAR_SUCCESS, payload: data }
}

export function getNavBarData(data) {
  return (dispatch) => {
    // 发送请求
    apiGetNavList()
      .then((res) => {
        dispatch(getSuccess(res))
      })
  }
}


