const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    maxUses: {
        type: Number,
        default: null // null means unlimited
    },
    currentUses: {
        type: Number,
        default: 0
    },
    validUntil: {
        type: Date,
        default: null // null means no expiration
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
