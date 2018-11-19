import React, { Component } from 'react'
import TestContainer from './test'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 100
    }
  }

  componentDidMount() {
    // console.log(this.staticGsp)
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

console.log(Test.staticGsp)
