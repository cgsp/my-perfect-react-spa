import React, { Component } from 'react'
import AppLayout from './AppLayout'
import AddOn from './AddOn'

export default class Test extends Component {
  state = {};

  render() {
    return (
      <AppLayout>
        <AddOn slot="header">
          <h1>这里可能是一个页面标题</h1>
        </AddOn>
        <AddOn>
          <p>主要内容的一个段落。</p>
          <p>另一个段落。</p>
        </AddOn>
        <AddOn slot="footer">
          <p>这里有一些联系信息</p>
        </AddOn>
      </AppLayout>
    )
  }
}
