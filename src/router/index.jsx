import React, { Component } from "react"
import MainFrame from "../dashboard/main-frame"
import { Route, withRouter, Switch, Redirect } from "react-router-dom"
import { inject, observer } from 'mobx-react'
/**
 * 路由规则：
 *  第一条：
 *   路由的命名规则是：'/!F1-xxx/!S2-yyy/!T3-zzz/!F4-qqq'
 *   注意：xxx，yyy, zzz, qqq中，不能有特殊字符，如 #, / ,- 等, 且必须都是小写字母（不能出现数字）
 *  第二条：
 *   1级菜单，对应路由的，path，统一加'!F1-'前缀
 *   2级菜单，对应路由的，path，统一加'!S2-'前缀
 *   3级菜单，对应路由的，path，统一加'!T3-'前缀
 *   4级菜单，对应路由的，path，统一加'!F4-'前缀  (4级菜单也就是详情/编辑/审核页面)
 *  第三条：
 *   如果某个2级路由(菜单)下面，没3级路由(菜单)，但是有详情/编辑/审核页面（4级菜单）:
 *   那么路由的命名规则是：'!F1-xxx/!S2-yyy/!F4-qqq'，没有 /!T3-zzz
 *  第四条：
 *   路由跳转传参，/:参数的问题
 *   <Route path="/!F1-award/!S2-partner/!T3-order/!F4-detail/:id/:name" component=       {F1AwardS2PartnerT3OrderF4Detail} exact />
 *   这样传参数的时候，请确保/:id/:name中不能包含!F1，或!S2，或!T3，或!F4
 *  第五条：
 *   路由跳转传参，建议尽量不要采用上述url方式传参，可以采用query或者state的方式传参
 */

/**
 *  首页模块
 */
import F1Index from "@Pages/F1-index";

/**
 *  奖励管理模块
 */
// 1奖励管理-2奖励规则
import F1AwardS2Rule from "@Pages/F1-award/S2-rule"
// 1奖励管理-2开发者管理
import F1AwardS2Developer from "@Pages/F1-award/S2-developer"
// 1奖励管理-2开发者管理-4详情页面(拉新奖励)
import F1AwardS2DeveloperF4Pull from "@Pages/F1-award/S2-developer/F4-pull"
// 1奖励管理-2开发者管理-4详情页面(续订奖励)
import F1AwardS2DeveloperF4Reorder from "@Pages/F1-award/S2-developer/F4-reorder"
// 1奖励管理-2奖励账户管理-3奖励账户
import F1AwardS2AccountT3Account from "@Pages/F1-award/S2-account/T3-account"
// 1奖励管理-2奖励账户管理-3奖励账户-4详情页面
import F1AwardS2AccountT3AccountF4Detail from "@Pages/F1-award/S2-account/T3-account/F4-detail"
// 1奖励管理-2奖励账户管理-3转出记录
import F1AwardS2AccountT3Out from "@Pages/F1-award/S2-account/T3-out"
// 1奖励管理-2奖励账户管理-3转出记录-4详情页面
import F1AwardS2AccountT3OutF4Detail from "@Pages/F1-award/S2-account/T3-out/F4-detail"
// 1奖励管理-2奖励账户管理-3结算记录
import F1AwardS2AccountT3Settle from "@Pages/F1-award/S2-account/T3-settle"
// 1奖励管理-2奖励账户管理-3结算记录-4详情页面
import F1AwardS2AccountT3SettleF4Detail from "@Pages/F1-award/S2-account/T3-settle/F4-detail"
// 1奖励管理-2合作方对账管理-3奖励账单
import F1AwardS2PartnerT3Bill from "@Pages/F1-award/S2-partner/T3-bill"
// 1奖励管理-2合作方对账管理-3奖励账单-4详情页面
import F1AwardS2PartnerT3BillF4Detail from "@Pages/F1-award/S2-partner/T3-bill/F4-detail"
// 1奖励管理-2合作方对账管理-3奖励订单
import F1AwardS2PartnerT3Order from "@Pages/F1-award/S2-partner/T3-order"
// 1奖励管理-2合作方对账管理-3奖励订单-4详情页面
import F1AwardS2PartnerT3OrderF4Detail from "@Pages/F1-award/S2-partner/T3-order/F4-detail"

/**
 *  设置模块
 */
// 1设置-2权限-3账号
import F1SettingS2AuthT3Account from "@Pages/F1-setting/S2-auth/T3-account"
// 1设置-2权限-3角色
import F1SettingS2AuthT3Role from "@Pages/F1-setting/S2-auth/T3-role"
// 1设置-2权限-3菜单
import F1SettingS2AuthT3Menu from "@Pages/F1-setting/S2-auth/T3-menu"
// 1设置-2权限-3商务
import F1SettingS2AuthT3Business from "@Pages/F1-setting/S2-auth/T3-business"
// 1设置-2权限-3列表页面的示范
import F1SettingS2AuthT3Shifan from "@Pages/F1-setting/S2-auth/T3-listshifan"


/**
 *  费用模块
 */
import F1FeeS2CashT3Account from "@Pages/F1-fee/S2-cash/T3-account"
import F1FeeS2CashT3AccountF4Detail from "@Pages/F1-fee/S2-cash/T3-account/F4-detail"

import F1FeeS2CashT3Recharge from "@Pages/F1-fee/S2-cash/T3-recharge"
import F1FeeS2CashT3RechargeF4Detail from "@Pages/F1-fee/S2-cash/T3-recharge/F4-detail"

import F1FeeS2CashT3Withdraw from "@Pages/F1-fee/S2-cash/T3-withdraw"
import F1FeeS2CashT3WithdrawF4Detail from "@Pages/F1-fee/S2-cash/T3-withdraw/F4-detail"


/**
 * 审批模块费用审批
 */
import F1AuditS2FeeT3Recharge from "@Pages/F1-audit/S2-fee/T3-recharge"
import F1AuditS2FeeT3RechargeF4Detail from "@Pages/F1-audit/S2-fee/T3-recharge/F4-detail"
import F1AuditS2FeeT3RechargeF4Audit from "@Pages/F1-audit/S2-fee/T3-recharge/F4-audit"

import F1AuditS2FeeT3Withdraw from "@Pages/F1-audit/S2-fee/T3-withdraw"
import F1AuditS2FeeT3WithdrawF4Detail from "@Pages/F1-audit/S2-fee/T3-withdraw/F4-detail"
import F1AuditS2FeeT3WithdrawF4Audit from "@Pages/F1-audit/S2-fee/T3-withdraw/F4-audit"

import F1AuditS2FeeT3Card from "@Pages/F1-audit/S2-fee/T3-card"
import F1AuditS2FeeT3CardF4Detail from "@Pages/F1-audit/S2-fee/T3-card/F4-detail"
import F1AuditS2FeeT3CardF4Audit from "@Pages/F1-audit/S2-fee/T3-card/F4-audit"


/**
 *  404模块
 */
// import NoMatch404 from '@Pages/no-match-404'


@withRouter
@inject('SettingAuthNavBar')
@observer
export default class Routes extends Component {
  render() {
    /**
      * 先对导航级的路由做控制，功能按钮级的，系统全部完成之后，最后再做控制
      * 功能按钮级的，现在show属性全部设置true, 系统全部完成之后，最后再做控制
     */
    const { appRoutesList } = this.props.SettingAuthNavBar
    const allNavList = [
      // 首页模块
      {
        path: '/!F1-index',
        component: F1Index,
        show: true
      },
      // 奖励管理模块
      {
        path: '/!F1-award/!S2-rule',
        component: F1AwardS2Rule,
        show: appRoutesList.indexOf('/!F1-award/!S2-rule') > -1
      },
      {
        path: '/!F1-award/!S2-developer',
        component: F1AwardS2Developer,
        show: appRoutesList.indexOf('/!F1-award/!S2-developer') > -1
      },
      {
        path: '/!F1-award/!S2-developer/!F4-pull',
        component: F1AwardS2DeveloperF4Pull,
        show: true
      },
      {
        path: '/!F1-award/!S2-developer/!F4-reorder',
        component: F1AwardS2DeveloperF4Reorder,
        show: true
      },
      {
        path: '/!F1-award/!S2-account/!T3-account',
        component: F1AwardS2AccountT3Account,
        show: appRoutesList.indexOf('/!F1-award/!S2-account/!T3-account') > -1
      },
      {
        path: '/!F1-award/!S2-account/!T3-account/!F4-detail',
        component: F1AwardS2AccountT3AccountF4Detail,
        show: true
      },
      {
        path: '/!F1-award/!S2-account/!T3-out',
        component: F1AwardS2AccountT3Out,
        show: appRoutesList.indexOf('/!F1-award/!S2-account/!T3-out') > -1
      },
      {
        path: '/!F1-award/!S2-account/!T3-out/!F4-detail',
        component: F1AwardS2AccountT3OutF4Detail,
        show: true
      },
      {
        path: '/!F1-award/!S2-account/!T3-settle',
        component: F1AwardS2AccountT3Settle,
        show: appRoutesList.indexOf('/!F1-award/!S2-account/!T3-settle') > -1
      },
      {
        path: '/!F1-award/!S2-account/!T3-settle/!F4-detail',
        component: F1AwardS2AccountT3SettleF4Detail,
        show: true
      },
      {
        path: '/!F1-award/!S2-partner/!T3-bill',
        component: F1AwardS2PartnerT3Bill,
        show: appRoutesList.indexOf('/!F1-award/!S2-partner/!T3-bill') > -1
      },
      {
        path: '/!F1-award/!S2-partner/!T3-bill/!F4-detail',
        component: F1AwardS2PartnerT3BillF4Detail,
        show: true
      },
      {
        path: '/!F1-award/!S2-partner/!T3-order',
        component: F1AwardS2PartnerT3Order,
        show: appRoutesList.indexOf('/!F1-award/!S2-partner/!T3-order') > -1
      },
      {
        path: '/!F1-award/!S2-partner/!T3-order/!F4-detail/:id/:name',
        component: F1AwardS2PartnerT3OrderF4Detail,
        show: true
      },
      // 设置模块
      {
        path: '/!F1-setting/!S2-auth/!T3-account',
        component: F1SettingS2AuthT3Account,
        show: appRoutesList.indexOf('/!F1-setting/!S2-auth/!T3-account') > -1
      },
      {
        path: '/!F1-setting/!S2-auth/!T3-role',
        component: F1SettingS2AuthT3Role,
        show: appRoutesList.indexOf('/!F1-setting/!S2-auth/!T3-role') > -1
      },
      {
        path: '/!F1-setting/!S2-auth/!T3-menu',
        component: F1SettingS2AuthT3Menu,
        show: appRoutesList.indexOf('/!F1-setting/!S2-auth/!T3-menu') > -1
      },
      {
        path: '/!F1-setting/!S2-auth/!T3-business',
        component: F1SettingS2AuthT3Business,
        show: appRoutesList.indexOf('/!F1-setting/!S2-auth/!T3-business') > -1
      },
      {
        path: '/!F1-setting/!S2-auth/!T3-listshifan',
        component: F1SettingS2AuthT3Shifan,
        show: appRoutesList.indexOf('/!F1-setting/!S2-auth/!T3-listshifan') > -1
      },

      {
        path: '/!F1-fee/!S2-cash/!T3-account',
        component: F1FeeS2CashT3Account,
        show: appRoutesList.indexOf('/!F1-fee/!S2-cash/!T3-account') > -1
      },
      {
        path: '/!F1-fee/!S2-cash/!T3-account/!F4-detail/:id',
        component: F1FeeS2CashT3AccountF4Detail,
        show: appRoutesList.indexOf('/!F1-fee/!S2-cash/!T3-account/!F4-detail') > -1
      },


      {
        path: '/!F1-fee/!S2-cash/!T3-recharge',
        component: F1FeeS2CashT3Recharge,
        show: appRoutesList.indexOf('/!F1-fee/!S2-cash/!T3-recharge') > -1
      },
      {
        path: '/!F1-fee/!S2-cash/!T3-recharge/!F4-detail/:id',
        component: F1FeeS2CashT3RechargeF4Detail,
        show: appRoutesList.indexOf('/!F1-fee/!S2-cash/!T3-recharge/!F4-detail') > -1
      },

      {
        path: '/!F1-fee/!S2-cash/!T3-withdraw',
        component: F1FeeS2CashT3Withdraw,
        show: appRoutesList.indexOf('/!F1-fee/!S2-cash/!T3-withdraw') > -1
      },
      {
        path: '/!F1-fee/!S2-cash/!T3-withdraw/!F4-detail/:id',
        component: F1FeeS2CashT3WithdrawF4Detail,
        show: appRoutesList.indexOf('/!F1-fee/!S2-cash/!T3-withdraw/!F4-detail') > -1
      },

      {
        path: '/!F1-audit/!S2-fee/!T3-recharge',
        component: F1AuditS2FeeT3Recharge,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-recharge') > -1
      },
      {
        path: '/!F1-audit/!S2-fee/!T3-recharge/!F4-detail/:id',
        component: F1AuditS2FeeT3RechargeF4Detail,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-recharge/!F4-detail') > -1
      },
      {
        path: '/!F1-audit/!S2-fee/!T3-recharge/!F4-audit/:id',
        component: F1AuditS2FeeT3RechargeF4Audit,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-recharge/!F4-audit') > -1
      },

      {
        path: '/!F1-audit/!S2-fee/!T3-withdraw',
        component: F1AuditS2FeeT3Withdraw,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-withdraw') > -1
      },
      {
        path: '/!F1-audit/!S2-fee/!T3-withdraw/!F4-detail/:id',
        component: F1AuditS2FeeT3WithdrawF4Detail,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-withdraw/!F4-detail') > -1
      },
      {
        path: '/!F1-audit/!S2-fee/!T3-withdraw/!F4-audit/:id',
        component: F1AuditS2FeeT3WithdrawF4Audit,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-withdraw/!F4-audit') > -1
      },

      {
        path: '/!F1-audit/!S2-fee/!T3-card',
        component: F1AuditS2FeeT3Card,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-card') > -1
      },
      {
        path: '/!F1-audit/!S2-fee/!T3-card/!F4-detail/:id',
        component: F1AuditS2FeeT3CardF4Detail,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-card/!F4-detail') > -1
      },
      {
        path: '/!F1-audit/!S2-fee/!T3-card/!F4-audit/:id',
        component: F1AuditS2FeeT3CardF4Audit,
        show: appRoutesList.indexOf('/!F1-audit/!S2-fee/!T3-card/!F4-audit') > -1
      },
    ]
    const toDefaultUrl = '!F1-index'
    const hasAuthNavList = allNavList.filter(item => item.show)
    return (
      <MainFrame>
        <Switch>
          <Route path="/" render={() => <Redirect to={`/${toDefaultUrl}`} />} exact key="/" />
          {
            hasAuthNavList.map(item =>
              (
                <Route path={item.path} component={item.component} key={item.path} exact />
              )
            )
          }
          {/*
          <Route path="/no-match-404" component={NoMatch404} />
          <Redirect to="/no-match-404" />
          */}
          <Redirect to={`/${toDefaultUrl}`} />
        </Switch>
      </MainFrame>
    )
  }
}
