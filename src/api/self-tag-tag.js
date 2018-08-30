import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiSelfTagTagList = (options) => {
  return myAxios(
    {
      url: '/tag/queryTagsByPage',
      method: 'get',
      params: options,
      data: {},
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
      url: '/tag/deleteTag',
      method: 'put',
      params: { id },
      data: {},
      headers: defaultHeader
    })
}

// 添加维度的接口
export const apiSelfAddDimension = (options) => {
  return myAxios(
    {
      url: '/dimension/addDimension',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


// 新增标签或者编辑标签
export const apiSelfAddOrEdit = (options) => {
  let url
  let method
  if (options.type === '新增标签') {
    method = 'post'
    url = '/tag/addTag'
  } else {
    method = 'put'
    url = '/tag/updateTag'
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

// 查看详情
export const apiSelfTagDetail = (options) => {
  return myAxios(
    {
      url: '/tag/albums',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}


