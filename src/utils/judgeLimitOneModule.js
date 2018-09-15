export const judgeLimitOneModule = (name, tasks) => {
  // 搜索条件模块，分类Tab模块和提示下载App模块，最多只能有一个
  const values = Object.values(tasks)
  if (values.length === 0) {
    return false
  }
  if (name === 'ModuleTipApp' || name === 'ModuleSearchCondition' || name === 'ModuleClassfiyTab') {

    for (let index = 0; index < values.length; index++) {
      const element = values[index]
      // console.log(element.content)
      if (element.content === name) {
        return true
      }
    }
  }
  return false
}
