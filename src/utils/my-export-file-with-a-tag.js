import { message } from 'antd'
import { BASEDOWNLOADAPIURL } from '@Constants'

export const myExportFile = (url, paramsObj) => {
  if (!url) {
    // url
    message.error('请输入导出url')
    return
  }

  let base_down_load_api_url = ''
  switch (process.env.REACT_APP_BUILD_ENV) {
    case 'development':
      base_down_load_api_url = BASEDOWNLOADAPIURL.dev
      break
    case 'test-production':
      base_down_load_api_url = BASEDOWNLOADAPIURL.test
      break
    case 'production':
      base_down_load_api_url = BASEDOWNLOADAPIURL.pro
      break
    default:
      break
  }

  let str
  if (!paramsObj) {
    str = base_down_load_api_url + url
  } else {
    str = base_down_load_api_url + url + '?'

    for (const key in paramsObj) {
      if (paramsObj[key] || paramsObj[key] === 0 || paramsObj[key] === false) {
        str += `${key}=${paramsObj[key]}&`
      }
    }
    str = str.slice(0, -1)
  }
  console.log(str)
  let a = document.createElement('a')
  document.body.appendChild(a)
  a.setAttribute('style', 'display:none')
  a.setAttribute('href', str)
  a.setAttribute('download', '列表')
  a.click()
}
