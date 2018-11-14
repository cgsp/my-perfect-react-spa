import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import './style.scss'
import SonSon from '../son-son'

class Son extends Component {
  // 子组件必须这么声明，不然获取的this.context是个空对象
  static contextTypes = {
    topA: PropTypes.string,
    topMethodA: PropTypes.func
  }

  static childContextTypes = {
    sonA: PropTypes.string
  }

  getChildContext() {
    return {
      sonA: 'sonA'
    }
  }


  render() {
    const { topA, topMethodA } = this.context
    console.log('儿子组件打印topA:', topA)
    console.log('儿子组件打印topMethodA:', topMethodA())
    return (
      <div className="son">
        <div className="son-text">我是儿子组件</div>
        <div className="son-son-box">
          <SonSon />
        </div>
      </div>
    )
  }
}

export default Son
