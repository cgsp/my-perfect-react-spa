"use strict";
/*
 * @Author: John.Guan
 * @Date: 2018-05-29 23:01:41
 * @Last Modified by: John.Guan
 * @Last Modified time: 2019-03-08 10:12:17
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
var axios = require('axios');
var queryString = require('query-string');
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

var listData1 = {
  "code": 0,
  "msg": "成功",
  "last_page": 5,
  "data": [
    { "id": 1, "title": "第【1】条测试标题" },
    { "id": 2, "title": "第【2】条测试标题" },
    { "id": 3, "title": "第【3】条测试标题" },
    { "id": 4, "title": "第【4】条测试标题" },
    { "id": 5, "title": "第【5】条测试标题" },
    { "id": 6, "title": "第【6】条测试标题" },
    { "id": 7, "title": "第【7】条测试标题" },
    { "id": 8, "title": "第【8】条测试标题" },
    { "id": 9, "title": "第【9】条测试标题" },
    { "id": 10, "title": "第【10】条测试标题" }
  ]
}

var listData2 = {
  "code": 0,
  "msg": "成功",
  "last_page": 5,
  "data": [
    { "id": 11, "title": "第【11】条测试标题" },
    { "id": 12, "title": "第【12】条测试标题" },
    { "id": 13, "title": "第【13】条测试标题" },
    { "id": 14, "title": "第【14】条测试标题" },
    { "id": 15, "title": "第【15】条测试标题" },
    { "id": 16, "title": "第【16】条测试标题" },
    { "id": 17, "title": "第【17】条测试标题" },
    { "id": 18, "title": "第【18】条测试标题" },
    { "id": 19, "title": "第【19】条测试标题" },
    { "id": 20, "title": "第【20】条测试标题" }
  ]
}

var listData3 = {
  "code": 0,
  "msg": "成功",
  "last_page": 5,
  "data": [
    { "id": 21, "title": "第【21】条测试标题" },
    { "id": 22, "title": "第【22】条测试标题" },
    { "id": 23, "title": "第【23】条测试标题" },
    { "id": 24, "title": "第【24】条测试标题" },
    { "id": 25, "title": "第【25】条测试标题" },
    { "id": 26, "title": "第【26】条测试标题" },
    { "id": 27, "title": "第【27】条测试标题" },
    { "id": 28, "title": "第【28】条测试标题" },
    { "id": 29, "title": "第【29】条测试标题" },
    { "id": 30, "title": "第【30】条测试标题" }
  ]
}

var listData4 = {
  "code": 0,
  "msg": "成功",
  "last_page": 5,
  "data": [
    { "id": 31, "title": "第【31】条测试标题" },
    { "id": 32, "title": "第【32】条测试标题" },
    { "id": 33, "title": "第【33】条测试标题" },
    { "id": 34, "title": "第【34】条测试标题" },
    { "id": 35, "title": "第【35】条测试标题" },
    { "id": 36, "title": "第【36】条测试标题" },
    { "id": 37, "title": "第【37】条测试标题" },
    { "id": 38, "title": "第【38】条测试标题" },
    { "id": 39, "title": "第【39】条测试标题" },
    { "id": 40, "title": "第【40】条测试标题" }
  ]
}

var listData5 = {
  "code": 0,
  "msg": "成功",
  "last_page": 5,
  "data": [
    { "id": 41, "title": "第【41】条测试标题" },
    { "id": 42, "title": "第【42】条测试标题" },
    { "id": 43, "title": "第【43】条测试标题" },
    { "id": 44, "title": "第【44】条测试标题" },
    { "id": 45, "title": "第【45】条测试标题" },
    { "id": 46, "title": "第【46】条测试标题" },
    { "id": 47, "title": "第【47】条测试标题" },
    { "id": 48, "title": "第【48】条测试标题" },
    { "id": 49, "title": "第【49】条测试标题" },
    { "id": 50, "title": "第【50】条测试标题" }
  ]
}

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

app.get('/api/list-data/:page', function (req, res) {
  let { page } = req.params
  page = page - 0
  // const { page } = queryString.parse(queryString.extract(req.href))
  console.log('请求进来了')
  let obj = null
  switch (page) {
    case 1:
      obj = listData1
      break;
    case 2:
      obj = listData2
      break;
    case 3:
      obj = listData3
      break;
    case 4:
      obj = listData4
      break;
    case 5:
      obj = listData5
      break;
    default:
      break;
  }
  setTimeout(() => {
    res.json(obj)
  }, 200)
});
