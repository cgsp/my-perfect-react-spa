import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取菜单与按钮数据
export const mainListenList = (options) => {
  return myAxios(
    {
      url: 'mainListenList',
      method: 'put',
      params: {},
      data: options,
      headers: defaultHeader
    })
}
