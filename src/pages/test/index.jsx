import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import './style.scss'
import Son from './son'
import NoStateSon from './no-state-son'

class Test extends Component {
  // 声明自身接受的属性
  static propTypes = {
    orderBy: PropTypes.string,
    desc: PropTypes.bool,
    clickSort: PropTypes.func,
    tableData: PropTypes.array,
    pageSize: PropTypes.number,
  }

  // 声明Context对象的属性
  static childContextTypes = {
    topA: PropTypes.string,
    topMethodA: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      topA: 'topA'
    }
  }

  // 必须用这个方法名，返回一个Context对象
  getChildContext() {
    const { topA } = this.state
    return {
      topA,
      topMethodA: this.topMethodA
    }
  }

  topMethodA() {
    return 'topMethodA'
  }

  render() {
    return (
      <div className="test">
        <div className="test-text">我是测试页面的主题内容</div>
        <div className="son-box">
          <div>儿子盒子</div>
          <Son />
          <NoStateSon propA={111111} propB={2222} />
        </div>
      </div>
    )
  }
}

export default Test
