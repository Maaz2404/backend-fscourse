require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI1
  : process.env.MONGODB_URI1

module.exports = { MONGODB_URI, PORT }