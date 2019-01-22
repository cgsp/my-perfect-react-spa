export const myJudgeIsWeChat = () => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') > -1) {
    return true
  } else {
    return false
  }
}
