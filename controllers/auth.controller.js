const bcrypt = require("bcrypt");
const { pool } = require("../connection.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ "message": "Username and password are required." });

    let foundUser = false;
    let pwd, match;

    await pool.query(`SELECT username, password FROM users WHERE username = '${username}'`)
        .then(data => {
            if (data[0].length > 0) {
                foundUser = true;
                pwd = data[0][0].password;
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        });
    
    if (!foundUser) return res.sendStatus(401);

    // evaluate password
    if (pwd) match = await bcrypt.compare(password, pwd);


    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
        );
        
        const refreshToken = jwt.sign(
            { "username": username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // update user with access token
        await pool.query(`UPDATE users SET refresh_token = '${refreshToken}' WHERE username = '${username}'`)
            .then(data => {
                res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
                return res.status(200).json({ accessToken });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ "message": error.message });
            });
    }
    else res.sendStatus(401);
}


module.exports = {
    handleLogin
}