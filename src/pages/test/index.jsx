import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import Child from './child'

class MiddleComponent extends Component {
  render() {
    return (
      <Child />
    )
  }
}

export default class Parent extends Component {
  // 必须声明
  // 注意是复数
  static childContextTypes = {
    propA: PropTypes.string,
    methodA: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      propA: 'propA'
    }
  }

  // 必须用这个默认方法，返回一个plain object
  getChildContext() {
    return {
      propA: this.state.propA,
      methodA: () => {
        console.log('this is methodA')
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        propA: 'hahahahhaha'
      })
    }, 2000)
  }


  render() {
    return (
      <MiddleComponent />
    )
  }
}
