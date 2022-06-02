const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }) // auto-create timestamps

const User = mongoose.model('User', userSchema) // model name must be the singular of name of collection in DB. 'Blog' -> blogs

module.exports = User
