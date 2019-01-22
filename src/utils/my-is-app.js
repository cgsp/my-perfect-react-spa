/* 
 * @Desc: 根据协议判断，当前页面，是不是APP里面的页面
 * @Author: John.Guan 
 * @Date: 2019-01-22 19:47:58 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2019-01-22 19:48:26
 */

// isApp = /iting/.test(navigator.userAgent.toLowerCase())
export const myIsApp = (appString) => {
  return appString.test(navigator.userAgent.toLowerCase())
}
