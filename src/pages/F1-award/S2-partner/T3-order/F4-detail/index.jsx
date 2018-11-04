import React, { Component } from 'react'
export default class F1AwardS2PartnerT3OrderF4Detail extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.goList = this.goList.bind(this)
  }
  goList() {
    this.props.history.push('/!F1-award/!S2-partner/!T3-order')
  }
  render() {
    return (
      <div>
        1奖励管理-2合作方对账管理-3奖励订单-4详情页面
      <button onClick={this.goList}>返回列表</button>
      </div>
    )
  }
}
