import React, { Component } from 'react'
export default class F1AwardS2AccountT3Account extends Component {
  constructor(props) {
    super(props)
    this.goDetail = this.goDetail.bind(this)
  }

  goDetail() {
    this.props.history.push('/!F1-award/!S2-account/!T3-account/!F4-detail')
  }

  render() {
    return (
      <div>
        1奖励管理-2奖励账户管理-3奖励账户
      <button onClick={this.goDetail}>去详情页面</button>
      </div>
    )
  }
}
