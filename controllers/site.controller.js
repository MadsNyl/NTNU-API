const { pool } = require("../connection.js");

// get an editors site
const getSiteInfo = async (req, res) => {
    const site = req.query.title;
    const user = req.query.user;

    await pool.query(`SELECT site.* FROM user_site INNER JOIN site ON user_site.site_title = '${site}' GROUP BY site.title, user_site.user_id HAVING site.title = '${site}' AND user_site.user_id = ${user}`)
        .then(data => {
            if (data[0].length > 0) return res.send(data[0]);
            return res.status(404).json({ "message": "No site is registered for this user." })
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
        });
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
    const { title, name, description } = req.body;

    await pool.query(`INSERT INTO site (title, name, description) VALUES('${title}', '${name}', '${description}')`)
        .then(data => {
            if (data) return res.status(200).json({ "message": "Site successfully created." });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ "message": error.message });
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