import React, { Component } from 'react'
import './style.scss'
import fullScreen from './full-screen.png'
import fullScreenExit from './full-screen-exit.png'

export default class HeadNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      full: false
    }
    this.fullScreen = this.fullScreen.bind(this)
    this.fullScreenExit = this.fullScreenExit.bind(this)
  }

  // 全屏
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

  // 取消全屏
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
        <h1 className="left">
          <span>开放平台四大中心</span>
        </h1>
        <div className="first-menu">
          顶部导航
        </div>
        <div className="user-panel">
          <ul className="right-handdle">
            <li className="fullscreen">
              {
                !this.state.full ?
                  <img src={fullScreen} alt="fullScreen" onClick={this.fullScreen} />
                  :
                  <img src={fullScreenExit} alt="fullScreenExit" onClick={this.fullScreenExit} />
              }
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
