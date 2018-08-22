import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Icon } from 'antd'
import './style.scss'

export default class SortList extends Component {
  static propTypes = {
    sortNameArr: PropTypes.array,
    clickSort: PropTypes.func,
  }

  static defaultProps = {
    sortNameArr: ['创建时间', '更新时间']
  }

  constructor() {
    super()
    this.setState({
      sort: '1-up'
    })
  }

  render() {
    return (
      <div className="sort-list">
        {
          this.props.sortNameArr.map((item, index) => {

            return (
              <div className="sort-item" key={index}>
                <span className="sort-name">{item}</span>
                <span className="sort-icon">
                  <Icon type="caret-up" />
                  <Icon type="caret-down" />
                </span>
              </div>
            )
          }

          )
        }
      </div>
    )
  }
}
