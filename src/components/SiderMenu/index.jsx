import React, { Component } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { Menu } from "antd";

const { SubMenu, Item } = Menu;

const CMSList = [
  {
    name: "开发者文档",
    id: 1010,
    children: [
      {
        name: "文档分类",
        path: "/cmsManage/developerDoc/Catagories",
        id: 1011
      },
      {
        name: "文档内容",
        path: "/cmsManage/developerDoc/DocContent",
        id: 1012
      }
    ]
  },

  {
    name: "帮助支持",
    id: 1020,
    children: [
      {
        name: "帮助一级分类",
        path: "/cmsManage/help/Top",
        id: 1021
      },
      {
        name: "帮助二级分类",
        path: "/cmsManage/help/secondary",
        id: 1022
      },
      {
        name: "帮助内容",
        path: "/cmsManage/help/content",
        id: 1023
      }
    ]
  },
  {
    name: "平台公告",
    path: "/cmsManage/announcement/index",
    id: 1030
  },
  {
    name: "站内信管理",
    path: "/cmsManage/netWorkManage/index",
    id: 1201
  }
];

const auditList = [
  {
    name: "开发者审批",
    id: 1110,
    children: [
      {
        name: "企业开发者",
        path: "/auditCenter/developerAudit/Company",
        id: 1111
      },
      {
        name: "个人开发者",
        path: "/auditCenter/developerAudit/Personal",
        id: 1112
      }
    ]
  },
  {
    name: "移动/网站应用审批",
    id: 1120,
    children: [
      {
        name: "应用审批",
        path: "/auditCenter/mobileAudit/ApplyAudit",
        id: 1121
      },
      {
        name: "服务端接入审批",
        path: "/auditCenter/mobileAudit/ServerAudit",
        id: 1122
      },
      {
        name: "付费分销接入审批",
        path: "/auditCenter/mobileAudit/FeeAudit",
        id: 1123
      }
    ]
  },
  {
    name: "智能硬件应用审批",
    id: 1130,
    children: [
      {
        name: "应用审批",
        path: "/auditCenter/intelligentAudit/IntellApply",
        id: 1131
      },
      {
        name: "服务端接入审批",
        path: "/auditCenter/intelligentAudit/IntellServer",
        id: 1132
      }
    ]
  },
  {
    name: "费用审批",
    id: 1140,
    children: [
      {
        name: "现金账户资金审批",
        path: "/auditCenter/feeAudit/cash",
        id: 1141
      },
      {
        name: "提现银行卡审批",
        path: "/auditCenter/feeAudit/withdraw",
        id: 1142
      }
    ]
  }
];

const authList = [
  {
    name: "权限管理",
    id: 1210,
    children: [
      {
        name: "角色管理",
        path: "/setting/authManage/role",
        id: 1211
      },
      {
        name: "用户管理",
        path: "/setting/authManage/user",
        id: 1212
      },
      {
        name: "系统权限管理",
        path: "/setting/authManage/systemAuth",
        id: 1213
      },
      {
        name: "商务渠道管理",
        path: "/setting/authManage/businessChannel",
        id: 1214
      }
    ]
  }
];

const feeList = [
  {
    name: "现金账户管理",
    id: 1310,
    children: [
      {
        name: "现金账户",
        path: "/feeManage/cashAndAccount/cash",
        id: 1311
      },
      {
        name: "充值记录",
        path: "/feeManage/cashAndAccount/recharge",
        id: 1312
      },
      {
        name: "提现记录",
        path: "/feeManage/cashAndAccount/withdraw",
        id: 1313
      }
    ]
  }
];

const awardList = [
  {
    name: "奖励规则",
    id: 1410,
    path: "/awardManage/rules"
  },
  {
    name: "开发者管理",
    id: 1420,
    path: "/awardManage/developer"
  },
  {
    name: "奖励账户管理",
    id: 1430,
    children: [
      {
        name: "奖励账号",
        path: "/awardManage/account",
        id: 1431
      },
      {
        name: "转出记录",
        path: "/awardManage/rollout",
        id: 1432
      },
      {
        name: "结算记录",
        path: "/awardManage/settleAccount",
        id: 1433
      }
    ]
  },
  {
    name: "合作方对账管理",
    id: 1440,
    children: [
      {
        name: "奖励账单",
        path: "/awardManage/bill",
        id: 1441
      },
      {
        name: "奖励订单",
        path: "/awardManage/order",
        id: 1442
      }
    ]
  }
];

export default class SiderMenu extends Component {
  render() {
    let menuList = [];
    if (/\/auditCenter\//.test(location.pathname)) {
      menuList = auditList;
    } else if (/\/cmsManage\//.test(location.pathname)) {
      menuList = CMSList;
    } else if (/\/setting\//.test(location.pathname)) {
      menuList = authList;
    } else if (/\/feeManage\//.test(location.pathname)) {
      menuList = feeList;
    } else if (/\/awardManage\//.test(location.pathname)) {
      menuList = awardList;
    }
    return (
      <Menu mode="inline" className="sider-menu-container">
        {menuList.map(
          (menu, index) =>
            menu.children ? (
              <SubMenu
                title={
                  <div style={menu.title ? {} : { marginLeft: 20 }}>
                    {menu.name}
                  </div>
                }
                key={menu.id}
              >
                {menu.children.map((submenu, idx) => (
                  <Item key={submenu.id}>
                    <Link to={submenu.path}>{submenu.name}</Link>
                  </Item>
                ))}
              </SubMenu>
            ) : (
              <Item key={menu.id} style={menu.title ? {} : {}}>
                {menu.path ? (
                  <Link to={menu.path} style={{ marginLeft: 20 }}>
                    {menu.name}
                  </Link>
                ) : (
                  <div>{menu.name}</div>
                )}
              </Item>
            )
        )}
      </Menu>
    );
  }
}
