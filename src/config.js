require('dotenv').config();

module.exports = {
  BOT: {
    prefix: process.env.PREFIX,
    token: process.env.TOKEN
  }
}