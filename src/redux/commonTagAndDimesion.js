import { commonDimesions, commonDimesionsAndTags } from '@Api'
import { ERR_OK } from '@Constants'
import { message } from 'antd'

const COMMON_DIMESION = 'COMMON_DIMESION'
const COMMON_DIMESION_TAG = 'COMMON_DIMESION_TAG'
const initState = {
  commonDimesions: [],
  commonDimesionsAndTags: []
}

export function commonTagAndDimesionsReducer(state = initState, action) {
  switch (action.type) {
    case COMMON_DIMESION:
      return { ...state, commonDimesions: action.payload }
    case COMMON_DIMESION_TAG:
      return { ...state, commonDimesionsAndTags: action.payload }
    default:
      return state
  }
}


function getDemensionsSuccess(data) {
  return { type: COMMON_DIMESION, payload: data }
}

function getDemensionsAndTagsSuccess(data) {
  return { type: COMMON_DIMESION_TAG, payload: data }
}

export function getCommonDimesions(callBack) {
  return (dispatch) => {
    // 发送请求
    commonDimesions()
      .then((res) => {
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        dispatch(getDemensionsSuccess(res.data))
        callBack && callBack()
      })
  }
}

export function getCommonDimesionsAndTags(callBack) {
  return (dispatch) => {
    // 发送请求
    commonDimesionsAndTags()
      .then((res) => {
        if (res.code !== ERR_OK) {
          message.error(res.msg)
          return
        }
        dispatch(getDemensionsAndTagsSuccess(res.data))
        callBack && callBack()
      })
  }
}


