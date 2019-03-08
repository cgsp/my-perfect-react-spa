import { reinForceAxios } from '@Api/rein-force-axios'

// 获取列表数据
export const apiRefreshListData = (page) => {
  console.log('page:', page)
  return reinForceAxios(
    {
      url: `list-data/${page}`,
      method: 'GET',
      params: {},
      data: {},
    }
  )
}



