exports.extractComments = function(result, user) {
  let comments = {}
  result.forEach(item => {
    if(user == item.name) {
      comments[item.title] = true
    } 
  })
  return comments
}