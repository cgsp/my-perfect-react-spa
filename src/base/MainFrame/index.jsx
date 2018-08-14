import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import HeadNav from '../HeadNav'
import SiderMenu from '../../components/SiderMenu'
import './style'
import { Layout } from 'antd'
const { Header, Sider, Content } = Layout

@inject('index')
@withRouter
@observer
export default class MainFrame extends Component {

  render() {
    const { children } = this.props
    const { isLogin } = this.props.index
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Header>
          <HeadNav isLogin={isLogin}/>
        </Header>
        <Layout>
          <Sider style={{ background: '#fff' }} width={260}>
            <SiderMenu />
          </Sider>
          <Content style={{ padding: 20 }}>{children}</Content>
        </Layout>
      </Layout>
    )
  }
}
