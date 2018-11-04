import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { apiGetAllRules, apiUpRule, apiDownRule } from '@Service/award'
import { message, Modal } from 'antd'
import { SUCCESS_OK } from '@Constants'
import { myGetMoneyStyle } from '@Utils/my-get-money-style'
import { http } from '@Service'
import "./style.scss"

const confirm = Modal.confirm

export default class F1AwardS2Rule extends Component {
  constructor() {
    super()
    this.state = {
      rulesList: []
    }
    this.up = this.up.bind(this)
    this.down = this.down.bind(this)
  }

  componentDidMount = () => {
    this.getRules()
  }

  async getRules() {
    try {
      const res = await http.get(apiGetAllRules)
      if (res.code !== SUCCESS_OK) {
        message.error(res.message)
        return
      }
      // res.data.forEach((item, index) => {
      //   if (index === 0) {
      //     item.enabledDeveloperCount = 10
      //   }
      // })
      this.setState({
        rulesList: res.data || []
      })
    } catch (error) {
    }
  }

  up(index) {
    const that = this
    confirm({
      title: '确定要升级吗?',
      content: '',
      onOk() {
        http.post(apiUpRule, {
          weight: index
        })
          .then(res => {
            if (res.code !== SUCCESS_OK) {
              message.error(res.message)
              return
            }
            that.getRules()
          })
      },
      onCancel() { },
    })
  }

  down(index) {
    const that = this
    confirm({
      title: '确定要降级吗?',
      content: '',
      onOk() {
        http.post(apiDownRule, {
          weight: index
        })
          .then(res => {
            if (res.code !== SUCCESS_OK) {
              message.error(res.message)
              return
            }
            that.getRules()
          })
      },
      onCancel() { },
    })
  }

  render() {
    const { rulesList } = this.state
    return (
      <div className="award-rule">
        <div className="app-content-title">
          奖励规则
        </div>
        <div className="detail-box">
          {
            rulesList.map((item, index) => {
              return (
                <div className="awards" key={index}>
                  <div className="title">
                    {
                      item.valid === 1
                        ?
                        <span className="up-status">已上线</span>
                        :
                        <span className="down-status">已下线</span>
                    }
                    <span className="type">{item.rewardTypeName}</span>
                    <span>
                      {
                        index === 0 ? null : <span className="up-down up" onClick={() => this.up(index)}>升级</span>
                      }
                      {
                        index === (rulesList.length - 1) ? null : <span className="up-down down" onClick={() => this.down(index)}>降级</span>
                      }
                    </span>
                  </div>
                  <ul className="content">
                    <li>
                      <div className="title policy-title">相关政策说明：</div>
                      <div className="detail policy">
                        {item.policyDetail}
                      </div>
                    </li>
                    <li>
                      <div className="title num-title">关联的开发者：</div>
                      <div className="detail num">
                        {
                          item.enabledDeveloperCount > 0
                            ?
                            <Link className="num-big-0" to={{ pathname: '/!F1-award/!S2-developer', query: { rewardType: item.rewardType } }}>
                              <span>
                                {`${item.enabledDeveloperCount} 个`}
                              </span>
                            </Link>
                            :
                            <span className="num-small-0">
                              {`${item.enabledDeveloperCount} 个`}
                            </span>
                        }
                      </div>
                    </li>
                    <li>
                      <div className="title">累计奖励金额：</div>
                      <div className="detail">{`¥ ${myGetMoneyStyle(item.totalRewardAmount, 2)}`}</div>

                      {/* <div className="detail">{`¥ ${myGetMoneyStyle(123359.9999, 2)}`}</div> */}
                    </li>
                  </ul>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}
