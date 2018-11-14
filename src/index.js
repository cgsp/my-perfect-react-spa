// 兼容性处理，兼容低版本浏览器
import 'babel-polyfill'
import 'raf/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
// import fastclick from 'fastclick'
// import vConsole from 'vconsole'

// 手机端fastclick事件注册
// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', function () {
//     fastclick.attach(document.body)
//   }, false)
// }

// 本地开发环境，vConsole注册
// if (process.env.REACT_APP_BUILD_ENV === 'development') {
//   new vConsole()
// }

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
