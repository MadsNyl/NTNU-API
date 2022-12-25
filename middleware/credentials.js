const allowedOrigins = require('../config/allowedOrigins.js');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', ["GET", "POST", "DELETE"]);
        res.header('Access-Control-Allow-Headers', ["Origin", "Content-Type", "Accept"]);
        res.header('Access-Control-Allow-Origin', origin);
    }
    next();
}

module.exports = credentials;