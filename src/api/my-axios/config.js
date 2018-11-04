import http from 'http'
import https from 'https'
import { BASEAPIURL } from '@Constants'

let base_api_url = ''
let headers = {
  'Content-Type': 'application/json;charset=UTF-8',
}
let responseType = 'text'
switch (process.env.REACT_APP_BUILD_ENV) {
  case 'development':
    base_api_url = BASEAPIURL.dev
    headers['Index-Url'] = 'http://localhost:3000'
    break
  case 'test-production':
    base_api_url = BASEAPIURL.test
    break
  case 'production':
    base_api_url = BASEAPIURL.pro
    break
  default:
    break
}

const config = {
  baseURL: base_api_url,
  // 跨域的时候，允许服务端设置cookies
  withCredentials: true,
  // 最多转发数，用于node.js
  maxRedirects: 5,
  // 最大响应数据大小
  maxContentLength: 2000,
  // 用于node.js
  httpAgent: new http.Agent({
    keepAlive: true
  }),
  httpsAgent: new https.Agent({
    keepAlive: true
  })
}

export { config, headers, responseType }
