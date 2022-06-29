require("dotenv").config({path:"./.env"})
const express = require("express")

const app = express()

app.set("view","ejs")

app.get("/", (req,res)=>{
  res.send("hello")
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.listen(process.env.PORT, ()=>{
  console.log("running")
})