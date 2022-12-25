const { pool } = require("../connection.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    let foundUser = false;
    let username;

    await pool.query(`SELECT username FROM users WHERE refresh_token = '${refreshToken}'`)
        .then(data => {
            if (data[0].length > 0) {
                foundUser = true;
                username = data[0][0].username;
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        });
    
    if (!foundUser) return res.sendStatus(401);

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decoded) => {
            if (error || username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": decoded.username },  
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );
            return res.json({ accessToken });
        }
    );
}


module.exports = {
    handleRefreshToken
}