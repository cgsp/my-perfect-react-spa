const clearCookies = () => {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;)
      document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/"
  }

}

export { clearCookies }
