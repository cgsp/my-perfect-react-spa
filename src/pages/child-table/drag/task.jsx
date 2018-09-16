import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
// 引入搜索条件模块
import ModuleSearchCondition from '../modules/searchCondition'
// 引入普通模块
import ModuleCommon from '../modules/common'
// 引入分类Tab模块
import ModuleClassfiyTab from '../modules/classfiyTab'
// 引入优惠券模块
import ModuleDiscountCoupon from '../modules/discount-coupon'
// 引入超值福利模块
import ModuleValueWelfare from '../modules/value-welfare'
// 引入会员领取模块
import ModuleMemberGet from '../modules/member-get'
// 引入会员专享模块
import ModuleMemberHas from '../modules/member-has'
// 引入提示下载app模块
import ModuleTipApp from '../modules/tip-app'

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
      case 'ModuleValueWelfare':
        Module = ModuleValueWelfare
        break
      case 'ModuleMemberGet':
        Module = ModuleMemberGet
        break
      case 'ModuleMemberHas':
        Module = ModuleMemberHas
        break
      case 'ModuleTipApp':
        Module = ModuleTipApp
        break
      default:
        break
    }
    return (
      <Draggable
        draggableId={this.props.task.taskId}
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
              <Module
                deleteModule={() => this.props.deleteModule(this.props.task.taskId)}
                task={this.props.task}
                getFieldDecorator={this.props.getFieldDecorator}
              />
            </Container>
          )
        }
      </Draggable>
    )
  }
}
