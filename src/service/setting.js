/** 
 * 权限模块-系统导航
*/
// 获取用户信息
export const appUserInfo = 'user/info'
// 退出登录
export const appLogOut = 'logout'
// 获取当前登录用户，拥有的菜单和按钮
export const apiGetNavList = 'user/auth'
export const appAuthTree = 'resource/get-auth-tree'

/** 
 * 权限模块-账号
*/
// 获取所有账号
export const apiAllUserList = 'user/list-users'
// 清空某账号下的所有角色
export const apiCleanUserRoles = 'user/clean-roles-under-user'
// 给账号绑定角色
export const apiUserBindRoles = 'user/user-bind-role'


/** 
 * 权限模块-角色
*/
export const apiGetRoles = 'role/list-role'
export const apiDeleteRole = 'role/delete-roles'
export const apiRoleAdd = 'role/add-role'
export const apiRoleUpdate = 'role/update-role-info'
export const apiGetOneRoleMenuAndButtonIds = 'role/get-resources-with-select'
export const apiGetAuthTree = 'resource/get-auth-tree'




/** 
 * 权限模块-菜单
*/
export const apiAllMenuAndButton = 'resource/get-auth-tree'
export const apiAddMenuOrButton = 'resource/add-resource'
export const apiDeleteMenuOrButton = 'resource/delete-resource'
export const apiGetChildMenuOrButton = 'resource/get-child-resources'
export const apiEditMenuOrButton = 'resource/update-resource'

/** 
 * 权限模块-商务
 * 
*/
// 获取所有树形渠道
export const apiAllBusChannel = 'channel/get_all'
// 删除某个渠道
export const apiDeleteBusChannel = 'channel/delete'
// 创建新的渠道
export const apiAddBusChannel = 'channel/create'
// 编辑渠道
export const apiUpdateBusChannel = 'channel/update'
// 获取所有的一级商务渠道
export const apiFirstBusChannel = 'channel/get_first_level'
