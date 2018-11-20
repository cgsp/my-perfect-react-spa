import React, { Component } from 'react'
import TestContainer from './test'
import { myJudgeDeviceAndBrowserFromBrowserJs } from '@Utils/my-judge-device-and-browser-from-browser-library'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 100
    }
  }

  componentDidMount() {
    console.log(myJudgeDeviceAndBrowserFromBrowserJs())
  }


  render() {
    const { data } = this.state
    return (
      <div className="div2" id="gFather">
        <div className="div1" id="father">
          <TestContainer
            data={data}
            className="div1"
          />
        </div>
      </div>
    )
  }
}
