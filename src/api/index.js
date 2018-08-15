import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'

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
