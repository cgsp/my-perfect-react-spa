import React, { Component } from 'react'
export default class F1AwardS2AccountT3Settle extends Component {
  constructor(props) {
    super(props)
    this.goDetail = this.goDetail.bind(this)
  }

  goDetail() {
    this.props.history.push('/!F1-award/!S2-account/!T3-settle/!F4-detail')
  }

  render() {
    return (
      <div>
        1奖励管理-2奖励账户管理-3结算记录
      <button onClick={this.goDetail}>去详情页面</button>
      </div>
    )
  }
}
