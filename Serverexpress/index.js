const express = require('express');
const app = express();
const port = 3000;
 
const fs = require("fs")

app.use(express.static(__dirname + "/public"))

const html = fs.readFileSync("./public/index.html", "utf-8")


app.get('/', (req, res) => {
    res.send(html)
});

app.listen(port, () => console.log(`App listening to port ${port}`));


