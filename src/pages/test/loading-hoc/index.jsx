import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

export default function LoadingHoc(Comp) {
  return class extends Component {
    static defaultProps = {
      id: 12,
    }
    static propTypes = {
      id: PropTypes.number,
    }

    render() {
      console.log('装饰器自身打印', this.props)
      if (!this.props.data) {
        return (
          <div>加载中...</div>
        )
      }
      return (
        <Comp {...this.props} />
      )
    }
  }
}
