import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import MaskLoading from '@Components/mask-loading'
import { Layout } from 'antd'
import style from './style'
const { Content } = Layout

@inject('AppLoadingStore')
@observer
export default class MainFrame extends Component {
  render() {
    // 路由插座
    const { children } = this.props
    let { appLoading } = this.props.AppLoadingStore
    return (
      <Layout className={style['app-layout']}>
        <Layout>
          <Content className={style['app-content']}>
            {/* 全局的loading */}
            {
              appLoading ? <MaskLoading /> : null
            }
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
