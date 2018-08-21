const getNodeSort = (pid, arr) => {
  let sort = 0
  for (let i = 0; i < arr.length; i++) {
    if (pid === arr[i].pid) {
      sort += 1
    }
  }
  return sort + 1
}

export { getNodeSort }
