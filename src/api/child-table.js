import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiChildTableList = (options) => {
  return myAxios(
    {
      url: '/category/pagedCategories',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 编辑
export const apiChildTableEdit = (options) => {
  return myAxios(
    {
      url: '/category/customizedCategory',
      method: 'put',
      params: {},
      data: options,
      headers: defaultHeader
    })
}

// 新增
export const apiChildTableAdd = (options) => {
  return myAxios(
    {
      url: '/category/customizedCategory',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}




