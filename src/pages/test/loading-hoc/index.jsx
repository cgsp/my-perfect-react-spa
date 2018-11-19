import React, { Component } from 'react'
// import { PropTypes } from 'prop-types'

export default function LoadingHoc(Comp) {
  return class extends Component {
    callName() {
      return '装饰器自身callname'
    }

    // getWrappedInstance = () => {
    //   if (this.props.withRef) {
    //     return this.wrappedInstance
    //   }
    // }

    // setWrappedInstance = (ref) => {
    //   this.wrappedInstance = ref
    //   // console.log(ref)
    // }

    render() {
      console.log('装饰器自身打印', this.props)
      if (!this.props.data) {
        return (
          <div>加载中...</div>
        )
      }

      return (
        <div>
          <Comp {...this.props} />
        </div>
      )
    }
  }
}
