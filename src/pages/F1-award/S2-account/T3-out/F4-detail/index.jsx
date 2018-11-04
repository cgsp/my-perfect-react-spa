import React, { Component } from 'react'
export default class F1AwardS2AccountT3OutF4Detail extends Component {
  constructor(props) {
    super(props)
    this.goList = this.goList.bind(this)
  }
  goList() {
    this.props.history.push('/!F1-award/!S2-account/!T3-out')
  }
  render() {
    return (
      <div>
        1奖励管理-2奖励账户管理-3转出记录-详情
      <button onClick={this.goList}>返回列表</button>
      </div>
    )
  }
}
