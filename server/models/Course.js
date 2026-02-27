const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: false, // Optional
    },
    thumbnail: {
        type: String, // URL to image
        required: true,
    },
    videoUrl: {
        type: String, // Legacy single intro video – kept for backward compatibility
        required: false,
    },
    introVideos: [{
        title: { type: String, default: 'Intro' },
        url: { type: String, required: true },
    }],
    sections: [{
        group: { type: String, default: '' }, // Optional grouping (e.g. "Web Dev", "DSA")
        title: { type: String, required: true },
        lectures: [{
            title: { type: String, required: true },
            videoUrl: { type: String, required: true },
            noteUrl: { type: String, required: false }, // Legacy support
            notes: [{
                title: { type: String, required: true },
                url: { type: String, required: true }
            }],
            duration: { type: String, default: "0:00" },
            freePreview: { type: Boolean, default: false }
        }]
    }],
    published: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: String, // Firebase UID or User Object ID
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
