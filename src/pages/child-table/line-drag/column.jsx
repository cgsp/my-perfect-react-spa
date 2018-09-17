import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Task from './task'

const Container = styled.div``

const TaskList = styled.div`
  padding: 8px;
`

export default class Column extends Component {
  static propTypes = {
    column: PropTypes.object,
    tasks: PropTypes.array,
    deleteModule: PropTypes.func
  }

  render() {
    return (
      <Container>
        <Droppable droppableId={this.props.column.id}>
          {
            (provided) => (
              <TaskList
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.props.lines.map((line, index) => (
                  <Task key={line.lineId} line={line} index={index} {...this.props} />
                ))}
                {provided.placeholder}
              </TaskList>
            )
          }
        </Droppable>
      </Container>
    )
  }
}
