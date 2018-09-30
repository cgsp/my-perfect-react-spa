import React, { Component } from 'react'
import MainFrame from '../dashboard/main-frame'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { asyncComponent } from './asyncComponent'

// 让路由对应的组件都是异步加载
// const NoMatch404 = asyncComponent(() => import('@Pages/no-match-404'))
// const Index = asyncComponent(() => import('@Pages/index'))
// const ChildTableAdd = asyncComponent(() => import('@Pages/child-table-add'))

import NoMatch404 from '@Pages/no-match-404'
import Index from '@Pages/index'
import ChildTableAdd from '@Pages/child-table-add'

@withRouter
@connect(
  state => state.navBarReducer,
  {}
)
export default class RootRoutes extends Component {
  static propTypes = {
    appRoutesList: PropTypes.array
  }

  render() {
    const navList = [
      {
        path: '/index',
        component: Index,
        hide: false
      },
      {
        path: '/child-table-add',
        component: ChildTableAdd,
        hide: false
      },
    ]
    const hasAuthNavList = navList.filter(item => !item.hide)
    const toFirstUrl = 'index'
    return (
      <MainFrame>
        <Switch>
          <Route path="/" render={() => <Redirect to={`/${toFirstUrl}`} />} exact key="/" />
          {hasAuthNavList.map(item => (
            <Route path={item.path} component={item.component} key={item.path} />
          ))}
          <Route path="/noMatch404" component={NoMatch404} key="/noMatch404" />
          <Redirect to="/noMatch404" />
        </Switch>
      </MainFrame>
    )
  }
}
