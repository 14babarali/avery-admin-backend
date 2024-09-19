const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT || 8001,

    database: {
        type: process.env.DB_TYPE || "mongodb",
        host: process.env.DB_HOST || "127.0.0.1",
        name: process.env.DB_NAME || "trading",
        user: process.env.DB_USER || "",
        port: process.env.DB_PORT || "27017",
        pass: process.env.DB_PASS || '',
        logging: process.env.DB_LOGGING === "true",
        uri: process.env.DB_URI || process.env.DEV_DB_URL ,  //`mongodb://127.0.0.1:27017/trading`
    },

    tradeAPI: process.env.TRADE_API || "http://127.0.0.1:8000/tradenow",
}