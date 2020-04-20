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
            type: String,
            required: true
        },
        gridRange: {
            type: String,
            required: true
        },
        gridPeople: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
})

let userModel = mongoose.model('users', UserSchema)
module.exports = userModel