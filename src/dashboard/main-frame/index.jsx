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

  constructor(props) {
    super(props)
    this.timer = null
  }

  componentDidMount() {
    if (this.props.appNavListData.length <= 1) {
      this.refs.mask.show()
      this.props.getNavBarData(
        () => {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.refs.mask.hide()
          }, 1000)
        }
      )
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
  render() {
    const { children } = this.props
    // const { isLogin } = this.props.index

    return (
      <Layout style={{ height: '100%', width: '100%' }}>
        <Header>
          <HeadNav />
        </Header>
        <Layout style={{ background: '#041527', maxHeight: '100%' }}>
          <Sider style={{ background: '#041527', maxHeight: '100%', overflowY: 'auto', overflowX: 'hidden', marginBottom: '30px' }} width={200}>
            <NavList navListData={this.props.appNavListData} />
          </Sider>
          <Content style={{ padding: 10, background: '#fff', paddingRight: 0 }}>
            <div style={{ background: '#f0f2f5', height: '100%', width: '100%', overflowY: 'auto', padding: 20 }}>
              {children}
            </div>
          </Content>
        </Layout>
        <MaskLoading ref="mask" />
      </Layout>
    )
  }
}
