import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'

// 获取自运营听单列表
export const selfListenList = (options) => {
  // console.log(options)
  options.columnFrom = 2
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
export const selfListenTableList = (options) => {
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
// 新增或者编辑听单
export const selfListenAddorEdit = (options) => {
  let url
  let method
  if (options.type === '新增') {
    url = '/column/add'
    method = 'post'
  } else {
    url = '/column/update'
    method = 'put'
  }
  delete options.type
  return myAxios(
    {
      url,
      method,
      params: {},
      data: options,
      headers: defaultHeader
    })
}

