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

// 另存为
export const apiChildTableSave = (options) => {
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
      url: '/sites',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}

// 获取会员领取的天数
export const apiChildGetDays = () => {
  return myAxios(
    {
      url: '/experience-vip/list',
      method: 'get',
      params: {},
      data: {},
      headers: defaultHeader
    })
}




