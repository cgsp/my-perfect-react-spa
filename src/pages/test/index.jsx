import React, { Component } from 'react'
import TestContainer from './test'

export default class Test extends Component {
  render() {
    return (
      <TestContainer data={100} {...this.props} />
    )
  }
}
