const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const StreetSchema = new Schema({
    indexNum:{
        type: String,
        required: true
    },
    mechaName:{
        type: String,
        required: true
    },
    responsibility: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    chargePerson: {
        type: String,
        required: true
    },
    insideData: [{
        officeTel: {
            type: String,
            rrequired: true
        },
        officeAdd: {
            type: String,
            required: true
        },
        peopleDuty: {
            type: String,
            required: true
        },
        streetDuty: {
            type: String,
            required: true
        }
    }]
})

let xinduModel = mongoose.model('streets', StreetSchema)
module.exports = xinduModel