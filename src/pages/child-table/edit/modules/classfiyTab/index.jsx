import React, { Component } from 'react'
import { Form, Input, Select, Button, Modal, message } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'
import { getMaxLineId } from '@Utils/getMaxLineId'

const Confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option

class ModuleClassfiyTab extends Component {
  static propTypes = {
    deleteModule: PropTypes.func,
    history: PropTypes.object
  }

  constructor(props) {
    super(props)
    
    this.state = {
      lines: [
        {
          lineId: 'line-1',
          displayName: undefined,
          resourceType: undefined,
          resourceId: undefined
        }
      ]
    }
  }

  addCategories = () => {
    const that = this
    Confirm({
      title: '确定添加吗？',
      content: '',
      onOk() {
        that.setState({}, () => {
          let oldLines = that.state.lines.slice()
          const max = getMaxLineId(oldLines)
          oldLines.unshift(
            {
              lineId: `line-${max + 1}`,
              displayName: undefined,
              resourceType: undefined,
              resourceId: undefined
            }
          )
          that.setState({
            lines: oldLines
          })
        })
      }
    })
  }

  deleteLine = (lineId) => {
    const that = this
    Confirm({
      title: '确定删除该分类吗？',
      content: '',
      onOk() {
        that.setState({}, () => {
          let oldLines = that.state.lines.slice()
          let deleteIndex
          oldLines.forEach((item, index) => {
            if (item.lineId === lineId) {
              deleteIndex = index
            }
          })
          oldLines.splice(deleteIndex, 1)
          that.setState({
            lines: oldLines
          })
        })
      }
    })
  }
  up = (lineId, index) => {
    const that = this
    if (index === 0) {
      message.error('已经处于最上面了')
      return
    }
    that.setState({}, () => {
      let lines = this.state.lines.slice()
      let upLine = lines[index - 1]
      let downLine = lines[index]
      const tempId = upLine.lineId
      upLine.lineId = downLine.lineId
      downLine.lineId = tempId
      that.setState({
        lines
      })
    })
  }

  down = (lineId, index) => {
    const that = this
    that.setState({}, () => {
      let lines = this.state.lines.slice()
      if (index === (lines.length - 1)) {
        message.error('已经处于最下面了')
        return
      }
      let upLine = lines[index]
      let downLine = lines[index + 1]
      const tempId = upLine.lineId
      upLine.lineId = downLine.lineId
      downLine.lineId = tempId
      that.setState({
        lines
      })
    })
  }

  render() {
    // 获取小分类的顺序
    let categoriesOrder = []
    this.state.lines.forEach(item => {
      categoriesOrder.push(item.lineId)
    })
    categoriesOrder = categoriesOrder.join()
    const getFieldDecorator = this.props.getFieldDecorator
    const { taskId, content
    } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    // console.log(moduleSymbol)
    return (
      <div className="classfiy-tab-module">
        <div className="module-title">
          <span className="text">分类Tab</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <div className="add-categories">
            <Button type="primary" onClick={this.addCategories}>添加分类</Button>
          </div>
          {
            this.state.lines.map((item, index) => {
              return (
                <div className="categories-line" key={item.lineId}>
                  <div className="item">
                    <FormItem
                    >
                      {
                        getFieldDecorator(`${moduleSymbol}~categories-${item.lineId}~displayName`, {
                          initialValue: undefined,
                          rules: [
                            {
                              required: true,
                              message: '请输入分类名',
                            },
                            {
                              max: 10,
                              message: '分类名应该小于10个字符',
                            }
                          ]
                        })(
                          <Input placeholder="请输入分类名" onPressEnter={e => e.preventDefault()} />
                        )
                      }
                    </FormItem>
                  </div>
                  <div className="item">
                    <FormItem
                    >
                      {getFieldDecorator(`${moduleSymbol}~categories-${item.lineId}~resourceType`, {
                        initialValue: undefined,
                        rules: [
                          {
                            required: true, message: '请选择内容类型',
                          }
                        ],
                      })(
                        <Select
                          allowClear
                          placeholder="请选择内容类型"
                          getPopupContainer={trigger => trigger.parentNode}
                        >
                          <Option value={6}>分类</Option>
                          <Option value={3}>听单</Option>
                          <Option value={8}>自运营标签</Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                  <div className="item">
                    <FormItem
                    >
                      {
                        getFieldDecorator(`${moduleSymbol}~categories-${item.lineId}~resourceId`, {
                          initialValue: undefined,
                          rules: [
                            {
                              required: true,
                              message: '请输入内容Id',
                            }
                          ]
                        })(
                          <Input placeholder="请输入内容Id" type="number" onPressEnter={e => e.preventDefault()} />
                        )
                      }
                    </FormItem>
                  </div>
                  <Button className="btn" type="primary" onClick={() => this.up(item.lineId, index)}>上移</Button>
                  <Button className="btn" type="danger" onClick={() => this.down(item.lineId, index)}>下移</Button>
                  <img className="delete" src={DeleteIcon} alt="delete" onClick={() => this.deleteLine(item.lineId)} />
                </div>
              )
            })
          }
          <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
            <FormItem
              label="categoriesOrder"
            >
              {getFieldDecorator(`${moduleSymbol}~categories-line-order`, {
                initialValue: categoriesOrder
              })(
                <Input placeholder="小分类的顺序" onPressEnter={e => e.preventDefault()} />
              )}
            </FormItem>
          </div>
        </div>
      </div>

    )
  }
}

export default ModuleClassfiyTab


