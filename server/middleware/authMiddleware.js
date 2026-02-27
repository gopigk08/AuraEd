const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * verifyToken – verifies our own JWT (issued at /api/auth/sync).
 * Attaches req.user = { uid, email, role, ... } from the token payload.
 * Used by: authRoutes, notificationRoutes, settingsRoutes, userRoutes, uploadRoutes, etc.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { uid, email, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * checkAdmin – verifies the user has the 'admin' role.
 * Works on req.user.role (embedded in the JWT payload – no extra DB call needed).
 */
const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = { verifyToken, checkAdmin };
