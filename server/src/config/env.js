const dotenv = require("dotenv");

dotenv.config();

JWT_SECRET = process.env.JWT_SECRET;
DB_PASSWORD = process.env.DB_PASSWORD;
DB_HOST = process.env.DB_HOST;
DB_PORT = process.env.DB_PORT;
DB_USER = process.env.DB_USER;
DB_DATABASE = process.env.DB_DATABASE;

module.exports = {JWT_SECRET, DB_HOST, DB_USER, DB_DATABASE, DB_PASSWORD, DB_PORT};