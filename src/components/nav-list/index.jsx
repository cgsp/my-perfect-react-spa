import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types'
import { Menu, Icon } from 'antd'


const { SubMenu } = Menu

export default class NavList extends Component {
  static propTypes = {
    navListData: PropTypes.array.isRequired
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
    console.log('click ', e)
    this.setState({
      currentKey: e.key
    })
  }

  render() {
    // console.log(this.props.navListData)
    if (!this.timer && this.props.navListData.length) {
      this.timer = setTimeout(() => {
        this.setState({
          currentKey: this.props.navListData[0].children[0].id
        })
      }, 0)
    }
    return (

      <Menu
        className="app-sibe-bar"
        theme={this.state.theme}
        onClick={this.handleClick}
        style={{ width: 256 }}
        defaultOpenKeys={['1']}
        selectedKeys={[this.state.currentKey]}
        mode="inline"
      >

        {
          this.props.navListData.map((item, index) => (
            <SubMenu key={`${index + 1}`} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
              {
                item.children.map((secondItem, secondIndex) => (
                  secondItem.children.length ? (
                    <SubMenu key={`${index + 1}-${secondIndex + 1}`} title={secondItem.name}>
                      {
                        secondItem.children.map((thirdItem, thirdIndex) => (
                          <Menu.Item key={`${index + 1}-${secondIndex + 1}-${thirdIndex + 1}`}>
                            <Link to={thirdItem.path}>{thirdItem.name}</Link>
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>
                  ) :
                    <Menu.Item key={`${index + 1}-${secondIndex + 1}`}>
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
