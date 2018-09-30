import React, { Component } from 'react'
// import { BrowserRouter as Router } from 'react-router-dom'
import { HashRouter as Router } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import { ROUTE_BASE } from '@Constants'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

// 引入redux
import { createStore, applyMiddleware, compose } from 'redux'

// 引入redux-thunk
import thunk from 'redux-thunk'

// 引入react-redux
import { Provider } from 'react-redux'

// 引入reducers
import reducers from '@Redux'

// redux的调试工具,不存在的话，就是一个空函数
// 有装插件的话，这个函数就存在
const reduxDevtools = window.devToolsExtension ? window.devToolsExtension() : f => f

// 创建store
const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  reduxDevtools
))

// 查看初始的store的数据
// console.log(store.getState());

// 引入全局的样式
import './assets/style/reset'
import './assets/style/app'

// 引入根路由
import RootRoutes from './router'

const DEV = process.env.NODE_ENV !== 'production'
let basename
if (DEV) {
  basename = ROUTE_BASE.dev
} else {
  basename = ROUTE_BASE.pro
}
// basename="openapi-content-admin-app"

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <Router basename={basename}>
            <RootRoutes />
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default App


