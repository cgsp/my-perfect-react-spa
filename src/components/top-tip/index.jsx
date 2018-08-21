/* eslint-disable */
import React, { Component } from 'react'
import { Alert } from 'antd'
import './style.scss'

const TopTip = ({ item }) => {
  return (
    <div className="app-top-tip">
      {
        item.show
          ?
          <Alert message={item.msg} type={item.type} showIcon style={{ width: 300 }} />
          : null
      }
    </div>
  )
}

export default TopTip
/* eslint-enable */
