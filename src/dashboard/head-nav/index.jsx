import React, { Component } from 'react'
import './style.scss'
// import {Icon} from 'antd'
// import Cookies from 'js-cookie'
// import {withRouter, Link} from 'react-router-dom'
// import {TOKEN, goLogin} from '../../utils/helper'
export default class HeadNav extends Component {

  // login = () => {
  //     // Cookies.remove(TOKEN, {path: '/', domain: '.ximalaya.com'})
  //     // goLogin()
  //     console.log('登录')
  // }

  // logout = () => {
  //     // Cookies.remove(TOKEN, {path: '/', domain: '.ximalaya.com'})
  //     // window.location.reload()
  //     console.log('退出')
  // }

  render() {
    return (
      <div className="header-container">
        <div className="main-nav">
          <h1 style={{ fontSize: '20px' }}>开放平台自运营后台</h1>
          <div className="user-panel" />
        </div>
      </div>
    )
  }
}
