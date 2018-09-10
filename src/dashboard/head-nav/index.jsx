import React, {Component} from 'react'
import './style.scss'
// import {Icon} from 'antd'
// import Cookies from 'js-cookie'
// import {withRouter, Link} from 'react-router-dom'
// import {TOKEN, goLogin} from '../../utils/helper'
export default class HeadNav extends Component {

    login = () => {
        // Cookies.remove(TOKEN, {path: '/', domain: '.ximalaya.com'})
        // goLogin()
        console.log('登录')
    }

    logout = () => {
        // Cookies.remove(TOKEN, {path: '/', domain: '.ximalaya.com'})
        // window.location.reload()
        console.log('退出')
    }

    render() {
        return (
            <div className="header-container">
                <div className="main-nav">
                        <h1>开放平台自运营后台</h1>
                    <div className="user-panel">
                        {this.props.isLogin ? (
                            <ul className="nav-right-menu">

                                <li className="account-name">
                                    笑笑
                                </li>
                                    <li className="account-logout account-name" onClick={this.logout}>
                                        logout
                                    </li>
                            </ul>
                        ) : (
                            <ul className="nav-right-menu">
                                <a>
                                    <li className="login" onClick={this.login} style={{color: '#fff'}}>
                                      退出
                                    </li>
                                </a>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
