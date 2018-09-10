import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiSelfClassfiyList = (options) => {
  return myAxios(
    {
      url: '/category/pagedCategories',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}


// 获取详情的列表数据
export const apiSelfClassfiyDetail = (options) => {
  return myAxios(
    {
      url: '/category/pagedContents',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 编辑
export const apiSelfClassfiyEdit = (options) => {
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
export const apiSelfClassfiyAdd = (options) => {
  return myAxios(
    {
      url: '/category/customizedCategory',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}




