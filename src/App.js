import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import './assets/style/reset'

import Routes from './Routes'
import stores from './store'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <LocaleProvider locale={zhCN}>
          <Router basename = 'openapi-admi'>
            <Routes />
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default hot(module)(App)
