
const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    jwt.verify(token, "our-jsonwebtoken-secret-key", (err, users) => {
        if (err) return res.sendStatus(403); 
        req.user = decoded;
        next(); 
    });
}

module.exports = authenticateJWT;

