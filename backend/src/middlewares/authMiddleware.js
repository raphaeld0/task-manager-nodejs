const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET ;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // O token deve ser enviado no formato "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, jwtKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user; // Adiciona os dados do usuário ao objeto `req`
        next();
    });
}