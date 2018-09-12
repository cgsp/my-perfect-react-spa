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

// 编辑与新增
export const apiSelfFocusAddOrEdit = (options) => {
  let method
  if (options.type === '新增') {
    method = 'post'
  } else {
    method = 'put'
  }
  delete options.type
  
  return myAxios(
    {
      url: '/banners/banner',
      method,
      params: {},
      data: options,
      headers: defaultHeader
    })
}


