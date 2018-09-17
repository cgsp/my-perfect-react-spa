import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from '../../line-drag/column'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option

class ModuleClassfiyTab extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      lineDragData: {
        lines: {
          'line-1': { lineId: 'line-1', content: '第1行' },
          'line-2': { lineId: 'line-2', content: '第2行' },
          'line-3': { lineId: 'line-3', content: '第3行' },
        },
        columns: {
          'column-1': {
            id: 'column-1',
            lineIds: ['line-1', 'line-2', 'line-3'],
          }
        },
        columnOrder: ['column-1']
      }
    }
  }

  // 拖拽
  onDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    this.setState({}, () => {
      const column = this.state.lineDragData.columns[source.droppableId]
      const newLineIds = Array.from(column.lineIds)
      newLineIds.splice(source.index, 1)
      newLineIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...column,
        lineIds: newLineIds
      }

      const newState = {
        ...this.state.lineDragData,
        columns: {
          ...this.state.lineDragData.columns,
          [newColumn.id]: newColumn,
        }
      }
      console.log(newState.columns['column-1']
        .lineIds)
      // console.log(newState)
      this.setState({
        lineDragData: newState
      })
    })
  }

  render() {
    const getFieldDecorator = this.props.getFieldDecorator
    const { taskId, content
    } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    // console.log(moduleSymbol)
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6, offset: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    const lineLength = this.state.lineDragData.columns['column-1'].lineIds.length
    return (
      <div className="classfiy-tab-module">
        <div className="module-title">
          <span className="text">分类Tab</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <div style={{ height: 50, marginBottom: 20, paddingLeft: 20, paddingTop: 20 }}>
            <Button type="primary">添加分类</Button>
          </div>
          {
            lineLength === 0 ?
              <div>请添加分类</div>
              :
              <DragDropContext
                onDragEnd={this.onDragEnd}
                className="right"
              >
                {
                  this.state.lineDragData.columnOrder.map(columnId => {
                    const column = this.state.lineDragData.columns[columnId]
                    const lines = column.lineIds.map(lineId => this.state.lineDragData.lines[lineId])
                    return (
                      <Column
                        key={column.id}
                        column={column}
                        lines={lines}
                      />
                    )
                  })
                }
              </DragDropContext>
          }
        </div>
      </div>
    )
  }
}

export default ModuleClassfiyTab


