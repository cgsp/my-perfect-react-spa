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
      currentKey: 'index',
      openKeys: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    this.setState({
      currentKey: e.key
    })
  }

  onOpenChange = (e) => {
    // if (e.length === 2) {
    //   return
    // }
    console.log(e)
    let arr
    const length = e.length
    if (!e.length) {
      arr = []
    } else {
      arr = [e[length - 1]]
    }

    if (e[length - 1] === 'self-tag') {
      arr = ['self', 'self-tag']
    }
    if (e[length - 1] === 'self-tag' && e.length === 1) {
      arr = []
    }
    this.setState({
      openKeys: arr
    })
  }

  render() {
    let currentPath = this.props.location.pathname ? this.props.location.pathname.substr(1) : ''
    // 高亮的特殊处理
    if (currentPath === 'child-table-add' || currentPath === 'child-table-edit') {
      currentPath = 'child-table'
    }

    const nav1 = currentPath ? currentPath.split('-')[0] : 'index'

    return (
      <Menu
        className="app-sibe-bar"
        theme="dark"
        onClick={this.handleClick}
        style={{ width: 200 }}
        selectedKeys={[
          currentPath ? currentPath : this.state.currentKey
        ]}
        defaultOpenKeys={[nav1]}
        mode="inline"
        onOpenChange={this.onOpenChange}
        openKeys={this.state.openKeys}
      >
        {
          this.props.navListData.map(item => {
            if (!item.childResources) {
              return (
                <Menu.Item key={item.routePath}>
                  <Link to={item.routePath}>
                    <Icon type={item.icon} />
                    {item.name}
                  </Link>
                </Menu.Item>
              )
            }
            return (
              <SubMenu key={item.routePath} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                {
                  item.childResources && item.childResources.map(secondItem => {
                    return (
                      secondItem.childResources && secondItem.childResources.length ? (
                        <SubMenu key={secondItem.routePath} title={secondItem.name}>
                          {
                            secondItem.childResources.map(thirdItem => (
                              <Menu.Item key={thirdItem.routePath}>
                                <Link to={thirdItem.routePath}>{thirdItem.name}</Link>
                              </Menu.Item>
                            ))
                          }
                        </SubMenu>
                      ) :
                        <Menu.Item key={secondItem.routePath}>
                          <Link to={secondItem.routePath}>{secondItem.name}</Link>
                        </Menu.Item>
                    )
                  })
                }
              </SubMenu>)
          })
        }
      </Menu>
    )
  }
}
