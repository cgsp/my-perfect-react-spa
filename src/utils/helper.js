const { origin } = window.location

const testEnvReg = /test/

const ENV = testEnvReg.test(origin) ? 'test' : 'production'

export { ENV }
