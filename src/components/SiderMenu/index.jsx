import React, {Component} from 'react'
import './style.scss'
import {Link} from 'react-router-dom'
import {Menu} from 'antd'
import api, {http} from '../../service'

const {SubMenu, Item} = Menu

const menuList = [
    {
        name: '官网运营中心',
        path: '',
        title: 1,
        id: 1000,
    },
    {
        name: '开发者文档',
        id: 1010,
        children: [
            {
                name: '文档分类',
                path: '/developerDoc/Catagories',
                id: 1011,
            },
            {
                name: '文档内容',
                path: '/developerDoc/DocContent',
                id: 1012,
            }
        ]
    },
    {
        name: '帮助支持',
        id: 1020,
        children: [
            {
                name: '帮助一级分类',
                path: '/help/Top',
                id: 1021,
            },
            {
                name: '帮助二级分类',
                path: '/help/secondary',
                id: 1022,
            },
            {
                name: '帮助内容',
                path: '/help/content',
                id: 1023,
            }
        ]
    },
    {
        name: '平台公告',
        path: '/announcement/index',
        id: 1030,
    },
    {
        name: '官网审批中心',
        path: '',
        title: 1,
        id: 1100,
    },
    {
        name: '开发者审批',
        id: 1110,
        children: [
            {
                name: '企业开发者',
                path: '/developerAudit/Company',
                id: 1111,
            },
            {
                name: '个人开发者',
                path: '/developerAudit/Personal',
                id: 1112,
            }
        ]
    },
    {
        name: '移动/网站应用审批',
        id: 1120,
        children: [
            {
                name: '应用审批',
                path: '/mobileAudit/ApplyAudit',
                id: 1121,
            },
            {
                name: '服务端接入审批',
                path: '/mobileAudit/ServerAudit',
                id: 1122,
            },
            {
                name: '付费分销接入审批',
                path: '/mobileAudit/FeeAudit',
                id: 1123,
            }
        ]
    },
    {
        name: '智能硬件应用审批',
        id: 1130,
        children: [
            {
                name: '应用审批',
                path: '/intelligentAudit/IntellApply',
                id: 1131,
            },
            {
                name: '服务端审批',
                path: '/intelligentAudit/IntellServer',
                id: 1132,
            }
        ]
    },
    {
        name: '官网管理中心',
        title: 1,
        path: '',
        id: 1200,
    },
    {
        name: '站内信管理',
        path: '/netWorkManage/index',
        id: 1201,
    },
]

export default class SiderMenu extends Component {
    componentDidMount() {
        http.get(api.CATEGORIES).then(res => {
        })
    }

    render() {
        return (
            <Menu mode="inline" className="sider-menu-container">
                {menuList.map(
                    (menu, index) =>
                        menu.children ? (
                            <SubMenu title={<div style={menu.title ? {} : {marginLeft: 20}}>{menu.name}</div>} key={menu.id}>
                                {menu.children.map((submenu, idx) => (
                                    <Item key={submenu.id}>
                                        <Link to={submenu.path}>{submenu.name}</Link>
                                    </Item>
                                ))}
                            </SubMenu>
                        ) : (
                        <Item key={menu.id} style={menu.title ? {} : {}}>
                            {menu.path ? <Link to={menu.path} style={{marginLeft:20}}>{menu.name}</Link>: <div>{menu.name}</div>}
                        </Item>
                        )
                )}
            </Menu>
        )
    }
}
