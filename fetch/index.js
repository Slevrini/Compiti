const express = require("express")
const app = new express()
const fetch = require("node-fetch")
const {homePage, banana} = require("./utils")

const port = 8080

app.get("/", (req, res) => {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => res.send(homePage(json)))
        .catch(err => console.log(err))
})

app.get("/post/:id", (req, res) => {
    const id= req.params.id
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(response => response.json())
        .then(async json => res.send(await banana(json)))
        .catch(err => console.log(err))
})


app.listen(port, () => {
    console.log("Listening on port 8080")
})