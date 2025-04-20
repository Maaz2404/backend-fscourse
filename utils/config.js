require('dotenv').config();

const PORT = process.env.PORT;
let MONGODB_URL;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URL = process.env.TEST_MONGODB_URL_BLOGS;
} else {
  MONGODB_URL = process.env.MONGODB_URL_BLOGS;
}

module.exports = { MONGODB_URL, PORT };