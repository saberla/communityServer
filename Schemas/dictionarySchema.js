const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const dictionarySchema = new Schema({
  dictionaryName: {
    type: String,
    required: true
  },
  dictionaryType: {
    type: String,
    required: true
  },
  insideData: [{
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

let dictionaryModel = mongoose.model('dictionaries', dictionarySchema)
module.exports = dictionaryModel