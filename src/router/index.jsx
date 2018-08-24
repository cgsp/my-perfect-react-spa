import React, { Component } from 'react'
import MainFrame from '../dashboard/main-frame'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { asyncComponent } from './asyncComponent'

// 让路由对应的组件都是异步加载
// const NoMatch404 = asyncComponent(() => import('@Pages/no-match-404'))
const MainAlbum = asyncComponent(() => import('@Pages/main-album'))
const MainFocus = asyncComponent(() => import('@Pages/main-focus'))
const MainListen = asyncComponent(() => import('@Pages/main-listen'))
const MainClassfiy = asyncComponent(() => import('@Pages/main-classfiy'))
const MainList = asyncComponent(() => import('@Pages/main-list'))
const SelfAlbum = asyncComponent(() => import('@Pages/self-album'))
const SelfFocus = asyncComponent(() => import('@Pages/self-focus'))
const SelfListen = asyncComponent(() => import('@Pages/self-listen'))
const SelfClassfiy = asyncComponent(() => import('@Pages/self-classfiy'))
const SelfTagTag = asyncComponent(() => import('@Pages/self-tag-tag'))
const SelfTagDimension = asyncComponent(() => import('@Pages/self-tag-dimension'))
const ChildTable = asyncComponent(() => import('@Pages/child-table'))
const AuthAccount = asyncComponent(() => import('@Pages/auth-account'))
const AuthRole = asyncComponent(() => import('@Pages/auth-role'))
const AuthMenu = asyncComponent(() => import('@Pages/auth-menu'))



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
        path: '/main-album',
        component: MainAlbum,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('main-album') > -1 : false
      },
      {
        path: '/main-focus',
        component: MainFocus,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('main-focus') > -1 : false
      },
      {
        path: '/main-listen',
        component: MainListen,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('main-listen') > -1 : false
      },
      {
        path: '/main-classfiy',
        component: MainClassfiy,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('main-classfiy') > -1 : false
      },
      {
        path: '/main-list',
        component: MainList,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('main-list') > -1 : false
      },
      {
        path: '/self-album',
        component: SelfAlbum,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('self-album') > -1 : false
      },
      {
        path: '/self-focus',
        component: SelfFocus,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('self-focus') > -1 : false
      },
      {
        path: '/self-listen',
        component: SelfListen,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('self-listen') > -1 : false
      },
      {
        path: '/self-classfiy',
        component: SelfClassfiy,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('self-classfiy') > -1 : false
      },
      {
        path: '/self-tag-tag',
        component: SelfTagTag,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('self-tag-tag') > -1 : false
      },
      {
        path: '/self-tag-dimension',
        component: SelfTagDimension,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('self-tag-dimension') > -1 : false
      },
      {
        path: '/child-table',
        component: ChildTable,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('child-table') > -1 : false
      },
      {
        path: '/auth-account',
        component: AuthAccount,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('auth-account') > -1 : false
      },
      {
        path: '/auth-role',
        component: AuthRole,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('auth-role') > -1 : false
      },
      {
        path: '/auth-menu',
        component: AuthMenu,
        hide: this.props.appRoutesList.length ? this.props.appRoutesList.indexOf('auth-menu') > -1 : false
      }
    ]
    const hasAuthNavList = navList.filter(item => item.hide)
    // const hasAuthNavList = navList.filter(item => !item.hide)
    // console.log(hasAuthNavList)
    const toUrl = this.props.appRoutesList[0] ? this.props.appRoutesList[0] : ''
    return (
      <MainFrame>
        <Switch>
          <Route path="/" render={() => <Redirect to={`/${toUrl}`} />} exact key="/" />
          {hasAuthNavList.map(item => (
            <Route path={item.path} component={item.component} key={item.path} />
          ))}
          {/* <Route path="/noMatch404" component={NoMatch404} key="/noMatch404" /> */}
          {/* <Route path="/*" component={NoMatch404} key="/noMatch404" /> */}
        </Switch>
      </MainFrame>
    )
  }
}
