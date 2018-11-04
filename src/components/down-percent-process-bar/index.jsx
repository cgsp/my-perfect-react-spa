import React, { Component } from 'react'
import { Progress } from 'antd'
import { PropTypes } from 'prop-types'
import './style'

export default class DownPercentProcessBar extends Component {
  static propTypes = {
    percent: PropTypes.number,
    msg: PropTypes.string,
  }

  static defaultProps = {
    msg: '',
  }

  constructor(props) {
    super(props)
    let num = 0
    num = Math.floor(Math.random() * 8)
    this.state = {
      num
    }
  }

  render() {
    const { percent } = this.props
    const content = (
      <div className="app-down-percent">
        <div className="loading">
          <Progress type="circle" percent={percent} />
        </div>
      </div>

    )
    return content
  }
}
