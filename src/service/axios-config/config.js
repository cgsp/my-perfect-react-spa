import http from "http";
import https from "https";
import { BASEAPIURL } from '@Constants'

let base_api_url = ''
let headers = {
  'Content-Type': 'application/json;charset=UTF-8',
}
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



export default {
  baseURL: base_api_url,
  // 自定义的请求头
  // headers: {
  //   'X-Requested-With': 'XMLHttpRequest'
  // },
  headers,
  // 超时设置
  // 跨域是否带Token
  withCredentials: true,
  // 响应的数据格式 json / blob /document /arraybuffer / text / stream
  responseType: "text",
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
};
