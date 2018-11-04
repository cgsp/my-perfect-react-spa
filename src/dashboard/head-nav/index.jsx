import React, { Component } from 'react'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { http } from '@Service'
import { appUserInfo, appLogOut } from '@Service/setting'
import { SUCCESS_OK } from '@Constants'
import { inject, observer } from 'mobx-react'
import { mySessionStorageClear } from '@Utils/my-storages'
import "./style.scss"
import fullScreen from './full-screen.png'
import fullScreenExit from './full-screen-exit.png'

@withRouter
@inject('SettingAuthNavBar')
@observer
export default class HeadNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      full: false,
      currentKey: '/!F1-index',
      realName: ""
    }
    this.fullScreen = this.fullScreen.bind(this)
    this.fullScreenExit = this.fullScreenExit.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    this.getUerInfo()
    // 是否刷新路由数据
    const { appNavListData } = this.props.SettingAuthNavBar
    if (appNavListData.length <= 1) {
      this.props.SettingAuthNavBar.geteUserNavBarData()
    }
  }

  // 获取用户信息和当行信息
  getUerInfo() {
    http.get(appUserInfo)
      .then((res) => {
        res = res || {}
        const { code, message } = res
        if (!code === SUCCESS_OK) {
          message.error(message)
          return
        }
        res.data = res.data || {}
        this.setState({ realName: res.data.realName })
      })
  }

  // 退出登录
  logout() {
    http.get(appLogOut)
      .then(res => {
        res = res || {}
        const { code, message } = res
        if (!code === SUCCESS_OK) {
          message.error(message)
          return
        }
        console.log(res)
        mySessionStorageClear()
        // window.location.reload()
      })
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

  handleClick = (e) => {
    this.setState({
      currentKey: e.key
    })
  }

  render() {
    const { appFirstRoutesList } = this.props.SettingAuthNavBar
    let currentPath = this.props.location.pathname ? this.props.location.pathname : ''
    let defaultSelectedKeys = '/!F1-index'
    appFirstRoutesList.forEach(element => {
      if (currentPath.indexOf(element.path) > -1 && currentPath.indexOf('!F1-') > -1) {
        defaultSelectedKeys = element.path
      }
      // console.log(currentPath, element.path)
    })
    // console.log(defaultSelectedKeys)
    return (
      <div className="header-container">
        <h1 className="left">
          <span>开放平台四大中心</span>
        </h1>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[defaultSelectedKeys]}
          selectedKeys={[
            defaultSelectedKeys ? defaultSelectedKeys : this.state.currentKey
          ]}
          className="first-menu"
        >
          {appFirstRoutesList.map((item, index) => {
            return (
              <Menu.Item key={item.path}>
                <Link className="item" to={item.toUrl}>{item.name}
                </Link>
              </Menu.Item>
            );
          })}
        </Menu>
        <div className="user-panel">
          <ul className="right-handdle">
            <li className="account-name">
              <span className="userInfo">{this.state.realName}</span>
            </li>
            <li
              className="account-logout"
              onClick={this.logout}
            >
              退出登录
            </li>
            <li className="fullscreen">
              {
                !this.state.full ?
                  <img src={fullScreen} alt="fullScreen" onClick={this.fullScreen} /> :
                  <img src={fullScreenExit} alt="fullScreenExit" onClick={this.fullScreenExit} />
              }
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
