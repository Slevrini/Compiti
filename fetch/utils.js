const fetch = require("node-fetch")

module.exports.homePage = (data) => {
    let str = ""
    data.forEach(e => {
        str +=`<h1>${e.id}. ${e.title}</h1><p>${e.body}</p><form method="get" action="/post/${e.id}"><button>Post</button></form>`
    })
    return str
}

module.exports.banana = async(post) => {
    let str = ""
    await fetch('https://jsonplaceholder.typicode.com/comments')
        .then(response => response.json())
        .then(json => {
            const comment=json.filter(e => e.postId === post.id)
            json.forEach(e => {
            str +=`<h5>User: ${e.email}</h5><p><strong>${e.name}</strong></p><p>${e.body}</p>`
            })
        })
        .catch(err => console.log(err))
        return str

}