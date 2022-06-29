const mongoose = require("mongoose")

module.exports = mongoose.connect(process.env.DATABASE_URL, ()=>{
  console.log("Connected to database")
})