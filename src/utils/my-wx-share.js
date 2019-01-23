/* 
 * @Desc: 微信自定义分享
    微信自定义分享基本步骤:
      1.需要有一个认证过的微信公众号;
      2.在公众号后台配置"js安全接口域名";
      3.公众号对应的服务端,有做config权限验证,并提供给你一个获取签名的接口可以调用(去获取appId,timestamp,nonceStr,signature);
      4.在入口html页面引入微信SDK: <script src="//res.wx.qq.com/open/js/jweixin-1.4.0.js"></script> ;
      5.剩余即是调用获取签名接口,获取到签名参数,调用微信SDK的接口去做对应配置;

    微信JS-SDK文档地址(往下翻找到分享接口): 
      https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115 

 * @Author: John.Guan 
 * @Date: 2018-11-24 02:07:35 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2019-01-23 20:01:57
 */

import { isProd } from 'utils'
import axios from 'axios'

class myWxShare {
  constructor(params, config) {
    // 微信SDK权限验证接口,需要的参数.
    this.shareParams = {
      ...{
        url: `//m.ximalaya.com/x-thirdparty-web/weixinJssdk/config`,// 生产环境地址
        urlTest: `//m.test.ximalaya.com/x-thirdparty-web/weixinJssdk/config`,// 测试环境地址
        thirdpartyId: null,// 接入时分配的thirdpartyId (公司公众号后台同学沟通拿到,开放平台open.ximalaya.com配置了一个21的可以使用)
        signatureUrl: window.location.href,// 当前页面url,需要encode
      }, ...params
    }

    // 自定义分享参数
    this.shareConfig = {
      ...{
        title: '',// 分享卡片的title
        desc: '',// 分享卡片的描述
        link: window.location.href,// 地址
        imgUrl: null,// 分享卡片的头图
      }, ...config
    }
  }

  /**
   * 调用获取签名接口 - 注入权限验证配置 - 配置自定义分享参数
   */
  init() {
    const wx = window.wx

    // 如果未引入微信SDK,中止.
    if (!wx) return

    /**
     * 调用统一接口,获取签名,获取调用微信接口需要的参数.
     */
    this.getConfig().then(response => {
      const res = response.data

      if (!res || !res.appId || !res.signature) return

      // 需从接口获取以下签名参数
      const { appId, nonceStr, signature, timestamp } = res
      const { shareConfig } = this

      /**
       * config接口,注入权限验证配置.
       */
      wx.config({
        debug: false,// 是否开启调试模式,调用的所有api的返回值会在客户端alert出来
        appId,// 必填，公众号的唯一标识
        timestamp,// 必填，生成签名的时间戳
        nonceStr,// 必填，生成签名的随机串
        signature,// 必填，签名
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'chooseImage',
          'uploadImage',
          'downloadImage'
        ],// 必填，需要使用的JS接口列表
      })

      /**
       * ready接口,处理成功验证.
       */
      wx.ready(function () {
        // “分享给朋友”及“分享到QQ” - (似乎未生效)
        wx.updateAppMessageShareData(shareConfig)
        // “分享到朋友圈”及“分享到QQ空间” - (似乎未生效)
        wx.updateTimelineShareData(shareConfig)
        // “分享到腾讯微博”
        wx.onMenuShareWeibo(shareConfig)

        // “分享给朋友” - 即将废弃
        wx.onMenuShareAppMessage(shareConfig)
        // “分享到朋友圈” - 即将废弃
        wx.onMenuShareTimeline(shareConfig)
        // “分享到QQ” - 即将废弃
        wx.onMenuShareQQ(shareConfig)
      })

      /**
       * error接口,处理失败验证.
       */
      wx.error(function (res) {
        // To-Do
        console.log(res, 'wx.error...')
      })
    })
  }

  /**
   * 获取签名,后续调用微信接口需要使用.
   * (不要加 withCredentials: true !! 因这个接口的接口端已做了处理.)
   */
  getConfig() {
    //  生产环境/非生产环境使用不同接口(公司内部策略)
    const url = isProd ? this.shareParams.url : this.shareParams.urlTest
    const { thirdpartyId, signatureUrl } = this.shareParams

    /**
     * 获取签名:
     *  1.urlTest测试环境接口对全部开启了跨域;
     *  2.url生产环境接口,对*.ximalaya.com开启了跨域,除此之外会产生跨域问题;
     */
    return axios.get(url, {
      params: {
        thirdpartyId,
        signatureUrl,
      },
      withCredentials: false, // 这个接口不可写true
    })
  }
}

export default myWxShare

// 如何使用
/**
 * 微信分享,修改分享卡片的图片、标题、描述等.
 * @param {Object} 获取签名需要的参数
 * @param {Object} 自定义分享的title、描述、头图链接等.
 */
// import Img_Share from 'assets/images/wx_share.png'
// const wxShare = new WxShare({
//   thirdpartyId: isProd ? 21 : 31, // 测试用31,生产使用自己真正的id(如这里是21) - 公司内部策略
// }, {
//   title: '喜马拉雅123狂欢节一起嗨，品牌联袂送贺礼',  // 分享卡片的title
//   desc: '饿了么、星巴克、肯德基...无门槛神券免费领',  // 分享卡片的描述
//   imgUrl: `https:${Img_Share}`,  // 分享卡片的头图(需要有协议头!! import导入的是//打头)
// })
// wxShare.init()
