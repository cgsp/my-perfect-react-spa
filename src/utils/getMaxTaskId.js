export const getMaxTaskId = (tasks) => {
  const keys = Object.keys(tasks)
  if (keys.length === 0) {
    return 0
  }
  let arr = []
  keys.forEach(item => {
    arr.push(item.split('-')[1] - 0)
  })
  const max = Math.max.apply(null, arr)
  return max
}
