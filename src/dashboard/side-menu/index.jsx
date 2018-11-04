import React, { Component } from "react"
import { Icon } from 'antd'
import "./style.scss"
import { Link, withRouter } from "react-router-dom"
import { inject, observer } from 'mobx-react'
import { Menu } from "antd"

const { SubMenu } = Menu

@withRouter
@inject('SettingAuthNavBar')
@observer
export default class SiderMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentKey: '/!F1-index',
      openKeys: ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.onOpenChange = this.onOpenChange.bind(this)
  }

  handleClick(e) {
    // console.log(e)
    this.setState({
      currentKey: e
    })
  }

  onOpenChange(e) {
    let openKeys = ''
    if (e.length > 1) {
      openKeys = e[e.length - 1]
    }
    // console.log(e)
    // console.log(openKeys)
    this.setState({
      openKeys
    })
  }

  render() {
    const { appNavListData, appFirstRoutesList } = this.props.SettingAuthNavBar

    // 获取当前路由下面的2级和3级的路由
    let currentPath = this.props.location.pathname ? this.props.location.pathname : ''
    let fistMenuPath = '/!F1-index'
    let defaultSelectedKeys = ''
    appFirstRoutesList.forEach(element => {
      if (currentPath.indexOf(element.path) > -1 && currentPath.indexOf('!F1-') > -1) {
        fistMenuPath = element.path
      }
    })
    // console.log(fistMenuPath)
    let secondAndThirdMenu = []
    appNavListData.forEach(item => {
      if (item.routePath === fistMenuPath) {
        secondAndThirdMenu = item.childResources || []
      }
    })

    secondAndThirdMenu.forEach(seondItem => {
      if (!seondItem.childResources) {
        // openKeys.push(seondItem.routePath)
        if (currentPath.indexOf(seondItem.routePath) > -1) {
          defaultSelectedKeys = seondItem.routePath
        }

      } else {
        seondItem.childResources.forEach(thirdItem => {
          if (currentPath.indexOf(thirdItem.routePath) > -1) {
            defaultSelectedKeys = thirdItem.routePath
          }
        })
      }
    })

    return (
      <Menu
        mode="inline"
        theme="dark"
        style={{ width: 170 }}
        className="sider-menu-container"
        defaultSelectedKeys={[defaultSelectedKeys]}
        selectedKeys={[
          defaultSelectedKeys ? defaultSelectedKeys : this.state.currentKey
        ]}
        onClick={this.handleClick}
        openKeys={[this.state.openKeys]}
        defaultOpenKeys={[this.state.openKeys]}
        onOpenChange={this.onOpenChange}
      >
        {
          secondAndThirdMenu.map(secondItem => {
            {/* 如果这个2级菜单，下面，没3级菜单的话 */ }
            if (!secondItem.childResources) {
              return (
                <Menu.Item key={secondItem.routePath}>
                  <Link to={secondItem.routePath}>
                    <Icon type={secondItem.icon} />
                    {secondItem.name}
                  </Link>
                </Menu.Item>
              )
            }
            return (
              <SubMenu key={secondItem.routePath} title={<span><Icon type={secondItem.icon} /><span>{secondItem.name}</span></span>}>
                {
                  secondItem.childResources && secondItem.childResources.map(thirdItem => {
                    return (
                      <Menu.Item key={thirdItem.routePath}>
                        <Link to={thirdItem.routePath}>{thirdItem.name}</Link>
                      </Menu.Item>
                    )
                  })
                }
              </SubMenu>)
          })
        }
      </Menu>
    );
  }
}

// defaultOpenKeys = { [nav1]}
// openKeys = { this.state.openKeys }
// onClick = { this.handleClick }
// selectedKeys = {
//   [
//   currentPath ? currentPath : this.state.currentKey
//   ]}
// onOpenChange = { this.onOpenChange }
