import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据111
export const apiAuthAccountList = (options) => {
  options.current = options.pageNo
  delete options.pageNo
  return myAxios(
    {
      url: '/user/list-users',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 真实姓名模糊匹配
export const apiAuthAllUser = (options) => {
  return myAxios(
    {
      url: '/user/list-hr-users',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}

// 角色模糊匹配
export const apiAuthAllRole = (options) => {
  return myAxios(
    {
      url: '/role/list-role',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}
// 获取角色列表
export const apiAuthAccountGetRoles = () => {
  return myAxios(
    {
      url: '/role/list-role',
      method: 'get',
      params: {
        current: 1,
        pageSize: 500
      },
      data: {},
      headers: defaultHeader
    })
}

// 编辑
export const apiAuthAccountUpdateRole = (options) => {
  return myAxios(
    {
      url: '/user/user-bind-role',
      method: 'post',
      params: {},
      data: options,
      headers: defaultHeader
    })
}

// 删除
export const apiAuthAccountDeleteRole = (id) => {
  return myAxios(
    {
      url: '/user/delete-user',
      method: 'post',
      params: {},
      data: { userId: id },
      headers: defaultHeader
    })
}



