/* 
 * @Desc: 判断当前的开发环境
 * @Author: John.Guan 
 * @Date: 2019-02-18 14:02:51 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2019-02-18 14:19:43
 */

// 是否是本地开发环境
let isDev = false
// 是否是测试环境
let isTest = false
// 是否是生产环境
let isProd = false

switch (process.env.REACT_APP_BUILD_ENV) {
  case 'development':
    isDev = true
    isTest = false
    isProd = false
    break
  case 'test-production':
    isDev = false
    isTest = true
    isProd = false
    break
  case 'production':
    isDev = false
    isTest = false
    isProd = true
    break
  default:
    isDev = true
    isTest = false
    isProd = false
    break
}

export {
  isDev,
  isTest,
  isProd,
}
