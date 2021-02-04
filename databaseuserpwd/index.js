const express=require("express")
const app= new express()
app.use(require("body-parser").json())

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255))");

  var stmt = db.prepare("INSERT INTO users VALUES (?,?)");
  for (var i = 0; i < 10; i++) {
      stmt.run(`User${i}`, `User${i}`);
  }
  stmt.finalize();

});

app.post("/login",(req,res)=>{
    const body = req.body
    const user = body.username
    const pwd = body.pwd

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [user, pwd], (err, row) => {
        if (row) {
          res.status(200).json({ ok: true })
        } else {
          res.status(401).json({ ok: false })
        }
      })
})



const port= 8080
app.listen(port,()=>console.log("listening"))