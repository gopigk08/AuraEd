const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Admin access required" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// GET /api/notifications - Get notifications for current user
router.get('/', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;

        // Use .lean() to get plain JS objects, bypassing Mongoose casting issues with mixed types
        // This is crucial if the DB contains legacy data (strings) mixed with new data (objects)
        const notifications = await Notification.find({
            $or: [
                { recipient: 'all' },
                { recipient: uid }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('relatedCourses', 'title price thumbnail')
            .lean();

        // Filter and map
        const result = notifications.filter(notif => {
            if (!notif.readBy) notif.readBy = [];

            // Find read entry (handle object or legacy string)
            const readEntry = notif.readBy.find(r =>
                (typeof r === 'string' && r === uid) ||
                (typeof r === 'object' && r && r.uid === uid)
            );

            // If NOT read by user, show it (return true)
            if (!readEntry) return true;

            // If found, check time
            let readAt;
            if (typeof readEntry === 'object' && readEntry.readAt) {
                readAt = new Date(readEntry.readAt);
            } else {
                // Legacy string (no date) -> Treat as read long ago -> HIDE IT
                return false;
            }

            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            // Show only if read LESS than 1 hour ago
            // If readAt is OLDER than 1 hour, it returns false (hidden)
            // If readAt is NEWER (e.g. 5 mins ago), it returns true (shown)
            // If Marked as Read with immediate=true (set to 2 hours ago), it returns false (hidden)
            return readAt > oneHourAgo;

        }).map(notif => {
            // Since we used lean(), notif is already a POJO
            if (!notif.readBy) notif.readBy = [];

            const readEntry = notif.readBy.find(r =>
                (typeof r === 'string' && r === uid) ||
                (typeof r === 'object' && r && r.uid === uid)
            );
            notif.isRead = !!readEntry;
            return notif;
        });

        res.json(result);
    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// GET /api/notifications/all - Get ALL notifications (Admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .populate('relatedCourses', 'title price thumbnail');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// POST /api/notifications - Create a notification (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, message, type, recipient, relatedCourses } = req.body;

        const notification = new Notification({
            title,
            message,
            type: type || 'info',
            recipient: recipient || 'all',
            relatedCourses: relatedCourses || [],
            createdBy: req.user.uid,
            readBy: []
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        console.error("Create Notification Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE /api/notifications/all - Delete ALL notifications (Admin only)
router.delete('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.json({ message: "All notifications deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE /api/notifications/:id - Delete a notification (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const { immediate } = req.body; // Check for immediate flag

        // Find document first
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: "Not found" });

        if (!notification.readBy) notification.readBy = [];

        // 1. Manually Filter out ANY existing entry for this user (legacy string OR object)
        // This effectively "resets" the read status for this user in memory
        // We use a new array to avoid in-place mutation confusion
        const newReadBy = notification.readBy.filter(entry => {
            if (typeof entry === 'string') return entry !== uid;
            if (typeof entry === 'object' && entry) return entry.uid !== uid;
            return true;
        });

        // 2. Add the NEW entry with correct timestamp
        // If immediate, set to 2 hours ago so it bypasses the "show for 1 hour" check
        const readAt = immediate ? new Date(Date.now() - 2 * 60 * 60 * 1000) : new Date();
        newReadBy.push({ uid, readAt });

        // 3. Assign and Mark Modified
        notification.readBy = newReadBy;
        notification.markModified('readBy');

        // 4. Save
        await notification.save();

        res.json({ message: "Marked as read", readAt });
    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
