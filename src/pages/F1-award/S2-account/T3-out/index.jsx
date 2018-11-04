import React, { Component } from 'react'
export default class F1AwardS2AccountT3Out extends Component {
  constructor(props) {
    super(props)
    this.goDetail = this.goDetail.bind(this)
  }

  goDetail() {
    this.props.history.push('/!F1-award/!S2-account/!T3-out/!F4-detail')
  }

  render() {
    return (
      <div>
        1奖励管理-2奖励账户管理-3转出记录
      <button onClick={this.goDetail}>去详情页面</button>
      </div>
    )
  }
}
