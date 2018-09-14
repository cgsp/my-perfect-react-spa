import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'
import Logo from './logo.png'

class ModuleTipApp extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  render() {
    return (
      <div className="tip-app-module">
        <div className="module-title">
          <span className="text">提示下载App</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <img className="logo" src={Logo} alt="logo" />
          <div className="text-box">
            <div className="top">喜马拉雅FM-听书神器</div>
            <div className="bottom">高品质，离线听，不耗费流量</div>
          </div>
          <button className="btn">下载App</button>
        </div>
      </div>
    )
  }
}

export default ModuleTipApp
