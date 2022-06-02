const mongoose = require('mongoose')
require('dotenv').config({ path: './.env' })

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@wordlecluster.siowx.mongodb.net/multiwordle?retryWrites=true&w=majority`
exports.connectToDataBase = () => {
  mongoose.connect(uri).then((result) => console.log('Successfully connected to database')).catch((error) => console.log(error))
}
