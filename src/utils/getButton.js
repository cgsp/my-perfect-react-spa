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

const hasThisButton = (path, buttonName, obj) => {
  return (obj[path].children.indexOf(buttonName) > -1)
}

export { handleAppButtons, hasThisButton }
