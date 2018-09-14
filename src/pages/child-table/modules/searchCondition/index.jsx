import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'

class ModuleSearchConDition extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  render() {
    return (
      <div className="search-condition-module">
        <span className="text">搜索条件</span>
        <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
        <img className="move" src={MoveIcon} alt="move" />
      </div>
    )
  }
}

export default ModuleSearchConDition
