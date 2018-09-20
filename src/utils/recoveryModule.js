const transNumToModule = (num) => {
  let content
  switch (num) {
    case 16:
      content = 'ModuleValueWelfare'
      break
    case 15:
      content = 'ModuleMemberHas'
      break
    case 13:
      content = 'ModuleDiscountCoupon'
      break
    case 14:
      content = 'ModuleMemberGet'
      break
    case 11:
      content = 'ModuleTipApp'
      break
    case 12:
      content = 'ModuleSearchCondition'
      break
    case 1:
      content = 'ModuleClassfiyTab'
      break
    case 2:
      content = 'ModuleFocus'
      break
    default:
      content = 'ModuleCommon'
      break
  }
  return content
}

export const recoveryModule = (modules) => {
  let dragData = {
    tasks: {},
    columns: {
      'column-1': {
        id: 'column-1',
        title: '模块设置',
        taskIds: [],
      }
    },
    columnOrder: ['column-1']
  }

  modules.forEach((module, index) => {
    dragData.tasks[`task-${module.orderNum + 1}`] = {
      taskId: `task-${module.orderNum + 1}`,
      content: transNumToModule(module.moduleType),
      moduleValue: module
    }
    dragData.columns['column-1'].taskIds.push(`task-${module.orderNum + 1}`)
  })

  return dragData
}
