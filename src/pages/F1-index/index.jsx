import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import noAuthImg from './imgs/noAuth.png'
import welcomeImg from './imgs/hasAuth.png'
import './style.scss'

@inject('SettingAuthNavBar')
@observer
class Index extends Component {
  render() {
    const { appNavListData } = this.props.SettingAuthNavBar
    //   11122233
    //   11122233
    let hasAuth
    if (appNavListData.length <= 1) {
      hasAuth = false
    } else {
      hasAuth = true
    }

    const hasAuthDiv = (
      <div className="box">
        <div className="img">
          <img src={welcomeImg} alt="" />
        </div>
        <span className="text">欢迎使用开放平台四大中心</span>
      </div>
    )
    const noAuthDiv = (
      <div className="box">
        <div className="img">
          <img src={noAuthImg} alt="" />
        </div>
        <span className="text">请联系管理员，配置权限！</span>
      </div>
    )
    return (
      <div className="index">
        {
          hasAuth ? hasAuthDiv : noAuthDiv
        }
      </div>
    )
  }
}
export default Index
