import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import { withRouter } from 'react-router-dom'


const { SubMenu } = Menu

@withRouter
@connect(
  state => state.navBarReducer,
  {}
)
export default class NavList extends Component {
  static propTypes = {
    navListData: PropTypes.array.isRequired,
    appRoutesList: PropTypes.array.isRequired,
    location: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      theme: 'dark',
      currentKey: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    // console.log('click ', e)
    this.setState({
      currentKey: e.key
    })
  }

  render() {
    // console.log(this.props.navListData)
    // if (!this.timer && this.props.appRoutesList.length) {
    //   const path = this.props.location.pathname.substr(1)
    //   console.log('path', path)
    //   this.timer = setTimeout(() => {
    //     this.setState({
    //       currentKey: path
    //     })
    //   }, 0)
    // }
    return (

      <Menu
        className="app-sibe-bar"
        theme={this.state.theme}
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultOpenKeys={['1']}
        selectedKeys={[this.state.currentKey || this.props.location.pathname.substr(1)]}
        mode="inline"
      >

        {
          this.props.navListData.map(item => (
            <SubMenu key={item.path} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
              {
                item.children.map(secondItem => (
                  secondItem.children.length ? (
                    <SubMenu key={secondItem.path} title={secondItem.name}>
                      {
                        secondItem.children.map(thirdItem => (
                          <Menu.Item key={thirdItem.path}>
                            <Link to={thirdItem.path}>{thirdItem.name}</Link>
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>
                  ) :
                    <Menu.Item key={secondItem.path}>
                      <Link to={secondItem.path}>{secondItem.name}</Link>
                    </Menu.Item>
                ))
              }

            </SubMenu>
          ))
        }

      </Menu>

    )
  }
}
