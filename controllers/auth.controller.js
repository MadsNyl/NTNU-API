const bcrypt = require("bcrypt");
const { pool } = require("../connection.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ "message": "Username and password are required." });

    let foundUser = false;
    let pwd, match, role, id;

    await pool.query(`SELECT id, username, password, role FROM users WHERE username = '${username}'`)
        .then(data => {
            if (data[0].length > 0) {
                foundUser = true;
                pwd = data[0][0].password;
                role = data[0][0].role;
                id = data[0][0].id;
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
            { 
                "UserInfo": {
                    "username": username,
                    "role": role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
        );
        
        const refreshToken = jwt.sign(
            { "username": username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // update user with access token
        await pool.query(`UPDATE users SET refresh_token = '${refreshToken}' WHERE username = '${username}'`)
            .then(data => {
                res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, siteName: "None", secure: true });
                return res.status(200).json({ accessToken, role, id, username });
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