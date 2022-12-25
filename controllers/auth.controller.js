const bcrypt = require("bcrypt");
const { pool } = require("../connection.js");

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
    
    if (!foundUser) return res.status(401).end();

    // evaluate password
    if (pwd) match = await bcrypt.compare(password, pwd);


    if (match) return res.status(200).json({ "message": `User ${username} is logged in.` })
    else res.sendStatus(401);
}


module.exports = {
    handleLogin
}