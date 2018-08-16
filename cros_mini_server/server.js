"use strict";
/*
 * @Author: John.Guan
 * @Date: 2018-05-29 23:01:41
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-16 19:59:16
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
var axios = require('axios');
var apiRoutes = express.Router()
var server = app.listen(9999, 'localhost', function () {
  console.log('服务启动，地址9999');
});

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
  res.setHeader("Access-Control-Expose-Headers", "*");
  // if (request.getMethod().equals("OPTIONS")) {
  //   HttpUtil.setResponse(response, HttpStatus.OK.value(), null);
  //   return;
  // }
  // res.header("X-Powered-By", ' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  // if (req.method === 'OPTIONS') {
  //   // res.status(200).end();
  //   next();
  // } else {
  //   next();
  // }
  console.log(req.method);
  next();
});


// 处理websocket的
// const wsServer = new Server({ port: 8081 });
// wsServer.on('connection', websocket => {
//   websocket.send('欢迎连接ws服务器');
//   websocket.on('message', message => {
//     console.log(`接收到客户端发送的消息${message}`);
//   })
// })
// setInterval(() => {
//   if (wsServer.clients) {
//     wsServer.clients.forEach(client => {
//       client.send('hahhaha');
//     })
//   }
// }, 2000)
// var subscriptions = new Set(); //客户端集合
// var wsServer = new ws_1.Server({ port: 8081 });
// wsServer.on('connection', function (websocket) {
//   subscriptions.add(websocket); //客户端集合
// });
// var messageCount = 0;
// setInterval(function () {
//   subscriptions.forEach(function (subscription) {
//     // 判断是否还连接着
//     if (subscription.readyState === 1) {
//       subscription.send(JSON.stringify({ messageCount: messageCount++ }));
//     }
//     else {
//       subscriptions.delete(subscription);
//     }
//   });
// }, 2000);

var Stock = /** @class */ (function () {
  function Stock(id, name, price, rating, desc, categories) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.rating = rating;
    this.desc = desc;
    this.categories = categories;
  }
  return Stock;
}());
exports.Stock = Stock;

// 股票假数据
var stocks = [
  new Stock(1, '第1个股票', 1, 1, 'gsp第1个股票', ['IT', '互联网', '金融']),
  new Stock(2, '第2个股票', 2, 2, 'gsp第2个股票', ['IT', '互联网']),
  new Stock(3, '第3个股票', 3, 3, 'gsp第3个股票', ['金融']),
  new Stock(4, '第4个股票', 4, 4.3, 'gsp第4个股票', ['IT', '互联网']),
  new Stock(5, '第5个股票', 5, 5.3, 'gsp第5个股票', ['IT', '互联网'])
];

// 排行假数据
var paihang = [
  {
    avator: 'http://img3.redocn.com/tupian/20160108/lvsehuawentuankazhibeijingbiankuang_5728261.jpg',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: 'http://img3.redocn.com/tupian/20160108/lvsehuawentuankazhibeijingbiankuang_5728261.jpg',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
  {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  }, {
    avator: '',
    username: 'Phiuser2123',
    cow: '天天牛#123',
    ddw: 20998
  },
]

// 处理静态资源
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api', function (req, res) {
  res.send('这里是首页');
});
app.get('/api/stock', function (req, res) {
  res.json(stocks);
});
app.get('/api/stock/:id', function (req, res) {
  res.json(stocks.find(function (item) { return item.id == req.params.id; }));
});

app.get('/api/paihang', function (req, res) {
  res.json(paihang);
});
const appNavList = {
  code: '0',
  msg: '请求成功',
  data: [
    {
      id: '1',
      type: 'nav1',
      name: '主站内容',
      path: 'main',
      icon: 'video-camera',
      children: [
        {
          id: '1-1',
          type: 'nav2',
          name: '专辑管理',
          path: 'main-album',
          icon: '',
          children: []
        },
        {
          id: '1-2',
          type: 'nav2',
          name: '焦点图管理',
          path: 'main-focus',
          icon: '',
          children: []
        },
        {
          id: '1-3',
          type: 'nav2',
          name: '听单管理',
          path: 'main-listen',
          icon: '',
          children: []
        },
        {
          id: '1-4',
          type: 'nav2',
          name: '分类管理',
          path: 'main-classfiy',
          icon: '',
          children: []
        },
        {
          id: '1-5',
          type: 'nav2',
          name: '榜单管理',
          path: 'main-list',
          icon: '',
          children: []
        }
      ]

    },
    {
      id: '2',
      type: 'nav1',
      name: '自运营内容',
      path: 'self',
      icon: 'mail',
      children: [
        {
          id: '2-1',
          type: 'nav2',
          name: '专辑管理',
          path: 'self-album',
          icon: '',
          children: []
        },
        {
          id: '2-2',
          type: 'nav2',
          name: '焦点图管理',
          path: 'self-focus',
          icon: '',
          children: []
        },
        {
          id: '2-3',
          type: 'nav2',
          name: '听单管理',
          path: 'self-listen',
          icon: '',
          children: []
        },
        {
          id: '2-4',
          type: 'nav2',
          name: '分类管理',
          path: 'self-classfiy',
          icon: '',
          children: []
        },
        {
          id: '2-5',
          type: 'nav2',
          name: '标签管理',
          path: 'self-tag',
          icon: '',
          children: [
            {
              id: '2-5-1',
              type: 'nav3',
              name: '标签管理',
              path: 'self-tag-tag',
              icon: '',
              children: []
            },
            {
              id: '2-5-2',
              type: 'nav3',
              name: '维度管理',
              path: 'self-tag-dimension',
              icon: '',
              children: []
            }
          ]
        }
      ]

    },
    {
      id: '3',
      type: 'nav1',
      name: '子站管理',
      icon: 'trophy',
      path: 'child',
      children: [
        {
          id: '3-1',
          type: 'nav2',
          name: '子站管理',
          path: 'child-table',
          icon: '',
          children: []
        }
      ]
    },
    {
      id: '4',
      type: 'nav1',
      name: '权限管理',
      icon: 'setting',
      path: 'auth',
      children: [
        {
          id: '4-1',
          type: 'nav3',
          name: '账户维护',
          path: 'auth-account',
          icon: '',
          children: []
        },
        {
          id: '4-2',
          type: 'nav3',
          name: '角色维护',
          path: 'auth-role',
          icon: '',
          children: []
        },
        {
          id: '4-3',
          type: 'nav3',
          name: '菜单与功能维护',
          path: 'auth-menu',
          icon: '',
          children: []
        }
      ]
    }

  ]
}

app.get('/open-self-admin/appNavList', function (req, res) {
  console.log(res);
  // console.log('11111');
  setTimeout(() => {
    res.json(appNavList);
  }, 1000);
});
