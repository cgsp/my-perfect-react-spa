import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'

class ModuleCommon extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  render() {
    return (
      <div className="common-module">
        <div className="module-title">
          <span className="text">普通模块</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">我是内容</div>
      </div>
    )
  }
}

export default ModuleCommon
