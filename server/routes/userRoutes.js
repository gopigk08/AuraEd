const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { verifyToken, checkAdmin } = require('../middleware/authMiddleware');

// GET all users (Admin Only)
router.get('/', verifyToken, checkAdmin, async (req, res) => {
    try {
        const users = await User.find().populate({
            path: 'enrolledCourses',
            select: 'title price _id'
        }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// POST Manual Enrollment (Admin Only)
router.post('/enroll-manual', verifyToken, checkAdmin, async (req, res) => {
    try {
        const { email, courseId } = req.body;

        if (!email || !courseId) {
            return res.status(400).json({ message: "Email and Course ID are required" });
        }

        // Find user by email
        const targetUser = await User.findOne({ email });
        if (!targetUser) {
            return res.status(404).json({ message: "User with that email not found. They must sign in at least once first." });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if already enrolled
        if (targetUser.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        // Enroll User
        targetUser.enrolledCourses.push(courseId);
        await targetUser.save();

        res.json({ message: `Successfully enrolled ${targetUser.name || targetUser.email} into ${course.title}` });
    } catch (error) {
        console.error("Manual Enrollment Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// POST Force Logout (Admin Only)
router.post('/:uid/force-logout', verifyToken, checkAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const targetUser = await User.findOne({ uid });

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Wipe all their active sessions
        targetUser.activeSessions = [];
        await targetUser.save();

        res.json({ message: `Successfully force logged out ${targetUser.email}. They will be required to sign in again.` });
    } catch (error) {
        console.error("Force Logout Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
