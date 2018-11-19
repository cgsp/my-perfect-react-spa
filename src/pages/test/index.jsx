import React, { Component } from 'react'
import TestContainer from './test'

export default class Test extends Component {
  static gsp() {
    console.log(this.props)
    console.log(this.state)
    return 'gsp'
  }

  static displayName = 'test'

  constructor(props) {
    super(props)
    console.log(super.displayName)
    this.state = {
      data: 100
    }
  }

  componentDidMount() {
    // this.gsp()
    // console.log(displayName)
    // console.log(gsp)
  }


  staticGsp() {
    console.log(this.staticGsp)
  }

  render() {
    const { data } = this.state
    return (
      <div>
        <TestContainer
          data={data}
        />
      </div>
    )
  }
}

console.log(Test.displayName)
console.log(Test.gsp())
