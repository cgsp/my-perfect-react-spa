/* 
 * @Desc: 判断设备的常用办法，暂列这几个
   暂列几个常用的,更多需要参照mars-detect扩展:
   mars-detect: https://github.com/QLFE/mars-detect
 * @Author: John.Guan 
 * @Date: 2019-01-23 19:35:49 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2019-01-23 19:36:57
 */
import detect from 'mars-detect'
// 是否是手机
const isPhone = detect.os.phone
// 是否是平板设备
const isTablet = detect.os.tablet

// 是否是ios
const isIos = detect.os.ios
// 是否是安卓
const isAndroid = detect.os.android
// 是否是windows phone
const isWinPhone = detect.os.wp

// 是否是微信
const isWeixin = detect.browser.weixin
// 是否是QQ
const isQQ = detect.browser.qq
// 是否是微博
const isWeibo = detect.browser.weibo
// 是否是webkit内核
const isWebkit = detect.browser.webkit
// 是否是谷歌
const isChrome = detect.browser.chrome
// 是否是火狐
const isFirefox = detect.browser.firefox
// 是否是IE
const isIE = detect.browser.ie

export {
  isPhone,
  isTablet,
  isIos,
  isAndroid,
  isWinPhone,
  isWeixin,
  isQQ,
  isWeibo,
  isWebkit,
  isChrome,
  isFirefox,
  isIE,
}
