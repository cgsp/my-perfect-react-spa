import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import HeadNav from '../head-nav'
import SiderMenu from '../side-menu'
import MaskLoading from '@Components/mask-loading'
import DownPercent from '@Components/down-percent'
import { Layout } from 'antd'
import './style'
const { Header, Sider, Content } = Layout

@inject('Loading')
@observer
export default class MainFrame extends Component {
  render() {
    // 路由插座
    const { children } = this.props
    let { loading, downPercentLoading, downPercentLoadingPercent } = this.props.Loading
    return (
      <Layout className="app-layout">
        <Header className="app-header">
          <HeadNav />
        </Header>
        <Layout>
          <Sider className="app-nav" width={170}>
            <SiderMenu />
          </Sider>
          <Content className="app-content">
            {/* 全局的loading */}
            {
              loading ? <MaskLoading /> : null
            }
            {/* 全局的下载loading进度条 */}
            {
              downPercentLoading ? <DownPercent percent={downPercentLoadingPercent} /> : null
            }
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
