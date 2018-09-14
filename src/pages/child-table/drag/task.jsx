import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Test from './test'
// 引入搜索条件模块
import ModuleSearchCondition from '../modules/searchCondition'

const Container = styled.div`
  margin-bottom: 20px;
`

export default class Task extends Component {
  static propTypes = {
    task: PropTypes.object
  }

  render() {
    // 判断是哪个模块
    const content = this.props.task.content
    let Module
    switch (content) {
      case 'ModuleSearchCondition':
        Module = ModuleSearchCondition
        break
      default:
        Module = Test
        break
    }
    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
      >
        {
          (provided) => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              innerRef={provided.innerRef}
            >
              <Module />
            </Container>
          )
        }
      </Draggable>
    )
  }
}
