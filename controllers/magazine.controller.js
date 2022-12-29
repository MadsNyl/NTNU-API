const { pool } = require("../connection.js");


// get magazine by id
const getMagazine = async (req, res) => {
    const id = req.params.id;

    await pool.query(`SELECT * FROM magazine WHERE id = ${id}`)
        .then(data => {
            if (data[0].length > 0) return res.send(data[0]);
            return res.sendStatus(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

module.exports = {
    getMagazine
}