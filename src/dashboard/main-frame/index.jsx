import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import HeadNav from '../head-nav'
import NavList from '@Components/nav-list'
import './style'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { getNavBarData } from '@Redux/navBar'
import MaskLoading from '@Components/mask-loading'

const { Header, Sider, Content } = Layout

@connect(
  state => state.navBarReducer,
  { getNavBarData }
)
@withRouter
export default class MainFrame extends Component {
  static propTypes = {
    getNavBarData: PropTypes.func.isRequired,
    appNavListData: PropTypes.array,
    location: PropTypes.object
  }

  // componentDidMount() {
  //   if (!this.props.appNavListData.length) {
  //     this.props.getNavBarData()
  //     this.refs.mask.show()
  //   }
  // }

  // componentWillUpdate() {
  //   console.log(this.props.appNavListData)
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log(nextProps)
  //   if (nextProps.appNavListData.length) {
  //     this.refs.mask.hide()
  //   }
  //   return true
  // }

  // showLoading() {

  // }

  render() {
    const { children } = this.props
    // const { isLogin } = this.props.index

    return (
      <Layout style={{ height: '100%', width: '100%' }}>
        <Header>
          <HeadNav />
        </Header>
        <Layout style={{ background: '#041527', maxHeight: '100%' }}>
          <Sider style={{ background: '#041527', maxHeight: '100%', overflow: 'scroll', marginBottom: '30px' }} width={260}>
            <NavList navListData={this.props.appNavListData} />
          </Sider>
          <Content style={{ padding: 10, background: '#fff', paddingRight: 0 }}>
            <div style={{ background: '#f0f2f5', height: '100%', width: '100%', overflowY: 'scroll', padding: 20 }}>
              {children}
            </div>
          </Content>
        </Layout>
        <MaskLoading ref="mask" />
      </Layout>
    )
  }
}
