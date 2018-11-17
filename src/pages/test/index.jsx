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
    setTimeout(() => {
      this.setState({
        data: 200
      })
    }, 1000)
  }

  render() {
    const { data } = this.state
    return (
      <div>
        <TestContainer data={data} {...this.props} />
      </div>
    )
  }
}
