const { origin } = window.location

const testEnvReg = /test\.ximalaya\.com/
const ENV = testEnvReg.test(origin) ? 'test' : 'production'

const TOKEN = ENV === 'test' ? '4&_token' : '1&_token'

function goLogin(redirectUrl = window.location.href) {
  return new Promise((resolve, reject) => {
    const xmDomainReg = /\.ximalaya\.com/
    // 判断重定向地址是否为喜马拉雅domain（防止无限跳转）
    if (xmDomainReg.test(redirectUrl)) {
      window.location.href = redirectUrl
      resolve()
    } else {
      console.warn('domain 应该为ximalaya.com')
      reject('domain 应该为ximalaya.com')
    }
  })
}

export { ENV, TOKEN, goLogin }
