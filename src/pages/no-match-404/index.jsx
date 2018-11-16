import React, { Component } from 'react'
import './style.scss'

class NoMatch404 extends Component {

  render() {
    return (
      <div className="no-match-404">路径有误，或该用户不存在该页面的访问权限</div>
    )
  }
}

export default NoMatch404
