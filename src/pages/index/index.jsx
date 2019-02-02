import React, { Component } from 'react'
import Test from '../test'


const FnComponent = () => {
  return (
    <div>我是个无状态组件</div>
  )
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.myInputRef1 = React.createRef()
    this.myInputRef2 = React.createRef()
  }
  componentDidMount = () => {
    this.myInputRef1.current.value = '1'
    this.myInputRef2.current.value = '22222'
  }

  render() {
    return [
      <div ref="strref" key="1">1</div>,
      <input type="text" ref={this.myInputRef1} key="input1" />,
      <input type="text" ref={this.myInputRef2} key="input2" />,
      <Test ref="test" key="2" />,
      <FnComponent key="3" />
    ]
  }
}
export default Index
