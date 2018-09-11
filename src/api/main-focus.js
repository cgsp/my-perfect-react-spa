import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiMainFocusList = (options) => {
  return myAxios(
    {
      url: '/banners/query',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 获取主站专辑数据
export const apiMainFocusAddOrEdit = (options) => {
  return myAxios(
    {
      url: '/category/customizedCategory',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


