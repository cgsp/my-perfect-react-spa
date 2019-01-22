/* 
 * @Desc: 更推荐写一个react组件公用,这里抽离一个方法的方式难以满足更多需求
 * @Author: John.Guan 
 * @Date: 2019-01-22 19:35:53 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2019-01-22 19:37:47
 */

import detect from 'mars-detect'

/**
 * 启动喜马拉雅app:
 *  1.微信屏蔽了直接唤起app,所以选择跳转对应下载页;
 *  2.不通过以下方式,直接暴力跳往'//m.ximalaya.com/applink',也可以;
 *
 * 不错的参考实践: https://www.cnblogs.com/simba-lkj/p/8027809.html
 */
// 如何使用
// const appUrl = redeemType === 2 ? `iting://open?msg_type=13&album_id=${albumId}` : 'iting://open?msg_type=99'
// myOpenApp(appUrl)

export function myOpenApp(appUrl) {
  const isIos = detect.os.ios
  const isAndroid = detect.os.android
  const isWeixin = detect.browser.weixin
  const startTime = Date.now()
  const timeout = 3000

  let iframe = null
  let timer = null
  // 微信屏蔽了直接唤起app,所以选择跳转对应下载页
  if (isWeixin) {
    // 安卓前往应用宝下载页,其他进入另一种下载页
    const url = isAndroid ? '//www.ximalaya.com/down' : '//m.ximalaya.com/applink'
    window.location.href = url
    return
  }

  // ios直接启动更好
  if (isIos) {
    window.location.href = appUrl
  }
  // 安卓通过iframe启动更好
  if (isAndroid) {
    iframe = document.createElement('iframe')
    iframe.src = appUrl
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  }

  timer = setTimeout(() => {
    iframe && document.body.removeChild(iframe)
    /**
     * 唤起失败
     * (成功唤起了app,会将当前浏览器切到后台,导致定时器变慢,以此来认定唤起失败.)
     */
    if (Date.now() - startTime < timeout + 300) {
      window.location.href = isAndroid ? '//www.ximalaya.com/down' : '//m.ximalaya.com/applink'
      // 下载链接
      // window.location.href = '//www.ximalaya.com/down'
      // 公用下载页面地址
      // window.location.href = '//m.ximalaya.com/applink'
    }
  }, timeout)

  // 检测切换事件,移除定时. - (这个能解决主流设备,启动成功后切回浏览器,避免进入下载.)
  document.addEventListener('visibilitychange', function () {
    const tag = document.hidden || document.webkitHidden
    tag && clearTimeout(timer)
  })
  document.addEventListener('webkitvisibilitychange', function () {
    const tag = document.hidden || document.webkitHidden
    tag && clearTimeout(timer)
  })
  window.addEventListener('pagehide', function () {
    clearTimeout(timer)
  })
}
