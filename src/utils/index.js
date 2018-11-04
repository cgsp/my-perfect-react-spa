export function getUuid() {
  return ((Math.random() * 1e8) | 0) + Date.now()
}

export function timestampToTime(timestamp) {
  // TODO: 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  if (timestamp) {
    let date = new Date(timestamp)
    let Y, M, D, h, m, s
    Y = date.getFullYear() + '-'
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    h = date.getHours() + ':'
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    return Y + M + D + h + m + s
  }
}

export function timestampToZeroTime(timestamp) {
  // TODO: 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  if (timestamp) {
    let date = new Date(timestamp)
    let Y, M, D
    Y = date.getFullYear() + '-'
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    return Y + M + D
  }
}

export function numFormat(num) {
  if (num) {
    num = num + ''
    var res = num.toString().replace(/\d+/, function (n) {
      return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
        return $1 + ","
      })
    })
    return res
  }
}

export function getQsByName(name, url) {
  if (!url) url = window.location.href
  // eslint-disable-next-line
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function getCategoryId(categoryArr) {
  let catagoryIdArr = []
  categoryArr && categoryArr.length > 0 && categoryArr.map((item, index) => {
    catagoryIdArr.push(item.id)
  })
  return catagoryIdArr
}

export function formatAddress(address) {
  address.forEach(p => {
    p.value = p.id
    p.label = p.name
    p.children.forEach(c => {
      c.value = c.id
      c.label = c.name
      c.children = null
    })
  })
  return address
}
export function checkoutUrl(url) {
  url = url + ''
  if (url.indexOf("http") === 0) {
    return url
  } else {
    return 'http://' + url
  }
}


