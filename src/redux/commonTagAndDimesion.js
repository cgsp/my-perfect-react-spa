import { commonDimesions } from '@Api'

const COMMON_DIMESION = 'COMMON_DIMESION'
const initState = {
  commonDimesions: []
}

export function commonTagAndDimesionsReducer(state = initState, action) {
  switch (action.type) {
    case COMMON_DIMESION:
      return { ...state, commonDimesions: action.payload }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: COMMON_DIMESION, payload: data }
}

export function getCommonDimesions(type) {
  return (dispatch) => {
    // 发送请求
    commonDimesions(type)
      .then((res) => {
        dispatch(getSuccess(res.list))
      })
  }
}


