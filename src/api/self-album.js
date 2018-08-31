import { myAxios } from '@Utils/myAxios'
import { defaultHeader } from './config'


// 获取列表数据
export const apiSelfAlbumList = (options) => {
  return myAxios(
    {
      url: '/custom/albums/search',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}


// 获取详情的列表数据
export const apiAlbumDetail = (options) => {
  return myAxios(
    {
      url: '/custom/tracks/forAlbum',
      method: 'get',
      params: options,
      data: {},
      headers: defaultHeader
    })
}


