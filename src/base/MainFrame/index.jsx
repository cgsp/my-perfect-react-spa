import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import HeadNav from '../HeadNav'
import NavList from '@Components/nav-list'
import './style'
import { Layout } from 'antd'
import { apiGetNavList } from '@Api'
const { Header, Sider, Content } = Layout

@withRouter
export default class MainFrame extends Component {

  constructor() {
    super()
    this.state = {
      navListData: []
    }
  }

  componentDidMount() {
    apiGetNavList()
      .then(res => this.setState({
        navListData: res
      }))
  }

  render() {
    const { children } = this.props
    // const { isLogin } = this.props.index
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Header>
          <HeadNav />
        </Header>
        <Layout>
          <Sider style={{ background: '#fff' }} width={260}>
            <NavList navListData={this.state.navListData} />
          </Sider>
          <Content style={{ padding: 20 }}>{children}</Content>
        </Layout>
      </Layout>
    )
  }
}
