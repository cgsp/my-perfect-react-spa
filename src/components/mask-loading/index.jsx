import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import './style'
import loadingImg from './lodaing1.gif'

export default class MaskLoading extends Component {
  static propTypes = {
    msg: PropTypes.string
  }

  static defaultProps = {
    msg: ''
  }

  constructor() {
    super()
    this.state = {
      visible: false
    }
  }

  show() {
    this.setState({
      visible: true
    })
  }

  hide() {
    this.setState({
      visible: false
    })
  }

  render() {
    const content = (
      <div className="mask-loading">
        <div className="loading">
          <img className="img" src={loadingImg} alt="" style={{ width: '150px', height: 'auto' }} />
          {
            this.props.msg ?
              <p className="desc">{this.props.msg}</p>
              : null
          }
        </div>
      </div>

    )
    return (this.state.visible ? content : null)
  }
}
