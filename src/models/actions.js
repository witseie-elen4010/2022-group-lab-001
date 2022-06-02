const mongoose = require('mongoose')
const Schema = mongoose.Schema

const actionSchema = new Schema({
    guess: {
        type: String,
        required: [true, 'The guess field is missing']
    },
    typeOfAction: {
        type: String,
        required: [true, 'The typeOfAction field is missing']

    },
    initiatedBy: {
        type: String,
        required: [true, 'The initiatedBy field is missing']
    }
}, { timestamps: true })

const Action = mongoose.model('Action', actionSchema)
module.exports = Action