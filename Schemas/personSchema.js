// 人员建档
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const personSchema = new Schema({
  communityName: {
    type: String,
    required: true
  },
  personName: {
    type: String,
    required: true
  },
  personSex: {
    type: String,
    required: true
  },
  personTel: {
    type: String,
    required: true
  },
  personAdd: {
    type: String,
    required: true
  },
  date: {
      type: Date,
      default: Date.now
  }
})

let personModel = mongoose.model('persons', personSchema)
module.exports = personModel