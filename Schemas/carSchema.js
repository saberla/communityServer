// 车辆建档
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const carSchema = new Schema({
  carNum: {
    type: String,
    required: true
  },
  carHolder: {
    type: String,
    required: true
  },
  carColor: {
    type: String,
    required: true
  },
  communityName: {
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

let carsModel = mongoose.model('cars', carSchema)
module.exports = carsModel