import React, { Component } from 'react'
// import { BrowserRouter as Router } from 'react-router-dom'
import { HashRouter as Router } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { Provider } from 'mobx-react'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import '@Assets/style/reset-pc'
import '@Assets/style/main-frame'
import '@Assets/style/app'

import RootRoutes from '@Router'
import Stores from '@Store'

class App extends Component {
  render() {
    return (
      <Provider {...Stores}>
        <LocaleProvider locale={zhCN}>
          <Router>
            <RootRoutes />
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default App
