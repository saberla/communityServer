const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const sysRecordSchema = new Schema({
  wrongPlace:{
    type: String,
    required: true
  },
  wrongInfo: {
      type: String,
      required: true
  },
  date: {
      type: Date,
      default: Date.now
  },
  userName:{
    type: String,
    required: true
  },
  name: {
      type: String,
      required: true
  }
})

let sysRecordModel = mongoose.model('systemRecords', sysRecordSchema)
module.exports = sysRecordModel