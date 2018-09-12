import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiMainClassfiyList = (options) => {
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
export const apiMainClassfiyDetail = (options) => {
  return myAxios(
    {
      url: '/category/pagedContents',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 获取主站专辑数据
export const apiMainClassfiyAddOrEdit = (options) => {
  options.source = 2
  return myAxios(
    {
      url: '/category/customizedCategory',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


