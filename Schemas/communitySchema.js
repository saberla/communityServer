// 小区治理
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const communitySchema = new Schema({
  communityName: {
    type: String,
    required: true
  },
  communityAdd: {
    type: String,
    required: true
  },
  developCompany: {
    type: String,
    required: true
  },
  property: {
    type: String,
    required: true
  },
  insidePeople: [{
    option: {
      type: String,
      required: true
    }
  }],
  insideHouses: [{
    option: {
      type: String,
      required: true
    }
  }],
  date: {
      type: Date,
      default: Date.now
  }
})

let communityModel = mongoose.model('communities', communitySchema)
module.exports = communityModel