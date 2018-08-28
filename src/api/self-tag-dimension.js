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

// 新增维度接口
export const apiSelfTagDimensionAdd = (options) => {
  return myAxios(
    {
      url: '/dimension/addDimension',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}

// 获取详情的列表数据
export const apiSelfTagDimensionDetailList = (options) => {
  return myAxios(
    {
      url: 'apiSelfTagDimensionDetailList',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}


// 删除的接口
export const apiSelfTagDimensionDelete = (id) => {
  return myAxios(
    {
      url: 'apiSelfTagDimensionDelete',
      method: 'post',
      params: {},
      data: { id },
      headers: defaultHeader
    })
}


