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
    this.state = {
      sortIndex: 1,
      sortDirection: 'down'
    }
  }

  handleClick(sortIndex, sortDirection) {
    this.setState({
      sortIndex,
      sortDirection,
    })
    this.props.clickSort(sortIndex, sortDirection)
  }

  render() {
    return (
      <div className="sort-list">
        {
          this.props.sortNameArr.map((item, index) => {

            return (
              <div className="sort-item" key={index} onClick={() => {
                let { sortIndex, sortDirection } = this.state
                if (sortIndex === index) {
                  if (sortDirection === 'down') {
                    sortDirection = 'up'
                  } else {
                    sortDirection = 'down'
                  }
                } else {
                  sortIndex = index
                  sortDirection = 'down'
                }
                this.setState({
                  sortIndex,
                  sortDirection
                })
                this.props.clickSort(sortIndex, sortDirection)
              }}>
                <span className={this.state.sortIndex === index ? 'sort-name active' : 'sort-name'}>{item}</span>
                <Icon className={this.state.sortIndex === index && this.state.sortDirection === 'up' ? 'sort-icon-up active' : 'sort-icon-up'} type="caret-up" />
                <Icon className={this.state.sortIndex === index && this.state.sortDirection === 'down' ? 'sort-icon-down active' : 'sort-icon-down'} type="caret-down" />
              </div>
            )
          }

          )
        }
      </div>
    )
  }
}
