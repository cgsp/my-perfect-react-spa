import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Test from './test'
// 引入搜索条件模块
import ModuleSearchCondition from '../modules/searchCondition'
// 引入普通模块
import ModuleCommon from '../modules/common'
// 引入分类Tab模块
import ModuleClassfiyTab from '../modules/classfiyTab'
// 引入优惠券模块
import ModuleDiscountCoupon from '../modules/discount-coupon'


const Container = styled.div`
  margin-bottom: 20px;
`

export default class Task extends Component {
  static propTypes = {
    task: PropTypes.object,
    deleteModule: PropTypes.func,
  }

  render() {
    // 判断是哪个模块
    const content = this.props.task.content
    let Module
    switch (content) {
      case 'ModuleSearchCondition':
        Module = ModuleSearchCondition
        break
      case 'ModuleCommon':
        Module = ModuleCommon
        break
      case 'ModuleClassfiyTab':
        Module = ModuleClassfiyTab
        break
      case 'ModuleDiscountCoupon':
        Module = ModuleDiscountCoupon
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
              <Module
                deleteModule={() => this.props.deleteModule(this.props.index)}
              />
            </Container>
          )
        }
      </Draggable>
    )
  }
}
