import React, { Component } from 'react'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'

class ModuleSearchConDition extends Component {

  render() {
    return (
      <div className="search-condition-module">
        <span className="text">搜索条件</span>
        <img className="move" src={MoveIcon} alt="move" />
        <img className="delete" src={DeleteIcon} alt="delete" />
      </div>
    )
  }
}

export default ModuleSearchConDition
