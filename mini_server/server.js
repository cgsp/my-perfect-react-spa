"use strict";
/*
 * @Author: John.Guan
 * @Date: 2018-05-29 23:01:41
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-08-20 16:39:51
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

/*
 * 账号维护=====================================================
 */
const authAccountList = {
  code: '0',
  msg: '请求成功',
  data: [{
    id: '1',
    username: 'John Brown',
    rolename: 'New York ',
  }, {
    id: '2',
    username: 'Jim Green',
    rolename: 'London',
  }, {
    id: '3',
    username: 'Joe Black',
    rolename: 'Sidney',
  }, {
    id: '4',
    username: 'Joe Black',
    rolename: 'Sidney',
  },
  {
    id: '5',
    username: 'Joe Black',
    rolename: 'Sidney',
  },
  {
    id: '6',
    username: 'Joe Black',
    rolename: 'Sidney',
  }, {
    id: '7',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '8',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '9',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '10',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '11',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '12',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '13',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '14',
    username: 'Joe Black',
    rolename: 'Sidney',
  }
    , {
    id: '15',
    username: 'Joe Black',
    rolename: 'Sidney',
  }]

}

app.get('/open-self-admin/authAccountList', function (req, res) {
  setTimeout(() => {
    res.json(authAccountList);
  }, 800);
});

// 账号维护，获取角色
const roleList = []
for (let i = 10; i < 36; i++) {
  roleList.push({
    key: i.toString(36) + i,
    text: i.toString(36) + i
  });
}

app.get('/open-self-admin/authAccountPageRoleList', function (req, res) {
  setTimeout(() => {
    res.json({
      code: '0',
      msg: '成功',
      data: roleList
    });
  }, 800);
});

app.post('/open-self-admin/authAccountDelete', function (req, res) {
  setTimeout(() => {
    res.json({
      code: '0',
      msg: '成功删除',
      data: []
    });
  }, 800);
});
// 新增与修改用户
app.post('/open-self-admin/authAccountAdd', function (req, res) {
  setTimeout(() => {
    res.json({
      code: '0',
      msg: '成功新增',
      data: []
    });
  }, 800);
});

/*
 * 角色维护=====================================================
 */

const authRolePageList = {
  code: '0',
  msg: '请求成功',
  data: [{
    id: '1',
    roledesc: '这是一个好角色',
    rolename: 'New York ',
  }, {
    id: '2',
    roledesc: '这是一个好角色',
    rolename: 'London',
  }, {
    id: '3',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }, {
    id: '4',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  },
  {
    id: '5',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  },
  {
    id: '6',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }, {
    id: '7',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }
    , {
    id: '8',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }
    , {
    id: '9',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }
    , {
    id: '10',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }
    , {
    id: '11',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }
    , {
    id: '12',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }
    , {
    id: '13',
    roledesc: '这是一个好角色',
    rolename: 'Sidney',
  }]

}

// 列表
app.get('/open-self-admin/authRolePageList', function (req, res) {
  setTimeout(() => {
    res.json(authRolePageList);
  }, 800);
});

// 删除
app.post('/open-self-admin/authRolePageListDelete', function (req, res) {
  setTimeout(() => {
    res.json({
      code: '0',
      msg: '成功删除',
      data: []
    });
  }, 800);
});

const appNavAndAuthList = {
  code: '0',
  msg: '请求成功',
  data: [
    {
      pid: '0',
      sort: '1',
      id: '1',
      type: '菜单',
      level: '1',
      name: '主站内容',
      path: 'main',
      icon: 'video-camera',
      checked: false,
      code: null
    },
    {
      pid: '1',
      sort: '1',
      id: '1-1',
      type: '菜单',
      level: '2',
      name: '专辑管理',
      path: 'main-album',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-1',
      sort: '1',
      id: '1-1-1',
      type: '功能按钮',
      level: null,
      name: '专辑批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:album-export'
    },
    {
      pid: '1-1',
      sort: '2',
      id: '1-1-2',
      type: '功能按钮',
      level: null,
      name: '声音批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:video-export'
    },
    {
      pid: '1-1',
      sort: '3',
      id: '1-1-3',
      type: '功能按钮',
      level: null,
      name: '批量打标签',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:make-tags'
    },
    {
      pid: '1-1',
      sort: '4',
      id: '1-1-4',
      type: '功能按钮',
      level: null,
      name: '打标签',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:make-tag'
    },
    {
      pid: '1-1',
      sort: '5',
      id: '1-1-5',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:save'
    },
    {
      pid: '1',
      sort: '2',
      id: '1-2',
      type: '菜单',
      level: '2',
      name: '焦点图管理',
      path: 'main-focus',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-2',
      sort: '1',
      id: '1-2-1',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-focus:save'
    },
    {
      pid: '1',
      sort: '3',
      id: '1-3',
      type: '菜单',
      level: '2',
      name: '听单管理',
      path: 'main-listen',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-3',
      sort: '1',
      id: '1-3-1',
      type: '功能按钮',
      level: null,
      name: '听单批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-listen:listen-export'
    },
    {
      pid: '1-3',
      sort: '2',
      id: '1-3-2',
      type: '功能按钮',
      level: null,
      name: '内容批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-listen:content-export'
    },
    {
      pid: '1-3',
      sort: '3',
      id: '1-3-3',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-listen:save'
    },
    {
      pid: '1',
      sort: '4',
      id: '1-4',
      type: '菜单',
      level: '2',
      name: '分类管理',
      path: 'main-classfiy',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-4',
      sort: '1',
      id: '1-4-1',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-classfiy:save'
    },
    {
      pid: '1',
      sort: '5',
      id: '1-5',
      type: '菜单',
      level: '2',
      name: '榜单管理',
      path: 'main-list',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '0',
      sort: '2',
      id: '2',
      type: '菜单',
      level: '1',
      name: '自运营内容',
      path: 'self',
      icon: 'mail',
      checked: false,
      code: null
    },
    {
      pid: '2',
      sort: '1',
      id: '2-1',
      type: '菜单',
      level: '2',
      name: '专辑管理',
      path: 'self-album',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-1',
      sort: '1',
      id: '2-1-1',
      type: '功能按钮',
      level: null,
      name: '新增自运营专辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:add'
    },
    {
      pid: '2-1',
      sort: '2',
      id: '2-1-2',
      type: '功能按钮',
      level: null,
      name: '专辑批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:album-export'
    },
    {
      pid: '2-1',
      sort: '3',
      id: '2-1-3',
      type: '功能按钮',
      level: null,
      name: '声音批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:video-export'
    },
    {
      pid: '2-1',
      sort: '4',
      id: '2-1-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:edit'
    },
    {
      pid: '2',
      sort: '2',
      id: '2-2',
      type: '菜单',
      level: '2',
      name: '焦点图管理',
      path: 'self-focus',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-2',
      sort: '1',
      id: '2-2-1',
      type: '功能按钮',
      level: null,
      name: '新增焦点图',
      path: null,
      icon: '',
      checked: false,
      code: 'self-focus:add'
    },
    {
      pid: '2-2',
      sort: '2',
      id: '2-2-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-focus:edit'
    },
    {
      pid: '2',
      sort: '3',
      id: '2-3',
      type: '菜单',
      level: '2',
      name: '听单管理',
      path: 'self-listen',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-3',
      sort: '1',
      id: '2-3-1',
      type: '功能按钮',
      level: null,
      name: '新增听单',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:add'
    },
    {
      pid: '2-3',
      sort: '2',
      id: '2-3-2',
      type: '功能按钮',
      level: null,
      name: '听单批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:listen-export'
    },
    {
      pid: '2-3',
      sort: '3',
      id: '2-3-3',
      type: '功能按钮',
      level: null,
      name: '内容批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:content-export'
    },
    {
      pid: '2-3',
      sort: '4',
      id: '2-3-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:edit'
    },
    {
      pid: '2',
      sort: '4',
      id: '2-4',
      type: '菜单',
      level: '2',
      name: '分类管理',
      path: 'self-classfiy',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-4',
      sort: '1',
      id: '2-4-1',
      type: '功能按钮',
      level: null,
      name: '新增分类',
      path: null,
      icon: '',
      checked: false,
      code: 'self-classfiy:add'
    },
    {
      pid: '2-4',
      sort: '2',
      id: '2-4-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-classfiy:edit'
    },
    {
      pid: '2',
      sort: '5',
      id: '2-5',
      type: '菜单',
      level: '2',
      name: '标签管理',
      path: 'self-tag',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-5',
      sort: '1',
      id: '2-5-1',
      type: '菜单',
      level: '3',
      name: '标签管理',
      path: 'self-tag-tag',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-5-1',
      sort: '1',
      id: '2-5-1-1',
      type: '功能按钮',
      level: null,
      name: '新增标签',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:add'
    },
    {
      pid: '2-5-1',
      sort: '2',
      id: '2-5-1-2',
      type: '功能按钮',
      level: null,
      name: '标签批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:tag-export'
    },
    {
      pid: '2-5-1',
      sort: '3',
      id: '2-5-1-3',
      type: '功能按钮',
      level: null,
      name: '专辑批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:album-export'
    },
    {
      pid: '2-5-1',
      sort: '4',
      id: '2-5-1-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:edit'
    },
    {
      pid: '2-5-1',
      sort: '5',
      id: '2-5-1-5',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:delete'
    },
    {
      pid: '2-5',
      sort: '2',
      id: '2-5-2',
      type: '菜单',
      level: '3',
      name: '维度管理',
      path: 'self-tag-dimension',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-5-2',
      sort: '1',
      id: '2-5-2-1',
      type: '功能按钮',
      level: null,
      name: '新增维度',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:add-dimension'
    },
    {
      pid: '2-5-2',
      sort: '2',
      id: '2-5-2-2',
      type: '功能按钮',
      level: null,
      name: '维度导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:dimension-export'
    },
    {
      pid: '2-5-2',
      sort: '3',
      id: '2-5-2-3',
      type: '功能按钮',
      level: null,
      name: '标签导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:tag-export'
    },
    {
      pid: '2-5-2',
      sort: '4',
      id: '2-5-2-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:edit'
    },
    {
      pid: '2-5-2',
      sort: '5',
      id: '2-5-2-5',
      type: '功能按钮',
      level: null,
      name: '添加标签',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:add-tag'
    },
    {
      pid: '2-5-2',
      sort: '6',
      id: '2-5-2-6',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:delete'
    },
    {
      pid: '0',
      sort: '3',
      id: '3',
      type: '菜单',
      level: '1',
      name: '子站管理',
      path: 'child',
      icon: 'trophy',
      checked: false,
      code: null
    },
    {
      pid: '3',
      sort: '1',
      id: '3-1',
      type: '菜单',
      level: '2',
      name: '子站管理',
      path: 'child-table',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '3-1',
      sort: '1',
      id: '3-1-1',
      type: '功能按钮',
      level: null,
      name: '新增子站',
      path: null,
      icon: '',
      checked: false,
      code: 'child-table:add'
    },
    {
      pid: '3-1',
      sort: '2',
      id: '3-1-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'child-table:edit'
    },
    {
      pid: '3-1',
      sort: '3',
      id: '3-1-3',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'child-table:save'
    },
    {
      pid: '0',
      sort: '4',
      id: '4',
      type: '菜单',
      level: '1',
      name: '权限管理',
      path: 'auth',
      icon: 'setting',
      checked: false,
      code: null
    },
    {
      pid: '4',
      sort: '1',
      id: '4-1',
      type: '菜单',
      level: '2',
      name: '账号维护',
      path: 'auth-account',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '4-1',
      sort: '1',
      id: '4-1-1',
      type: '功能按钮',
      level: null,
      name: '新建用户',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-account:add'
    },
    {
      pid: '4-1',
      sort: '2',
      id: '4-1-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-account:edit'
    },
    {
      pid: '4-1',
      sort: '3',
      id: '4-1-3',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-account:delete'
    },
    {
      pid: '4',
      sort: '2',
      id: '4-2',
      type: '菜单',
      level: '2',
      name: '角色维护',
      path: 'auth-role',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '4-2',
      sort: '1',
      id: '4-2-1',
      type: '功能按钮',
      level: null,
      name: '新建角色',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-role:add'
    },
    {
      pid: '4-2',
      sort: '2',
      id: '4-2-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-role:edit'
    },
    {
      pid: '4-2',
      sort: '3',
      id: '4-2-3',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-role:delete'
    },
    {
      pid: '4',
      sort: '3',
      id: '4-3',
      type: '菜单',
      level: '2',
      name: '菜单与功能维护',
      path: 'auth-menu',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '4-3',
      sort: '1',
      id: '4-3-1',
      type: '功能按钮',
      level: null,
      name: '新增一级节点',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:add-level1'
    },
    {
      pid: '4-3',
      sort: '2',
      id: '4-3-2',
      type: '功能按钮',
      level: null,
      name: '新增子节点',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:add-child'
    },
    {
      pid: '4-3',
      sort: '3',
      id: '4-3-3',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:edit'
    },
    {
      pid: '4-3',
      sort: '4',
      id: '4-3-4',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:delete'
    },
  ]
}

app.get('/open-self-admin/authRolePageNavAndAuthList', function (req, res) {
  setTimeout(() => {
    res.json(appNavAndAuthList);
  }, 800);
});

const appNavAndAuthListSomeRole = {
  code: '0',
  msg: '请求成功',
  data: [
    {
      pid: '0',
      sort: '1',
      id: '1',
      type: '菜单',
      level: '1',
      name: '主站内容',
      path: 'main',
      icon: 'video-camera',
      checked: true,
      code: null
    },
    {
      pid: '1',
      sort: '1',
      id: '1-1',
      type: '菜单',
      level: '2',
      name: '专辑管理',
      path: 'main-album',
      icon: '',
      checked: true,
      code: null
    },
    {
      pid: '1-1',
      sort: '1',
      id: '1-1-1',
      type: '功能按钮',
      level: null,
      name: '专辑批量导出',
      path: null,
      icon: '',
      checked: true,
      code: 'main-album:album-export'
    },
    {
      pid: '1-1',
      sort: '2',
      id: '1-1-2',
      type: '功能按钮',
      level: null,
      name: '声音批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:video-export'
    },
    {
      pid: '1-1',
      sort: '3',
      id: '1-1-3',
      type: '功能按钮',
      level: null,
      name: '批量打标签',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:make-tag'
    },
    {
      pid: '1-1',
      sort: '4',
      id: '1-1-4',
      type: '功能按钮',
      level: null,
      name: '打标签',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:make-tag'
    },
    {
      pid: '1-1',
      sort: '5',
      id: '1-1-5',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-album:save'
    },
    {
      pid: '1',
      sort: '2',
      id: '1-2',
      type: '菜单',
      level: '2',
      name: '焦点图管理',
      path: 'main-focus',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-2',
      sort: '1',
      id: '1-2-1',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-focus:save'
    },
    {
      pid: '1',
      sort: '3',
      id: '1-3',
      type: '菜单',
      level: '2',
      name: '听单管理',
      path: 'main-listen',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-3',
      sort: '1',
      id: '1-3-1',
      type: '功能按钮',
      level: null,
      name: '听单批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-listen:listen-export'
    },
    {
      pid: '1-3',
      sort: '2',
      id: '1-3-2',
      type: '功能按钮',
      level: null,
      name: '内容批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'main-listen:content-export'
    },
    {
      pid: '1-3',
      sort: '3',
      id: '1-3-3',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-listen:save'
    },
    {
      pid: '1',
      sort: '4',
      id: '1-4',
      type: '菜单',
      level: '2',
      name: '分类管理',
      path: 'main-classfiy',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '1-4',
      sort: '1',
      id: '1-4-1',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'main-classfiy:save'
    },
    {
      pid: '1',
      sort: '5',
      id: '1-5',
      type: '菜单',
      level: '2',
      name: '榜单管理',
      path: 'main-list',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '0',
      sort: '2',
      id: '2',
      type: '菜单',
      level: '1',
      name: '自运营内容',
      path: 'self',
      icon: 'mail',
      checked: true,
      code: null
    },
    {
      pid: '2',
      sort: '1',
      id: '2-1',
      type: '菜单',
      level: '2',
      name: '专辑管理',
      path: 'self-album',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-1',
      sort: '1',
      id: '2-1-1',
      type: '功能按钮',
      level: null,
      name: '新增自运营专辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:add'
    },
    {
      pid: '2-1',
      sort: '2',
      id: '2-1-2',
      type: '功能按钮',
      level: null,
      name: '专辑批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:album-export'
    },
    {
      pid: '2-1',
      sort: '3',
      id: '2-1-3',
      type: '功能按钮',
      level: null,
      name: '声音批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:video-export'
    },
    {
      pid: '2-1',
      sort: '4',
      id: '2-1-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-album:edit'
    },
    {
      pid: '2',
      sort: '2',
      id: '2-2',
      type: '菜单',
      level: '2',
      name: '焦点图管理',
      path: 'self-focus',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-2',
      sort: '1',
      id: '2-2-1',
      type: '功能按钮',
      level: null,
      name: '新增焦点图',
      path: null,
      icon: '',
      checked: false,
      code: 'self-focus:add'
    },
    {
      pid: '2-2',
      sort: '2',
      id: '2-2-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-focus:edit'
    },
    {
      pid: '2',
      sort: '3',
      id: '2-3',
      type: '菜单',
      level: '2',
      name: '听单管理',
      path: 'self-listen',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-3',
      sort: '1',
      id: '2-3-1',
      type: '功能按钮',
      level: null,
      name: '新增听单',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:add'
    },
    {
      pid: '2-3',
      sort: '2',
      id: '2-3-2',
      type: '功能按钮',
      level: null,
      name: '听单批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:listen-export'
    },
    {
      pid: '2-3',
      sort: '3',
      id: '2-3-3',
      type: '功能按钮',
      level: null,
      name: '内容批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:content-export'
    },
    {
      pid: '2-3',
      sort: '4',
      id: '2-3-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-listen:edit'
    },
    {
      pid: '2',
      sort: '4',
      id: '2-4',
      type: '菜单',
      level: '2',
      name: '分类管理',
      path: 'self-classfiy',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-4',
      sort: '1',
      id: '2-4-1',
      type: '功能按钮',
      level: null,
      name: '新增分类',
      path: null,
      icon: '',
      checked: false,
      code: 'self-classfiy:add'
    },
    {
      pid: '2-4',
      sort: '2',
      id: '2-4-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-classfiy:edit'
    },
    {
      pid: '2',
      sort: '5',
      id: '2-5',
      type: '菜单',
      level: '2',
      name: '标签管理',
      path: 'self-tag',
      icon: '',
      checked: true,
      code: null
    },
    {
      pid: '2-5',
      sort: '1',
      id: '2-5-1',
      type: '菜单',
      level: '3',
      name: '标签管理',
      path: 'self-tag-tag',
      icon: '',
      checked: true,
      code: null
    },
    {
      pid: '2-5-1',
      sort: '1',
      id: '2-5-1-1',
      type: '功能按钮',
      level: null,
      name: '新增标签',
      path: null,
      icon: '',
      checked: true,
      code: 'self-tag-tag:add'
    },
    {
      pid: '2-5-1',
      sort: '2',
      id: '2-5-1-2',
      type: '功能按钮',
      level: null,
      name: '标签批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:tag-export'
    },
    {
      pid: '2-5-1',
      sort: '3',
      id: '2-5-1-3',
      type: '功能按钮',
      level: null,
      name: '专辑批量导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:album-export'
    },
    {
      pid: '2-5-1',
      sort: '4',
      id: '2-5-1-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:edit'
    },
    {
      pid: '2-5-1',
      sort: '5',
      id: '2-5-1-5',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-tag:delete'
    },
    {
      pid: '2-5',
      sort: '2',
      id: '2-5-2',
      type: '菜单',
      level: '3',
      name: '维度管理',
      path: 'self-tag-dimension',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '2-5-2',
      sort: '1',
      id: '2-5-2-1',
      type: '功能按钮',
      level: null,
      name: '新增维度',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:add-dimension'
    },
    {
      pid: '2-5-2',
      sort: '2',
      id: '2-5-2-2',
      type: '功能按钮',
      level: null,
      name: '维度导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:dimension-export'
    },
    {
      pid: '2-5-2',
      sort: '3',
      id: '2-5-2-3',
      type: '功能按钮',
      level: null,
      name: '标签导出',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:tag-export'
    },
    {
      pid: '2-5-2',
      sort: '4',
      id: '2-5-2-4',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:edit'
    },
    {
      pid: '2-5-2',
      sort: '5',
      id: '2-5-2-5',
      type: '功能按钮',
      level: null,
      name: '添加标签',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:add-tag'
    },
    {
      pid: '2-5-2',
      sort: '6',
      id: '2-5-2-6',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'self-tag-dimension:delete'
    },
    {
      pid: '0',
      sort: '3',
      id: '3',
      type: '菜单',
      level: '1',
      name: '子站管理',
      path: 'child',
      icon: 'trophy',
      checked: false,
      code: null
    },
    {
      pid: '3',
      sort: '1',
      id: '3-1',
      type: '菜单',
      level: '2',
      name: '子站管理',
      path: 'child-table',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '3-1',
      sort: '1',
      id: '3-1-1',
      type: '功能按钮',
      level: null,
      name: '新增子站',
      path: null,
      icon: '',
      checked: false,
      code: 'child-table:add'
    },
    {
      pid: '3-1',
      sort: '2',
      id: '3-1-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'child-table:edit'
    },
    {
      pid: '3-1',
      sort: '3',
      id: '3-1-3',
      type: '功能按钮',
      level: null,
      name: '另存为',
      path: null,
      icon: '',
      checked: false,
      code: 'child-table:save'
    },
    {
      pid: '0',
      sort: '4',
      id: '4',
      type: '菜单',
      level: '1',
      name: '权限管理',
      path: 'auth',
      icon: 'setting',
      checked: false,
      code: null
    },
    {
      pid: '4',
      sort: '1',
      id: '4-1',
      type: '菜单',
      level: '2',
      name: '账号维护',
      path: 'auth-account',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '4-1',
      sort: '1',
      id: '4-1-1',
      type: '功能按钮',
      level: null,
      name: '新建用户',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-account:add'
    },
    {
      pid: '4-1',
      sort: '2',
      id: '4-1-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-account:edit'
    },
    {
      pid: '4-1',
      sort: '3',
      id: '4-1-3',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-account:delete'
    },
    {
      pid: '4',
      sort: '2',
      id: '4-2',
      type: '菜单',
      level: '2',
      name: '角色维护',
      path: 'auth-role',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '4-2',
      sort: '1',
      id: '4-2-1',
      type: '功能按钮',
      level: null,
      name: '新建角色',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-role:add'
    },
    {
      pid: '4-2',
      sort: '2',
      id: '4-2-2',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-role:edit'
    },
    {
      pid: '4-2',
      sort: '3',
      id: '4-2-3',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-role:delete'
    },
    {
      pid: '4',
      sort: '3',
      id: '4-3',
      type: '菜单',
      level: '2',
      name: '菜单与功能维护',
      path: 'auth-menu',
      icon: '',
      checked: false,
      code: null
    },
    {
      pid: '4-3',
      sort: '1',
      id: '4-3-1',
      type: '功能按钮',
      level: null,
      name: '新增一级节点',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:add-level1'
    },
    {
      pid: '4-3',
      sort: '2',
      id: '4-3-2',
      type: '功能按钮',
      level: null,
      name: '新增子节点',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:add-child'
    },
    {
      pid: '4-3',
      sort: '3',
      id: '4-3-3',
      type: '功能按钮',
      level: null,
      name: '编辑',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:edit'
    },
    {
      pid: '4-3',
      sort: '4',
      id: '4-3-4',
      type: '功能按钮',
      level: null,
      name: '删除',
      path: null,
      icon: '',
      checked: false,
      code: 'auth-menu:delete'
    },
  ]
}

app.get('/open-self-admin/authRolePageNavAndAuthSomeRole', function (req, res) {
  setTimeout(() => {
    res.json(appNavAndAuthListSomeRole);
  }, 800);
});
