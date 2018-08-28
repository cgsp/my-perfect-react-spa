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

// 获取详情列表页面
export const mainListenTableList = (options) => {
  let url
  if (options.type === '专辑') {
    url = `/column/${options.id}/albums`
  } else {
    url = `/column/${options.id}/tracks`
  }
  return myAxios(
    {
      url,
      method: 'get',
      params: {
        pageNo: options.pageNo,
        pageSize: options.pageSize
      },
      data: {},
      headers: defaultHeader
    })
}

// 另存为
export const mainListenSave = (options) => {
  return myAxios(
    {
      url: '/column/add',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


