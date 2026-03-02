const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebase'); // Firebase Admin – used ONLY in /sync
const { verifyToken } = require('../middleware/authMiddleware');

// ─── Helper: sign our own JWTs ────────────────────────────────────────────────

const signAccessToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

const signRefreshToken = (payload) =>
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,          // not accessible via JS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax',         // 'lax' works for same-site + cross-origin redirects
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
};

// ─── POST /api/auth/sync ──────────────────────────────────────────────────────
// Accepts a Firebase ID token, verifies it, upserts the DB user, then issues
// our own JWT access + refresh tokens.  This is the ONLY route that talks to Firebase.
router.post('/sync', async (req, res) => {
    const firebaseToken = req.headers.authorization?.split(' ')[1];
    if (!firebaseToken) {
        return res.status(401).json({ message: 'No Firebase token provided' });
    }

    let firebaseUser;
    try {
        firebaseUser = await admin.auth().verifyIdToken(firebaseToken);
    } catch (err) {
        console.error('Firebase token verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid Firebase token' });
    }

    const { uid, email, picture, name } = firebaseUser;

    try {
        // Upsert user in MongoDB
        let user = await User.findOne({ uid });

        if (!user) {
            if (email) {
                user = await User.findOne({ email });
            }
            if (user) {
                // Link existing email-based account to new provider UID
                user.uid = uid;
                if (name) user.name = name;
                if (picture) user.picture = picture;
                await user.save();
            } else {
                user = await User.create({
                    uid,
                    email: email || `${uid}@noemail.com`,
                    name: name || (email ? email.split('@')[0] : 'User'),
                    picture,
                    role: 'user',
                });
            }
        } else {
            if (name) user.name = name;
            if (picture) user.picture = picture;
            await user.save();
        }

        // Issue our own JWTs
        const tokenPayload = { uid: user.uid, email: user.email, role: user.role };
        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken({ uid: user.uid });

        // Send refresh token as httpOnly cookie, access token in body
        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

        res.json({ accessToken, user });
    } catch (error) {
        console.error('Auth Sync Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
// Reads the httpOnly refreshToken cookie and issues a new access token.
// The client axios interceptor calls this automatically on 401 responses.
router.post('/refresh', async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Fetch latest user data from DB (role may have changed since last login)
        const user = await User.findOne({ uid: decoded.uid });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const tokenPayload = { uid: user.uid, email: user.email, role: user.role };
        const accessToken = signAccessToken(tokenPayload);

        // Also rotate the refresh token for extra security
        const newRefreshToken = signRefreshToken({ uid: user.uid });
        res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

        res.json({ accessToken });
    } catch (err) {
        // Refresh token is expired or invalid → force re-login
        res.clearCookie('refreshToken', { path: '/' });
        return res.status(401).json({ message: 'Refresh token expired, please log in again' });
    }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Clears the httpOnly refresh token cookie.
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'Logged out successfully' });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── PUT /api/auth/me ─────────────────────────────────────────────────────────
router.put('/me', verifyToken, async (req, res) => {
    try {
        const { name, picture } = req.body;
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (picture) user.picture = picture;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── POST /api/auth/enroll/:courseId ─────────────────────────────────────────
router.post('/enroll/:courseId', verifyToken, async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = await User.findOne({ uid: req.user.uid });

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        user.enrolledCourses.push(courseId);
        await user.save();
        res.json({ message: 'Enrolled successfully', enrolledCourses: user.enrolledCourses });
    } catch (error) {
        console.error('Enrollment Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── GET /api/auth/enrolled ───────────────────────────────────────────────────
const Course = require('../models/Course');

router.get('/enrolled', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid })
            .populate({
                path: 'enrolledCourses',
                select: 'title thumbnail sections price originalPrice description',
            });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            enrolledCourses: user.enrolledCourses,
            courseProgress: user.courseProgress,
        });
    } catch (error) {
        console.error('Fetch Enrolled Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
