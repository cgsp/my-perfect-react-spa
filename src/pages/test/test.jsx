import React, { Component } from 'react'
import LoadingHoc from './loading-hoc'
import { PropTypes } from 'prop-types'

@LoadingHoc
class TestContainer extends Component {
  static defaultProps = {
    cname: 'TestContainer'
  }
  static propTypes = {
    cname: PropTypes.string
  }

  callName() {
    return '组件自身callname'
  }

  render() {
    console.log('组件自身打印', this.props)
    return (
      <div>测试页面</div>
    )
  }
}

export default TestContainer
