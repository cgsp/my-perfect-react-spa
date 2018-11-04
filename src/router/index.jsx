import React, { Component } from 'react'
import MainFrame from '../dashboard/main-frame'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
// import { inject, observer } from 'mobx-react'

/**
 *  首页
 */
import Index from '@Pages/index'

/**
 *  404模块
 */
import NoMatch404 from '@Pages/no-match-404'


@withRouter
export default class Routes extends Component {
  render() {
    /**
      * 先对导航级的路由做控制，功能按钮级的，系统全部完成之后，最后再做控制
      * 功能按钮级的，现在show属性全部设置true, 系统全部完成之后，最后再做控制
     */
    const allNavList = [
      // 首页模块
      {
        path: '/index',
        component: Index,
        show: true
      },
      // 404模块
      {
        path: '/no-match-404',
        component: NoMatch404,
        show: true
      },
    ]
    const toDefaultUrl = '/index'
    const hasAuthNavList = allNavList.filter(item => item.show)
    return (
      <MainFrame>
        <Switch>
          <Route path="/" render={() => <Redirect to={toDefaultUrl} />} exact key="/" />
          {
            hasAuthNavList.map(item =>
              (
                <Route path={item.path} component={item.component} key={item.path} exact />
              )
            )
          }
          <Route path="/no-match-404" component={NoMatch404} />
          <Redirect to="/no-match-404" />
          <Redirect to={toDefaultUrl} />
        </Switch>
      </MainFrame>
    )
  }
}
