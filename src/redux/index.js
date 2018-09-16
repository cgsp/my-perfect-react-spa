import { combineReducers } from 'redux'
import { navBarReducer } from './navBar'
import { commonSmallTypesReducer } from './commonSmallType'
import { commonTagAndDimesionsReducer } from './commonTagAndDimesion'
import { triggerModuleFormSubmitReducer } from './triggerModuleFormSubmit'

// 合并所有的reducer, 对外抛出
export default combineReducers({
  navBarReducer,
  commonSmallTypesReducer,
  commonTagAndDimesionsReducer,
  triggerModuleFormSubmitReducer
})
