import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import HeadNav from '../head-nav'
import SiderMenu from '../side-menu'
import MaskLoading from '@Components/mask-loading'
import DownPercentProcessBar from '@Components/down-percent-process-bar'
import { Layout } from 'antd'
import css from './style'
const { Header, Sider, Content } = Layout

@inject('AppLoadingStore')
@observer
export default class MainFrame extends Component {
  render() {
    // 路由插座
    const { children } = this.props
    let { appLoading, appDownPercentLoading, appDownPercentLoadingPercent } = this.props.AppLoadingStore
    return (
      <Layout className={css['app-layout']}>
        <Header className={css['app-header']}>
          <HeadNav />
        </Header>
        <Layout>
          <Sider className={css['app-nav']} width={170}>
            <SiderMenu />
          </Sider>
          <Content className={css['app-content']}>
            {/* 全局的loading */}
            {
              appLoading ? <MaskLoading /> : null
            }
            {/* 全局的下载loading进度条 */}
            {
              appDownPercentLoading ? <DownPercentProcessBar percent={appDownPercentLoadingPercent} /> : null
            }
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
