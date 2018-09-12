import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Button } from 'antd'
import { mySessionStorageGet, mySessionStorageSet } from '@Utils/myStorages'
import './style.scss'

class ChildTableEdit extends Component {
  static propTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props)
    let originData
    if (this.props.location.query) {
      originData = this.props.location.query.data
      mySessionStorageSet('indexToEditData', originData)
    } else {
      originData = mySessionStorageGet('indexToEditData')
    }
    this.state = {
      originData,
    }
    console.log(originData)
  }

  goBack = () => {
    this.props.history.push({
      pathname: '/child-table',
    })
  }

  render() {
    return (
      <div className="child-table-edit">
        <div className="title">
          <div className="text">子站管理/</div>
          <div className="function">编辑子站</div>
          <div className="back">
            <Button type="primary" onClick={this.goBack}>返回</Button>
          </div>
        </div>

      </div>
    )
  }
}

export default ChildTableEdit
