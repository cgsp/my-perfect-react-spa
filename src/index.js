// 兼容性处理，兼容低版本浏览器
import 'babel-polyfill'
import 'raf/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App.jsx'
import registerServiceWorker from './registerServiceWorker'

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

console.log(process.env.NODE_ENV)
// 用下面这个变量作为环境变量
// 分别是development,test-production,production
console.log(process.env.REACT_APP_BUILD_ENV)
