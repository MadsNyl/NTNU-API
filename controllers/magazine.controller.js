const { pool } = require("../connection.js");
const { uploadFile, deleteFile } = require("../azure.js");


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

// edit magazine
const editMagazine = async (req, res) => {
    const { id, title, issue, pdf, image } = req.body;

    await pool.query(`UPDATE magazine SET title = '${title}', issue = ${issue}, pdf = '${pdf}', logo = '${image}' WHERE id = ${id}`)
        .then(data => {
            console.log(data);
            return res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        })
}

// delete magazine
const deleteMagazine = async (req, res) => {
    const { id, image, pdf } = req.body;

    // delete pdf
    try { await deleteFile(pdf); }
    catch (error) { return res.sendStatus(500); }

    // delete image if exists
    if (image) {
        try { await deleteFile(image); }
        catch (error) { return res.sendStatus(500); }
    }

    await pool.query(`DELETE FROM magazine WHERE id = ${id}`)
        .then(data => {
            return res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });
}

// create magazine
const createMagazine = async (req, res) =>  {
    const files = req.files;
    const { title, issue, siteTitle } = req.body;

    let pdf_url, img_url;

    // upload pdf
    try { pdf_url = await uploadFile(files[0]); }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    // upload img
    if (files[1]) {
        try { img_url = await uploadFile(files[1]); }
        catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    } else img_url = null;

    // upload magazine to db
    let id;

    await pool.query(`INSERT INTO magazine (title, issue, pdf, logo, site_title) VALUES ('${title}', ${issue}, '${pdf_url}', ?, '${siteTitle}')`, [img_url])
        .then(data => {
            return id = data[0].insertId;
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        });

    await pool.query(`SELECT * FROM magazine WHERE id = ${id}`)
        .then(data => {
            if (data[0].length > 0) return res.send(data);
            return res.sendStatus(404);
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(500);
        })
}

module.exports = {
    getMagazine,
    editMagazine,
    deleteMagazine,
    createMagazine
}