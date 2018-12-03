import React, { Component } from 'react'

class Index extends Component {
  render() {
    const arr = [[1, 2]].map(([a, b], index) => {
      console.log(index)
      return a + b
    })
    console.log(arr)
    return (
      <div>首页</div>
    )
  }
}
export default Index
