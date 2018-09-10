import React, { Component } from 'react'
import { connect } from 'react-redux'
import noAuthImg from './imgs/noAuth.png'
import welcomeImg from './imgs/hasAuth.png'
import './style.scss'

@connect(
  state => state.navBarReducer,
  {}
)
class Index extends Component {
  render() {
    let hasAuth
    if (this.props.appNavListData.length <= 1) {
      hasAuth = false
    } else {
      hasAuth = true
    }
    const hasAuthDiv = (
      <div className="box">
        <div className="img">
          <img src={welcomeImg} alt="" />
        </div>
        <span className="text">欢迎使用开放平台自运营系统</span>
      </div>
    )
    const noAuthDiv = (
      <div className="box">
        <div className="img">
          <img src={noAuthImg} alt="" />
        </div>
        <span className="text">当前您没有该系统访问权限，请联系管理员！</span>
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
