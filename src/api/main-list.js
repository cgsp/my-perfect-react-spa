import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiMainList = (options) => {
  return myAxios(
    {
      url: '/ranks',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}


// 获取详情的列表数据
export const apiMainListDetail = (options) => {
  return myAxios(
    {
      url: `/rank/${options.rankId}/albums`,
      method: 'get',
      params: {
        pageNo: options.pageNo,
        pageSize: options.pageSize
      },
      data: {},
      headers: defaultHeader
    })
}
