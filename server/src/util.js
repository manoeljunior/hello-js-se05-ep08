exports.extractComments = function(result, user) {
  let comments = {}
  result.forEach(item => {
    if(user == item.name) {
      // comments.push({
      //   title: item.title, 
      //   body: item.body
      // })
      comments[item.title] = true
    } 
  })
  return comments
}