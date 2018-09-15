export const transNameToModule = (name) => {
  let content
  switch (name) {
    case '普通模块':
      content = 'ModuleCommon'
      break
    case '超值福利':
      content = 'ModuleValueWelfare'
      break
    case '会员专享':
      content = 'ModuleMemberHas'
      break
    case '优惠券':
      content = 'ModuleDiscountCoupon'
      break
    case '会员领取':
      content = 'ModuleMemberGet'
      break
    case '提示下载App':
      content = 'ModuleTipApp'
      break
    case '搜索条件':
      content = 'ModuleSearchCondition'
      break
    case '分类Tab':
      content = 'ModuleClassfiyTab'
      break
    default:
      break
  }
  return content
}
