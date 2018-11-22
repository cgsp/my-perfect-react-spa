/*
 * @Author: John.Guan 
 * @Date: 2018-11-22 11:36:22 
 * @Last Modified by: John.Guan
 * @Last Modified time: 2018-11-22 15:53:34
 */
import React, { Component } from 'react'
import LazyLoad from 'react-lazyLoad'
// import TestContainer from './test'
import style from './style'
// import { Button } from 'antd'
// import { myDataType } from '@Utils/my-data-type'
import ImgPlaceHolder from '@Components/img-placeHolder'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 100
    }
  }

  // componentDidMount() {
  //   console.log(window.devicePixelRatio)
  //   console.log(myDataType(1))
  // }

  render() {
    return (
      <div className={style['test']}>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />}>
          <img src="http://ww3.sinaimg.cn/mw690/62aad664jw1f2nxvya0u2j20u01hc16p.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />} >
          <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxvyo52qj20u01hcqeq.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />} >
          <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxvz2cj6j20u01hck1o.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />}>
          <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxvzfjv6j20u01hc496.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />}>
          <img src="http://ww1.sinaimg.cn/mw690/62aad664jw1f2nxw0e1mlj20u01hcgvs.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />}>
          <img src="http://ww4.sinaimg.cn/mw690/62aad664jw1f2nxw0p95dj20u01hc7d8.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />}>
          <img src="http://ww2.sinaimg.cn/mw690/62aad664jw1f2nxw134xqj20u01hcqjg.jpg" />
        </LazyLoad>
        <LazyLoad throttle={200} placeholder={<ImgPlaceHolder />}>
          <img src="1111" />
        </LazyLoad>
      </div>
    )
  }
}
