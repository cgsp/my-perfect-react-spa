import { commonSmallTypes } from '@Api'

const COMMON_SMALL_TYPE = 'COMMON_SMALL_TYPE'
const initState = {
  commonSmallTypes: []
}

export function commonSmallTypesReducer(state = initState, action) {
  switch (action.type) {
    case COMMON_SMALL_TYPE:
      return { ...state, commonSmallTypes: action.payload }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: COMMON_SMALL_TYPE, payload: data }
}

export function getCommonSmallTypes(type) {
  return (dispatch) => {
    // 发送请求
    commonSmallTypes(type)
      .then((res) => {
        dispatch(getSuccess(res.list))
      })
  }
}


