import React, { Component } from 'react'
export default class F1AwardS2AccountT3AccountF4Detail extends Component {
  constructor(props) {
    super(props)
    this.goList = this.goList.bind(this)
  }
  goList() {
    // this.props.history.push('/!F1-award/!S2-partner/!T3-bill')
    this.props.history.push('/!F1-award/!S2-partner/!T3-bill/!F4-detail')

    // this.props.history.push('/!F1-award/!S2-account/!T3-out')
    // this.props.history.push('/!F1-award/!S2-account/!T3-out/!F4-detail')
  }
  render() {
    return (
      <div>
        1奖励管理-2奖励账户管理-3奖励账户-4详情页面
      <button onClick={this.goList}>返回列表</button>
      </div>
    )
  }
}
