import React, { Component } from 'react'
import MainFrame from '../base/MainFrame'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'

import MainAlbum from '@Pages/main-album'
import NoMatch404 from '@Pages/no-match-404'

@withRouter
export default class RootRoutes extends Component {
  render() {
    // 这个地方可以用一个数组来渲染，这样，就能避免，没有的节点出现在路由表里面了
    return (
      <MainFrame>
        <Switch>
          <Route path="/open-self-admin" render={() => <Redirect to="/mainAlbum" />} exact key="/" />
          <Route path="/mainAlbum" component={MainAlbum} key="/mainAlbum" />
          <Route path="/noMatch404" component={NoMatch404} key="/noMatch404" />
          <Redirect to="/noMatch404" />
          {/* <Route path="/*" component={NoMatch404} key="/noMatch404" /> */}
        </Switch>
      </MainFrame>
    )
  }
}
