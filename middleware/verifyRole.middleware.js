const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.role);
        
        const result = rolesArray.includes(role);

        if (!result) return res.sendStatus(401);

        next();
    }
}

module.exports = verifyRole;