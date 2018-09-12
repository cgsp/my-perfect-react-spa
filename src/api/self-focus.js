import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiSelfFocusList = (options) => {
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
export const apiSelfFocusAddOrEdit = (options) => {
  return myAxios(
    {
      url: '/banners/banner',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


