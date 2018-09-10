import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiAuthMenuList = (options) => {
  options.current = options.pageNo
  delete options.pageNo
  return myAxios(
    {
      url: '/resource/list-resource',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 编辑
export const apiAuthMenuUpdateMenu = (options) => {
  return myAxios(
    {
      url: '/resource/update-resource',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader,
      emptyString: true
    })
}

// 新增
export const apiAuthMenuAddMenu = (options) => {
  return myAxios(
    {
      url: '/resource/add-resource',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader,
      emptyString: true
    })
}

// 删除
export const apiAuthMenuDeleteMenu = (id) => {
  return myAxios(
    {
      url: '/resource/delete-resource',
      method: 'post',
      params: {},
      data: [id],
      headers: defaultHeader
    })
}

// 查询当前节点下面有几个子节点
export const apiAuthMenuChild = (resourceId) => {
  return myAxios(
    {
      url: '/resource/get-child-resources',
      method: 'get',
      params: { resourceId },
      data: {},
      headers: defaultHeader
    })
}



