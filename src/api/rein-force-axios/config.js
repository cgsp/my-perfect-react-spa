import http from 'http'
import https from 'https'
import { BASE_API_URL } from '@Constants'
import { isDev, isTest, isProd } from '@Utils/judge-env'

let baseApiUrl = ''
let headers = {
  'Content-Type': 'application/json;charset=UTF-8',
}

const responseType = 'text'

if (isDev) {
  baseApiUrl = BASE_API_URL.dev
  headers['Index-Url'] = 'http://localhost:3000'
}

if (isTest) {
  baseApiUrl = BASE_API_URL.test
}

if (isProd) {
  baseApiUrl = BASE_API_URL.pro
}

const config = {
  baseURL: baseApiUrl,
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
