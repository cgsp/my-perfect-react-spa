import React, { Component } from 'react'
export default class F1AwardS2PartnerT3Bill extends Component {
  constructor(props) {
    super(props)
    this.goDetail = this.goDetail.bind(this)
  }

  goDetail() {
    this.props.history.push('/!F1-award/!S2-partner/!T3-bill/!F4-detail')
  }

  render() {
    return (
      <div>
        1奖励管理-2合作方对账管理-3奖励账单
      <button onClick={this.goDetail}>去详情页面</button>
      </div>
    )
  }
}
