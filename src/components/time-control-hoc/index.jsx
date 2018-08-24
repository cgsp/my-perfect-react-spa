// 控制时间插件的hoc高阶组件
import React, { Component } from 'react'

export default function TimeControlHoc(Comp) {
  return class extends Component {
    constructor() {
      super()
      this.state = {
        searchCreateTimeBegin: null,
        searchCreateTimeEnd: null
      }
      this.disabledCreateBeginDate = this.disabledCreateBeginDate.bind(this)
      this.disabledCreateEndDate = this.disabledCreateEndDate.bind(this)
      this.onDateAndTimeChange = this.onDateAndTimeChange.bind(this)
      this.onCreateBeginTimeChange = this.onCreateBeginTimeChange.bind(this)
      this.onCreateEndTimeChange = this.onCreateEndTimeChange.bind(this)
    }

    // 控制时间插件的函数
    disabledCreateBeginDate = (searchCreateTimeBegin) => {
      const searchCreateTimeEnd = this.state.searchCreateTimeEnd
      if (!searchCreateTimeBegin || !searchCreateTimeEnd) {
        return false
      }
      return searchCreateTimeBegin.valueOf() > searchCreateTimeEnd.valueOf()
    }

    disabledCreateEndDate = (searchCreateTimeEnd) => {
      const searchCreateTimeBegin = this.state.searchCreateTimeBegin
      if (!searchCreateTimeEnd || !searchCreateTimeBegin) {
        return false
      }
      return searchCreateTimeEnd.valueOf() <= searchCreateTimeBegin.valueOf()
    }

    onDateAndTimeChange = (field, value) => {
      this.setState({
        [field]: value,
      })
    }

    onCreateBeginTimeChange = (value) => {
      console.log(value)
      this.onDateAndTimeChange('searchCreateTimeBegin', value)
    }

    onCreateEndTimeChange = (value) => {
      this.onDateAndTimeChange('searchCreateTimeEnd', value)
    }

    render() {
      return (
        <Comp
          state={this.state}
          {...this.props}
          disabledCreateBeginDate={this.disabledCreateBeginDate}
          disabledCreateEndDate={this.disabledCreateEndDate}
          onDateAndTimeChange={this.onDateAndTimeChange}
          onCreateBeginTimeChange={this.onCreateBeginTimeChange}
          onCreateEndTimeChange={this.onCreateEndTimeChange}
        />
      )
    }
  }
}
