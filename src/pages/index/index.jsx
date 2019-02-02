import React, { Component } from 'react'
// import Test from '../test'

const FnComponent = React.forwardRef((props, ref) => {
  return (
    <input type="text" ref={ref} />
  )
})

class Index extends Component {
  constructor(props) {
    super(props)
    this.myref = React.createRef()
  }
  componentDidMount = () => {
    this.myref.current.value = '哈哈哈哈'
  }

  render() {
    return [
      <FnComponent key="1" ref={this.myref} />
    ]
  }
}
export default Index
