import { myTrim } from './myTrim'

function myHuanHang(str) {
  let contentIds = myTrim(str).split('\n')
  let newstr = ''
  contentIds.forEach(element => {
    element = myTrim(element)
    newstr += (element + ',')
  })
  newstr = newstr.slice(0, -1)
  return newstr
}

export { myHuanHang }
