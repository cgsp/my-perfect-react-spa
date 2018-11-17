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

    constructor(props) {
      super(props)
      this.state = {
        a: 11111
      }
    }

    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps', nextProps)
      this.setState({
        a: 22222
      })
    }

    shouldComponentUpdate(nextProps, nextState, context) {
      console.log('shouldComponentUpdate', nextProps)
      // this.setState({
      //   a: 3333
      // })
      return true
    }

    componentWillUpdate() {
      console.log('componentWillUpdate')
      // this.setState({
      //   a: 33333
      // })
    }

    render() {
      console.log('装饰器自身打印', this.props)
      if (!this.props.data) {
        return (
          <div>加载中...</div>
        )
      }
      return (
        <div>
          {this.state.a}
          <Comp {...this.props} />
        </div>
      )
    }
  }
}
