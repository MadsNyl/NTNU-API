const { pool } = require("../connection.js");

// get an editors site
const getSiteInfo = async (req, res) => {
    const site = req.query.title;
    const user = req.query.user;
    let result = {};

    await pool.query(`SELECT site.* FROM user_site INNER JOIN site ON user_site.site_title = '${site}' GROUP BY site.title, user_site.user_id HAVING site.title = '${site}' AND user_site.user_id = ${user}`)
        .then(data => {
            if (data[0].length > 0) return result.site = data[0];
            return res.status(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });

    await pool.query(`SELECT * FROM magazine WHERE site_title = '${site}'`)
    .then(data => {
        if (data[0].length > 0) {
            result.magazines = data[0];
            return res.send(result);
        }
        result.magazines = [];
        return res.send(result);
    })
    .catch(error => {
        console.log(error);
        return res.sendStatus(500);
    })
}

// get all sites for admin
const getAll = async (req, res) => {
    await pool.query(`SELECT * FROM site`)
        .then(data => {
            if (data[0].length > 0) return res.send(data[0]);
            return res.status(404).json({ "message": "No pages found." });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        });
}

// create site for an editor
const createSite = async (req, res) => {
    const { title, name, user_id } = req.body;

    await pool.query(`INSERT INTO site (title, name) VALUES(?, ?)`, [title, name])
        .then(data => {
            if (data) return res.status(200).json({ "message": "Site successfully created." });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        });

    await pool.query(`INSERT INTO user_site (user_id, site_title) VALUES (?, ?)`, [user_id, title])
        .then(data => {
            if (data) return res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(200);
        });
}

// connect site and user
const connectSiteToUser = async (req, res) => {
    const { user_id, site_title, editor_id } = req.body;

    // connect editor to site
    await pool.query(`INSERT INTO user_site (user_id, site_title) VALUES(${editor_id}, '${site_title}')`)
        .then(data => {
            if (data) return res.status(200).json({ "message": "Site successfully connected to editor." });
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });

    // connect admin to site
    await pool.query(`INSERT INTO user_site (user_id, site_title) VALUES(${user_id}, '${site_title}')`)
        .then(data => {
            if (data) return res.status(200).json({ "message": "Site successfully connected to admin." });
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}


module.exports = {
    getSiteInfo,
    getAll,
    createSite,
    connectSiteToUser
}