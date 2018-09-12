// export const requestBaseURLMap = {
//     test: 'http://cms.test.9nali.com/openapi-admin/',
//     production: 'http://cms.9nali.com/openapi-admin/'
// }

// export const appStatus = {
//   0: '全部',
//   1: '开发中',
//   2: '审核中',
//   3: '已上线',
//   4: '审核未通过',
//   5: '停用'
// }

// // 智能硬件设备类型
// export const hardwareDeviceType = {
//   0: '其他',
//   1: '儿童机器人',
//   2: '儿童故事机',
//   3: '儿童手表',
//   4: '智能音箱',
//   5: '白色家电',
//   6: '智能穿戴',
//   7: '车机硬件'
// }

// // 智能硬件固件类型
// export const hardwareFirmwareType = {
//   1: 'Android',
//   2: 'Linux',
//   3: 'Ios',
//   4: 'RTOS'
// }

// // 服务端接入和付费分销的状态
// export const serviceAndDistributionStatus = {
//   0: '未接入',
//   1: '审核中',
//   2: '已接入',
//   3: '审核未通过'
// }

// // 智能硬件设备
// export const hardwareDeviceStatus = {
//   0: '已激活',
//   1: '设备激活过期'
// }
// 整个项目的配置文件

const ROUTE_BASE = {
  dev: '',
  pro: 'openapi-content-admin-app'
}

const BASEURL = {
  dev: '/openapi-content-admin-app',
  pro: 'http://cms.test.9nali.com/openapi-content-admin-app',
}

const DOWN_LOAD_URL = {
  dev: 'http://cms.test.9nali.com/openapi-content-admin-app',
  pro: 'http://cms.test.9nali.com/openapi-content-admin-app',
}

const UP_IMG_ACTION = {
  dev: '/openapi-content-admin-app/upload/cover',
  // 生产的必须加上http或者https
  pro: 'http://cms.test.9nali.com/openapi-content-admin-app/upload/cover',
}

// 焦点图上传
const UP_FOCUS_IMG_ACTION = {
  dev: '/openapi-content-admin-app/upload/pic',
  // 生产的必须加上http或者https
  pro: 'http://cms.test.9nali.com/openapi-content-admin-app/upload/pic',
}

// 专辑和声音的跳转地址
const SONG_URL = {
  dev: {
    album: 'http://test.ximalaya.com/album',
    track: 'http://test.ximalaya.com/track'
  },
  pro: {
    album: 'http://ximalaya.com/album',
    track: 'http://ximalaya.com/track'
  },
}

const ERR_OK = 0

export { BASEURL, ROUTE_BASE, ERR_OK, DOWN_LOAD_URL, UP_IMG_ACTION, SONG_URL, UP_FOCUS_IMG_ACTION }
