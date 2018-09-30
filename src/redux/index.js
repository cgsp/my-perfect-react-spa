import { combineReducers } from 'redux'
import { navBarReducer } from './navBar'

// 合并所有的reducer, 对外抛出
export default combineReducers({
  navBarReducer,
})
