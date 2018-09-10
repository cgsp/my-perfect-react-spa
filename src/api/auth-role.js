/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:46 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-09-03 17:58:36
 */
import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'
/*
 * 角色维护=====================================================
 */

// 获取角色列表数据
export const apiAuthRoleList = (options) => {
  options.current = options.page
  options.roleName = options.rolename
  delete options.rolename
  delete options.page
  return myAxios(
    {
      url: '/role/list-role',
      method: 'get',
      params: options,
      headers: defaultHeader
    })
}

// 新增时候，获取权限树数据
export const apiAuthTree = () => {
  return myAxios(
    {
      url: '/resource/get-auth-tree',
      method: 'get',
      params: {},
      headers: defaultHeader
    })
}

// 获取某个角色的权限和和全部的菜单与按钮
export const authRoleGetAllAndOne = (roleId) => {
  return myAxios(
    {
      url: '/role/get-resources-with-select',
      method: 'get',
      data: {},
      params: { roleId },
      headers: defaultHeader
    })
}

// 新增角色
export const authRoleAdd = (options) => {
  return myAxios(
    {
      url: '/role/add-role',
      method: 'post',
      data: options,
      headers: defaultHeader
    })
}

// 删除
export const authRoleDelete = (id) => {
  return myAxios(
    {
      url: '/role/delete-roles',
      method: 'post',
      data: [id],
      headers: defaultHeader
    })
}

// 编辑角色
export const authRoleEdit = (options) => {
  return myAxios(
    {
      url: '/role/update-role-info',
      method: 'post',
      data: options,
      headers: defaultHeader
    })
}


















