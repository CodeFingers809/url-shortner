const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
  url:{
    type:String,
    required:true
  },
  // channelUrl:{
  //   type:String,
  //   required:true
  // },
  author:{
    type:String,
    required:true
  },
  expireAt:{
    type:Date,
    default:null
  }
},{timestamps: true})

urlSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

module.exports=mongoose.model("url",urlSchema,"urls")