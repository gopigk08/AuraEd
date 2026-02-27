const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    courseProgress: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        completedLectures: [String] // Array of lecture IDs
    }],
    activeSessions: [{
        deviceId: String,
        lastActive: { type: Date, default: Date.now },
        userAgent: String
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
