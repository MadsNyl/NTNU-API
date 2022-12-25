const bcrypt = require("bcrypt");
const { pool } = require("../connection.js");

const handleNewUser = async (req, res) => {
    const { username, password, repeatedPassword } = req.body;

    if (!username || !password || !repeatedPassword) return res.status(400).json({ "message": "Username and password are required." });

    if (password !== repeatedPassword) return res.status(400).json({ "message": "Password and repeated password must match." });

    let duplicate = false;

    // check for duplicate user
    await pool.query(`SELECT username FROM users WHERE username = '${username}'`)
        .then(data => {
            console.log(data[0]);
            if (data[0].length > 0) {
                duplicate = true;
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        }); 

    if (duplicate) return res.status(409).end();

    // encrypt password
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // store new user
        await pool.query(`INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`)
            .then(data => {
                console.log("inserting");
                return res.status(201).json({ "message": `User ${username} succesfully created.` });
            }).catch(error => {
                console.log(error);
                return res.status(500).json({ "message": error.message });
            });
        
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
}


module.exports = {
    handleNewUser
}