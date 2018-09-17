import { isRepeatArr } from '@Utils/isRepeatArr'

export const geCategoriesItemValue = (obj) => {
  let categories
  let orderArr
  const keys = Object.keys(obj)
  for (let index = 0; index < keys.length; index++) {
    const element = keys[index]
    if (element.indexOf('categories-line-order') > -1) {
      orderArr = obj[element]
      break
    }
  }

  if (orderArr === undefined) {
    return {
      categories: [],
      nameValid: true,
      idValid: true
    }
  }
  // 如果有分类的数据
  let newObj = {}
  let tempArr = []
  if (orderArr && orderArr.length > 0) {
    let lineIdArr = orderArr.split(',')
    lineIdArr.forEach((lineId, index) => {
      newObj[lineId] = {
        orderNum: index
      }
      keys.forEach(key => {
        if (key.indexOf(`categories-${lineId}`) > -1) {
          const tempKey = key.split('~')[3]
          newObj[lineId][tempKey] = obj[key]
        }
      })
      tempArr.push(newObj[lineId])
    })
  }

  // 名称的话，只要是重复就是不合法的
  // id的话，如果同样的资源，同样的ID，就是不合法的
  let nameArr = []
  let idArr = []
  let nameValid = true
  let idValid = true
  tempArr.forEach(item => {
    nameArr.push(item.displayName)
    idArr.push(`${item.resourceId}-${item.resourceType}`)
  })
  if (isRepeatArr(nameArr)) {
    nameValid = false
  }
  if (isRepeatArr(idArr)) {
    idValid = false
  }

  console.log(idValid)

  return {
    categories: tempArr,
    nameValid,
    idValid
  }
}
