const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['info', 'offer', 'warning', 'success'],
        default: 'info',
    },
    recipient: {
        type: String, // 'all' or specific userId (firebase uid)
        default: 'all',
    },
    relatedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    readBy: [{
        uid: String,
        readAt: Date
    }],
    createdBy: {
        type: String, // Admin UID
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
