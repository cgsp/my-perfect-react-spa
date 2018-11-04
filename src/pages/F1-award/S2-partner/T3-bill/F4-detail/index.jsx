import React, { Component } from 'react'
export default class F1AwardS2PartnerT3BillF4Detail extends Component {
  constructor(props) {
    super(props)
    this.goList = this.goList.bind(this)
  }
  goList() {
    this.props.history.push('/!F1-award/!S2-partner/!T3-bill')
  }
  render() {
    return (
      <div>
        1奖励管理-2合作方对账管理-3奖励账单-详情页面
      <button onClick={this.goList}>返回列表</button>
      </div>
    )
  }
}
