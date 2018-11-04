import moment from 'moment'

const myGetStrTime = (timestamp) => {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const myGetStampTime = (str) => {
  return new Date(str).valueOf()
}

// 将时间对象转换为时间戳
const myTransTimeObjToStampTime = (date) => {
  if (date) {
    return myGetStampTime(date)
  }
  return date
}

export { myGetStrTime, myGetStampTime, myTransTimeObjToStampTime }
