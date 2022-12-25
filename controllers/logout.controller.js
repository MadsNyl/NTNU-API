const { pool } = require("../connection.js");

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

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
    
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); 
        return res.sendStatus(204);
    }

    // delete refresh token for user
    await pool.query(`UPDATE users SET refresh_token = '${refreshToken}' WHERE username = '${username}'`)
        .then(data => {
            res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); 
            return res.sendStatus(204);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        });
}


module.exports = {
    handleLogout
}