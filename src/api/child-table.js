import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiChildTableList = (options) => {
  return myAxios(
    {
      url: '/sites',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 获取合作方的模糊搜索
export const apiChildParter = (options) => {
  return myAxios(
    {
      url: '/apps/search',
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




