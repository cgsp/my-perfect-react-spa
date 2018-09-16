export const getModulesItemValue = (obj, taskIds, tasks) => {
  let modules = []
  const keys = Object.keys(obj)
  // console.log(tasks)
  taskIds.forEach((taskId, index) => {
    let valueItem = {}
    let orderNumAdd = false
    keys.forEach(key => {
      if (key.indexOf('task-') > -1) {
        const keyTaskId = key.split('~')[0]
        // const content = key.split('~')[1]
        const modulekey = key.split('~')[2]
        if (taskId === keyTaskId) {
          valueItem[modulekey] = obj[key]
          orderNumAdd = true
        }
      }
    })
    if (orderNumAdd) {
      const valueItemKeys = Object.keys(valueItem)
      valueItem.context = {}
      valueItemKeys.forEach(item => {
        if (item.indexOf('context') > -1) {
          valueItem.context[item.split('-')[1]] = valueItem[item]
          delete valueItem[item]
        }
      })
      if (Object.keys(valueItem.context).length === 0) {
        delete valueItem.context
      } else {
        valueItem.context = JSON.stringify(valueItem.context)
      }
      modules.push({ ...valueItem, orderNum: index })
    } else {
      if (tasks[taskId].content === 'ModuleTipApp') {
        modules.push({ ...{ moduleType: 11 }, orderNum: index })
      }
      if (tasks[taskId].content === 'ModuleSearchCondition') {
        modules.push({ ...{ moduleType: 12 }, orderNum: index })
      }
    }
  })

  return modules
}
