import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

@connect(
  state => state.navBarReducer,
  {}
)
class NoContent extends Component {
  static propTypes = {
    appNavListData: PropTypes.array,
    history: PropTypes.object
  }

  shouldComponentUpdate(nextProps, nextStates) {
    if (nextProps.appNavListData.length) {
      this.props.history.push('/main-album')
    }
    return true
  }

  render() {
    return (
      <div>页面正在加载中。。。。。。</div>
    )
  }
}

export default NoContent
