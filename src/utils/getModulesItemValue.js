export const getModulesItemValue = (obj, taskIds) => {
  let modules = []
  const keys = Object.keys(obj)
  taskIds.forEach((taskId, index) => {
    let valueItem = {}
    keys.forEach(key => {
      if (key.indexOf('task-') > -1) {
        const keyTaskId = key.split('~')[0]
        const modulekey = key.split('~')[2]
        if (taskId === keyTaskId) {
          valueItem[modulekey] = obj[key]
        }
      }
    })
    modules.push({ ...valueItem, orderNum: index })
  })

  return modules
}
