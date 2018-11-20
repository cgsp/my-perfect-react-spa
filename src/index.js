// 兼容性处理，兼容低版本浏览器
import 'babel-polyfill'
import 'raf/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import fastclick from 'fastclick'
import vConsole from 'vconsole'

// 手机端fastclick事件注册
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    fastclick.attach(document.body)
  }, false)
}

// 本地开发环境，vConsole注册
if (process.env.REACT_APP_BUILD_ENV === 'development') {
  new vConsole()
}

// 引入一些没办法进行Npm安装的库，和script脚本(如browser.js和rem.js)
import '@Utils/libraries/browser'

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(
    <AppContainer warnings={false}>
      <Component />
    </AppContainer>,
    root,
  )
}

render(App)

// 如果有需要热更新的代码的话
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}

registerServiceWorker()

// 用下面这个变量作为环境变量
// 分别是development,test-production,production
console.log(process.env.REACT_APP_BUILD_ENV)

// 执行rem布局的适配
// designWidth:设计稿的实际宽度值，需要根据实际设置
// maxWidth:制作稿的最大宽度值，需要根据实际设置
// 这段js的最后面有两个参数记得要设置，一个为设计稿实际宽度，一个为制作稿最大宽度，例如设计稿为750，最大宽度为750，则为(750,750)
// window.onload = function () {
//   (function (designWidth, maxWidth) {
//     var doc = document
//     var win = window
//     var docEl = doc.documentElement
//     var remStyle = document.createElement('style')
//     var timer = null

//     function refreshRem() {
//       var width = docEl.getBoundingClientRect().width
//       // console.log(width)
//       maxWidth = maxWidth || 540
//       // 如果当前的屏幕宽度，大于最大的屏幕宽度（750），那么，采用最大的屏幕宽度（750）
//       width > maxWidth && (width = maxWidth)
//       var rem = width * 100 / designWidth
//       // console.log(rem)
//       remStyle.innerHTML = 'html{font-size:' + rem + 'px;}'
//     }

//     if (docEl.firstElementChild) {
//       docEl.firstElementChild.appendChild(remStyle)
//     } else {
//       var wrap = doc.createElement('div')
//       wrap.appendChild(remStyle)
//       doc.write(wrap.innerHTML)
//       wrap = null
//     }
//     // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次
//     refreshRem()

//     win.addEventListener('resize', function () {
//       clearTimeout(timer)
//       // 防止执行两次
//       timer = setTimeout(refreshRem, 300)
//     }, false)

//     win.addEventListener('pageshow', function (e) {
//       if (e.persisted) {
//         // 浏览器后退的时候重新计算
//         clearTimeout(timer)
//         timer = setTimeout(refreshRem, 300)
//       }
//     }, false)

//     // 如果不用rem的话，那么字体大小采用body的默认字体16px
//     if (doc.readyState === 'complete') {
//       doc.body.style.fontSize = '16px'
//     } else {
//       doc.addEventListener('DOMContentLoaded', function (e) {
//         doc.body.style.fontSize = '16px'
//       }, false)
//     }
//   })(750, 750)
// }

