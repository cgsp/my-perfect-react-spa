import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'

// 获取主站听单列表
export const mainListenList = (options) => {
  // console.log(options)
  options.columnFrom = 1
  if (options.sortIndex === 0) {
    options.orderBy = 'created_at'
  } else if (options.sortIndex === 1) {
    options.orderBy = 'updated_at'
  }
  delete options.sortIndex
  if (options.sortDirection === 'up') {
    options.desc = false
  } else {
    options.desc = true
  }
  delete options.sortDirection

  return myAxios(
    {
      url: '/column/list',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 获取菜单与按钮数据
export const mainListenTableList = (options) => {
  return myAxios(
    {
      url: 'mainListenTableList',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}

