const { pool } = require("./connection.js");
const bcrypt = require("bcrypt");


const createAdmin = async (username, password, role) => {
    // encrypt password
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // store new user with role
        await pool.query(`INSERT INTO users (username, password, role) VALUES ('${username}', '${hashedPassword}', ${role})`)
            .then(data => {
                console.log("inserting");
                return;
            }).catch(error => {
                console.log(error);
                return;
            });
        
    } catch (e) {
        console.log(e);
    }
}

createAdmin("madsnyl@gmail.com", "Test1234", 5150);