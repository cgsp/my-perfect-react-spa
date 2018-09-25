import { mySessionStorageGet } from '@Utils/myStorages'

// 对初始的按钮进行处理
const handleAppButtons = (arr) => {
  let newObj = {}
  arr.forEach(ele => {
    const path = ele.code.split(':')[0]
    // const buttonCode = ele.code.split(':')[1]
    const buttonName = ele.name
    if (!newObj[path]) {
      newObj[path] = {
        path,
        children: [buttonName]
      }
    } else {
      newObj[path].children.push(buttonName)
    }
  })
  return newObj
}

// 判断按钮是否存在
const hasThisButton = (path, buttonName) => {
  const obj = mySessionStorageGet('app-button-list', {})
  if (!obj[path]) {
    return false
  }
  return (obj[path].children.indexOf(buttonName) > -1)
}

export { handleAppButtons, hasThisButton }
