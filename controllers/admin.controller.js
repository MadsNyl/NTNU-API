const { pool } = require("../connection.js");


// get all users
const getAllUsers = async (req, res) => {
    await pool.query("SELECT * FROM users")
        .then(data => {
            if (data[0].length > 0) return res.send(results);
            return res.sendStatus(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

// edit role of user

// delete user



module.exports = {
    getAllUsers
}