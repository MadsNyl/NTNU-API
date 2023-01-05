const { pool } = require("../connection.js");
const jwt = require("jsonwebtoken");

// get user profile
const getProfile = async (req, res) => {
    const { username } = req;

    await pool.query(`SELECT id, username, role FROM users WHERE username = ${username}`)
        .then(data => {
            if (data[0].length > 0) return res.send(data);
            return res.sendStatus(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

// update username
const updateUsername = async (req, res) => {
    const { id, username, role } = req.body;

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

    await pool.query(`UPDATE users SET username = "${username}", refresh_token = "${refreshToken}" WHERE id = ${id}`)
        .then(() => {
            res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, siteName: "None", secure: true });
            return res.send(accessToken);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

module.exports = {
    getProfile,
    updateUsername
}