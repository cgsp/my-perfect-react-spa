import React, { Component } from 'react'

class Index extends Component {
  render() {
    var a = '12'
    console.log(a.padStart(2, '0'))
    console.log(a)
    return (
      <div>首页</div>
    )
  }
}
export default Index
