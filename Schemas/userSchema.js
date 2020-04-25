const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const UserSchema = new Schema({
    userName:{
        type: String,
        required: true
    },
    password:{
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
    education: {
        type: String,
        required: true
    },
    nation: {
        type: String,
        required: true
    },
    insideData: [{
        gridNum: {
            type: String
        },
        gridRange: {
            type: String
        },
        gridPeople: {
            type: String
        },
        taskAmount: {
            type: String
        },
        quality: {
            type: String
        },
        userName: {
          type: String
        },
        name: {
          type: String
        },
        tel: {
          type: String
        },
        education: {
          type: String
        },
        nation: {
          type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    insideData1: [{
        gridNum: {
            type: String
        },
        gridRange: {
            type: String
        },
        gridPeople: {
            type: String
        },
        taskAmount: {
            type: String
        },
        quality: {
            type: String
        },
        userName: {
          type: String
        },
        name: {
          type: String
        },
        tel: {
          type: String
        },
        education: {
          type: String
        },
        nation: {
          type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
})

let userModel = mongoose.model('users', UserSchema)
module.exports = userModel