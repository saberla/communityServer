const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const LogRecordSchema = new Schema({
  userName:{
    type: String,
    required: true
  },
  role: {
      type: String
  },
  nowDate: {
      type: String,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  tel: {
      type: Number,
      required: true
  },
  education: {
      type: String,
      required: true
  },
  nation: {
      type: String,
      required: true
  }
})

let logRecordModel = mongoose.model('loginRecords', LogRecordSchema)
module.exports = logRecordModel