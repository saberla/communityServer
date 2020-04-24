const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const TaskSchema = new Schema({
    gridRange:{
        type: String,
        required: true
    },
    taskType:{
        type: String,
        required: true
    },
    taskAmount: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    quality: {
        type: String
    },
    process: {
        type: String
    },
    checked: {
        type: String
    },
    gridPerson: {
        type: String
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

let taskModel = mongoose.model('tasks', TaskSchema)
module.exports = taskModel