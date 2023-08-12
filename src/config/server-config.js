const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT: process.env.PORT,
    host_port: process.env.HOST_PORT
}