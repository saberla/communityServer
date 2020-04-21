// 房屋建档
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const houseSchema = new Schema({
  communityName: {
    type: String,
    required: true
  },
  houseNum: {
    type: String,
    required: true
  },
  houseSize: {
    type: String,
    required: true
  },
  houseHolder: {
    type: String,
    required: true
  },
  gridNum: {
    type: String,
    required: true
  },
  gridRange: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

let houseModel = mongoose.model('houses', houseSchema)
module.exports = houseModel