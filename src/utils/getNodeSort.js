const getNodeSort = (pid, arr, type) => {
  let sort = 0
  for (let i = 0; i < arr.length; i++) {
    if (pid === arr[i].pid) {
      sort += 1
    }
  }
  if (type === '编辑') {
    return sort
  }
  else {
    return sort + 1
  }

}

export { getNodeSort }
