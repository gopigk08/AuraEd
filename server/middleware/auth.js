const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect – verifies our JWT and attaches the full DB user to req.user.
 * Used by courseRoutes (which needs req.user.role for adminOnly check,
 * and req.user._id for progress tracking).
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch full DB user so downstream handlers get req.user._id, enrolledCourses, etc.
        const user = await User.findOne({ uid: decoded.uid });
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('protect middleware error:', err.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

/**
 * adminOnly – must be used after protect middleware.
 * Checks req.user.role (from DB user object).
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };
