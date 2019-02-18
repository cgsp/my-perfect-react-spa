import { reinForceAxios } from '@Api/rein-force-axios'

// 获取列表数据
export const apiAuthAccountList = (options) => {
  return reinForceAxios(
    {
      url: '/user/list-users',
      method: 'GET',
      params: options,
      data: {},
    }
  )
}

// 编辑
export const apiAuthAccountUpdateRole = (options) => {
  return reinForceAxios(
    {
      url: '/user/user-bind-role',
      method: 'POST',
      params: {},
      data: options,
    }
  )
}

// 删除
export const apiAuthAccountDeleteRole = (id) => {
  return reinForceAxios(
    {
      url: '/user/clean-roles-under-user',
      method: 'POST',
      params: {},
      data: { userId: id },
    }
  )
}



