const { pool } = require("../connection.js");


// get all users without admins
const getAllUsers = async (req, res) => {
    await pool.query("SELECT * FROM users WHERE role != 5150")
        .then(data => {
            if (data[0].length > 0) return res.send(data[0]);
            return res.sendStatus(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

// get given user with sites
const getUser = async (req, res) => {
    let user_data = {};

    await pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`)
        .then(data => {
            if (data[0].length > 0) user_data.data = data[0];
            else return res.sendStatus(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });

    // get site connected to user
    await pool.query(`SELECT site.* FROM user_site INNER JOIN site ON user_site.site_title = site.title WHERE user_site.user_id = ${req.params.id}`)
        .then(data => {
            if (data[0].length > 0 && user_data) user_data.site = data[0];
            return res.send(user_data);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

// edit role of user

// delete user



module.exports = {
    getAllUsers,
    getUser
}