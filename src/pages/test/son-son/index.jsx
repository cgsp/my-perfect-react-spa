import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

class SonSon extends Component {
  // 子组件必须这么声明，不然获取的this.context是个空对象
  static contextTypes = {
    topA: PropTypes.string,
    topMethodA: PropTypes.func
  }

  render() {
    const { topA, topMethodA } = this.context
    console.log('孙子组件打印topA:', topA)
    console.log('孙子组件打印topMethodA:', topMethodA())
    return (
      <div className="son-son">
        <div className="son-text">我是孙子组件</div>
      </div>
    )
  }
}

export default SonSon
