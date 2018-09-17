import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${props => (props.isDragging ? '#3f8ef9' : '#ccc')};
  border-radius: 5px;
`

export default class Task extends Component {
  static propTypes = {
    task: PropTypes.object,
    deleteModule: PropTypes.func,
  }

  render() {
    return (
      <Draggable
        draggableId={this.props.line.lineId}
        index={this.props.index}
      >
        {
          (provided, snapshot) => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              innerRef={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              {this.props.line.content}
            </Container>
          )
        }
      </Draggable>
    )
  }
}
