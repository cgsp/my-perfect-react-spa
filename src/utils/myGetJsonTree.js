var myGetJsonTree = function (plainArr, pid) {
  var jsonTree = []
  for (var i = 0; i < plainArr.length; i++) {
    var node = plainArr[i]
    // plainArr.splice(i, 1)
    if (node.pid === pid) {
      var newNode = {
        id: node.id,
        name: node.name,
        code: node.code,
        children: myGetJsonTree(plainArr, node.id)
      }
      jsonTree.push(newNode)
    }
  }
  return jsonTree
}

export { myGetJsonTree }
