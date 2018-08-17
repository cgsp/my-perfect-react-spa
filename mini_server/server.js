"use strict";
/*
 * @Author: John.Guan
 * @Date: 2018-05-29 23:01:41
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-17 11:28:15
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
var axios = require('axios');


// 处理静态资源
// app.use('/', express.static(path.join(__dirname, '..', 'client')));
// app.get('/api', function (req, res) {
//     res.send('这里是首页');
// });
// app.get('/api/stock', function (req, res) {
//     res.json(stocks);
// });
// app.get('/api/stock/:id', function (req, res) {
//     res.json(stocks.find(function (item) { return item.id == req.params.id; }));
// });

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getCdInfo', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({.+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data

    // 如果返回的是jsonp的话，转化成json给自己

    if (typeof ret === 'string') {
      var reg = /^\w+\(({.+})\)$/
      // console.log(+new Date)
      var matches = ret.match(reg)
      // console.log(+new Date)

      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }

    // 通过res.json()输出出去
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

// app.use('/api', apiRoutes);
app.use('', apiRoutes);



var server = app.listen(8888, 'localhost', function () {
  console.log('服务启动，地址8888');
});



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
var subscriptions = new Set(); //客户端集合
var wsServer = new ws_1.Server({ port: 8081 });
wsServer.on('connection', function (websocket) {
  subscriptions.add(websocket); //客户端集合
});
var messageCount = 0;
setInterval(function () {
  subscriptions.forEach(function (subscription) {
    // 判断是否还连接着
    if (subscription.readyState === 1) {
      subscription.send(JSON.stringify({ messageCount: messageCount++ }));
    }
    else {
      subscriptions.delete(subscription);
    }
  });
}, 2000);
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





// 整个导航的数据1
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
  setTimeout(() => {
    res.json(appNavList);
  }, 800);
});
