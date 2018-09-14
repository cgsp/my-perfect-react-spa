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
  }

  render() {
    return (
      <Container>
        <h3 className="content-title">{this.props.column.title}</h3>
        <Droppable droppableId={this.props.column.id}>
          {
            (provided) => (
              <TaskList
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.props.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
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
