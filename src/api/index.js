/*
 * @Author: John.Guan 
 * @Date: 2018-08-18 22:25:46 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-21 16:36:09
 */
import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'
import jsonp from 'fetch-jsonp'
import querystring from 'querystring'

// 获取用户信息
// export const getUserInfo = () => myAxios({ url: 'user/info', headers: defaultHeader })

// // 注册
// export const register = (data) => { return myAxios({ url: 'user/register', method: 'post', data, headers: defaultHeader }) }

// // 登录
// export const login = (data) => { return myAxios({ url: 'user/login', method: 'post', data, headers: defaultHeader }) }

// // 更新用户信息
// export const update = (data) => { return myAxios({ url: 'user/update', method: 'post', data, headers: defaultHeader }) }

// // 获取用户列表数据
// export const userList = (type) => { return myAxios({ url: 'user/list', method: 'get', params: { type }, headers: defaultHeader }) }

// 获取导航和按钮权限功能
export const apiGetNavList = () => myAxios({ url: 'appNavList', method: 'get', headers: defaultHeader })

/*
 * 账号维护=====================================================
 */

// 获取用户
export const apiGetUserList = (value) => {
  const str = querystring.encode({
    code: 'utf-8',
    q: value,
  })

  return jsonp(`https://suggest.taobao.com/sug?${str}`)
}

// 获取角色
export const apiGetAuthAccountPageRolesList = () => {
  return myAxios(
    {
      url: 'authAccountPageRoleList',
      method: 'get',
      params: {},
      headers: defaultHeader
    })
}

// 获取列表数据
export const apiGetAuthAccountList = ({ page, pageSize, rolename, username }) => {
  return myAxios(
    {
      url: 'authAccountList',
      method: 'get',
      params: { page, pageSize, rolename, username },
      headers: defaultHeader
    })
}
// 新增
export const apiGetAuthAccountPageAddLine = ({ username, roleArr }) => {
  return myAxios(
    {
      url: 'authAccountAdd',
      method: 'post',
      params: {},
      data: {
        username,
        roleArr
      },
      headers: defaultHeader
    })
}
// 删除
export const apiGetAuthAccountPageDeleteLine = ({ id }) => {
  console.log(id)
  return myAxios(
    {
      url: 'authAccountDelete',
      method: 'post',
      params: {},
      data: {
        id
      },
      headers: defaultHeader
    })
}

/*
 * 角色维护=====================================================
 */

// 获取角色列表数据
export const apiGetAuthRolePageList = ({ page, pageSize, rolename }) => {
  return myAxios(
    {
      url: 'authRolePageList',
      method: 'get',
      params: { page, pageSize, rolename },
      headers: defaultHeader
    })
}

// 删除
export const authRolePageListDelete = ({ roleid }) => {
  return myAxios(
    {
      url: 'authRolePageListDelete',
      method: 'post',
      data: { roleid },
      headers: defaultHeader
    })
}

// 获取某个整个app的权限和菜单
export const authRolePageNavAndAuthList = () => {
  return myAxios(
    {
      url: 'authRolePageNavAndAuthList',
      method: 'get',
      data: {},
      headers: defaultHeader
    })
}
// 获取某个角色的权限和菜单
export const authRolePageNavAndAuthSomeRole = ({ roleid }) => {
  return myAxios(
    {
      url: 'authRolePageNavAndAuthSomeRole',
      method: 'post',
      data: { roleid },
      headers: defaultHeader
    })
}

// 新增或者编辑角色
export const authRolePageListAdd = ({ rolename, roledesc, checkedIds }) => {
  return myAxios(
    {
      url: 'authRolePageListAdd',
      method: 'post',
      data: { rolename, roledesc, checkedIds },
      headers: defaultHeader
    })
}

/*
 * 菜单维护=====================================================
 */

// 获取菜单与按钮数据
export const apiGetAuthMenuPageList = ({ page, pageSize, searchname, searchtype, searchlevel }) => {
  return myAxios(
    {
      url: 'authMenuPageList',
      method: 'get',
      params: { page, pageSize, searchname, searchtype, searchlevel },
      headers: defaultHeader
    })
}
// 删除
export const authMenuPageListDelete = ({ id }) => {
  return myAxios(
    {
      url: 'authMenuPageListDelete',
      method: 'post',
      params: {},
      data: { id },
      headers: defaultHeader
    })
}

//  新增或者修改节点
export const authMenuPageListAddorEdit = ({
  pid,
  newnamem,
  icon,
  url,
  code,
  type,
  level,
  sort
}) => {
  return myAxios(
    {
      url: 'authMenuPageListAddorEdit',
      method: 'post',
      params: {},
      data: {
        pid,
        newnamem,
        icon,
        url,
        code,
        type,
        level,
        sort
      },
      headers: defaultHeader
    })
}





