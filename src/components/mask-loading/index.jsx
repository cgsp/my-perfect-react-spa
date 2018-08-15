import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import './style'
import loadingImg from './loading.gif'

export default class MaskLoading extends Component {
  static propTypes = {
    msg: PropTypes.string
  }

  static defaultProps = {
    msg: '拼命加载中...'
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
          <img className="img" src={loadingImg} alt="" style={{ width: '50px', height: '50px' }} />
          <p className="desc">{this.props.msg}</p>
        </div>
      </div>

    )
    return (this.state.visible ? content : null)
  }
}
