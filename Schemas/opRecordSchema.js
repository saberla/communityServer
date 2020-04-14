const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const opRecordSchema = new Schema({
  userName:{
    type: String,
    required: true
  },
  role: {
      type: String
  },
  date: {
      type: Date,
      default: Date.now
  },
  name: {
      type: String,
      required: true
  },
  tel: {
      type: Number,
      required: true
  },
  operate: {
      type: String,
      required: true
  }
})

let opRecordModel = mongoose.model('operateRecords', opRecordSchema)
module.exports = opRecordModel