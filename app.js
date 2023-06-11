require("dotenv").config()
const express = require('express')
const app = express()
const router = require('./routes')
const PORT = process.env.PORT
const env = process.env.NODE_ENV


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(router)
// app.listen(PORT,() => {
//     console.log("Running on port 3000")
// })

if (env !== "test") {
    app.listen(PORT, () => {
      console.log("App running on port: ", PORT);
    })
}
  
module.exports = app