// 合并所有的reducer
import { combineReducers } from 'redux'
import { navBarReducer } from './navBar'
import { navBarAndAuthReducer } from './navBarAndAuth'

// 对外抛出
export default combineReducers({ navBarReducer, navBarAndAuthReducer })
