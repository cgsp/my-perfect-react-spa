import React, { Component } from 'react'
import { Button, Icon } from 'antd'
import './style.scss'
import fullScreen from './full-screen.png'
import fullScreenExit from './full-screen-exit.png'
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

  constructor(props) {
    super(props)
    this.state = {
      full: false
    }
    this.fullScreen = this.fullScreen.bind(this)
    this.fullScreenExit = this.fullScreenExit.bind(this)
  }

  fullScreen() {
    var docElm = document.documentElement
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    }
    else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen()
    }
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen()
    }
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen()
    }
    this.setState({
      full: true
    })
  }

  fullScreenExit() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    }
    this.setState({
      full: false
    })
  }
  render() {
    return (
      <div className="header-container">
        <div className="main-nav">
          <h1 style={{ fontSize: '20px' }}>开放平台自运营后台</h1>
          <div className="user-panel" >
            <div className="fullscreen">
              {
                !this.state.full ?
                  <img src={fullScreen} alt="" onClick={this.fullScreen} /> :
                  <img src={fullScreenExit} alt="" onClick={this.fullScreenExit} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
