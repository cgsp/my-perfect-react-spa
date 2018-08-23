// 合并所有的reducer
import { combineReducers } from 'redux'
import { navBarReducer } from './navBar'
import { navBarAndAuthReducer } from './navBarAndAuth'
import { commonSmallTypesReducer } from './commonSmallType'

// 对外抛出
export default combineReducers({ navBarReducer, navBarAndAuthReducer, commonSmallTypesReducer })
