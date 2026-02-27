const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk UID
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true }, // Stored in rupees, not paise
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['successful', 'failed', 'refunded'],
        default: 'successful'
    },
    paymentMethod: { type: String }, // e.g., 'card', 'upi', 'netbanking' (if Razorpay returns this)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
