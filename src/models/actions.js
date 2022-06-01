const mongoose = require('mongoose')
const Schema = mongoose.Schema

const actionSchema = new Schema({
    guess: {
        type: String,
        required: false
    },
    typeOfAction: {
        type: String,
        required: true

    },
    initiatedBy: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Action = mongoose.model('Action', actionSchema)
module.exports = Action