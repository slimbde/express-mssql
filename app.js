const express = require("express")
const app = express()
const path = require("path")
const db = require("mssql/msnodesqlv8")

config = {
  user: "express-minin",
  password: "express",
  server: "(localdb)\\mssqllocaldb",
  database: "express-minin-db",
  driver: 'msnodesqlv8',
}


app.use(express.static(path.resolve(__dirname, "client")))
app.use(express.json()) //// to be able to reach req.body

const errorHandler = (error, res) => {
  res.statusCode = 500
  res.send(error.code)
}

app.get("/api/users", async (req, res) => {
  db.connect(config)
    .then(_ => db.query("SELECT * FROM Users"))
    .then(result => res.send(result.recordset))
    .catch(error => errorHandler(error, res))
})

app.post(`/api/users`, async (req, res) => {
  const contact = { ...req.body }

  db.connect(config)
    .then(_ => db.query(`INSERT INTO Users (UserName, UserValue) 
                          OUTPUT inserted.Id
                          VALUES ('${contact.name}', '${contact.value}')`))
    .then(result => {
      const newId = JSON.stringify(result.recordset[0].Id)
      res.send(newId) ///// as we use express.json() we got to stringify each response
    })
    .catch(error => errorHandler(error, res))
})

app.delete(`/api/users`, async (req, res) => {
  const contact = { ...req.body }

  db.connect(config)
    .then(_ => db.query(`DELETE FROM Users WHERE Id=${contact.Id}`))
    .then(result => res.send(result.recordset))
    .catch(error => errorHandler(error, res))
})

app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "index.html")))

app.listen(3000, () => console.log("Server has been started on http://localhost:3000 ..."))
