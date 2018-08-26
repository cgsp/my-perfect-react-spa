import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiSelfTagTagList = (options) => {
  return myAxios(
    {
      url: 'apiSelfTagTagList',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}

// 获取详情的列表数据
export const apiSelfTagTagDetailList = (options) => {
  return myAxios(
    {
      url: 'apiSelfTagTagDetailList',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


// 删除的接口
export const apiSelfTagTagDelete = (id) => {
  return myAxios(
    {
      url: 'apiSelfTagTagDelete',
      method: 'post',
      params: {},
      data: { id },
      headers: defaultHeader
    })
}


