import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiSelfTagDimensionList = (options) => {
  return myAxios(
    {
      url: '/dimension/queryDimensionsByPage',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 新增维度或者编辑维度,添加标签
export const apiSelfTagDimensionAddOrEdit = (options) => {
  let url
  let method
  if (options.type === '新增维度') {
    url = '/dimension/addDimension'
    method = 'post'
  } else if (options.type === '编辑维度') {
    url = '/dimension/updateDimension'
    method = 'put'
  } else if (options.type === '添加标签') {
    url = '/tag/addTag'
    method = 'post'
  } else {
    url = '/tag/updateTag'
    method = 'put'
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

// 获取详情的列表数据
export const apiSelfTagDimensionDetailList = (options) => {
  return myAxios(
    {
      url: '/tag/queryTagsByPage',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}


// 删除的接口
export const apiSelfTagDimensionDelete = (id) => {
  return myAxios(
    {
      url: '/dimension/deleteDimension',
      method: 'put',
      params: { id },
      data: {},
      headers: defaultHeader
    })
}

// 详情里面的删除的接口
export const apiSelfTagDetailDelete = (id) => {
  return myAxios(
    {
      url: '/tag/deleteTag',
      method: 'put',
      params: { id },
      data: {},
      headers: defaultHeader
    })
}


