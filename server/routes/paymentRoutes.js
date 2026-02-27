const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Course = require('../models/Course');
const Coupon = require('../models/Coupon');
const Payment = require('../models/Payment'); // Added Payment model
const { verifyToken, checkAdmin } = require('../middleware/authMiddleware'); // For Admin Protection
const router = express.Router();

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn("\n⚠️ WARNING: Razorpay keys not found in .env.");
    console.warn("Payment features will not work.\n");
    // Mock to prevent crashes when route file loads
    razorpay = {
        orders: { create: async () => { throw new Error("Razorpay not configured"); } }
    };
}

// Create Order
router.post('/create-order', async (req, res) => {
    const { courseId, userId, couponCode } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        let finalPrice = course.price;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });

            if (!coupon) {
                return res.status(404).json({ message: 'Invalid or expired coupon' });
            }

            if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
                return res.status(400).json({ message: 'This coupon has expired' });
            }

            if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
                return res.status(400).json({ message: 'This coupon has reached its usage limit' });
            }

            // Calculate Discount
            const discountAmount = (course.price * coupon.discountPercentage) / 100;
            finalPrice = Math.max(0, course.price - discountAmount);
        }

        const options = {
            amount: Math.round(finalPrice * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId, couponCode } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            // Fetch order details from Razorpay to get the exact amount paid safely
            const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
            const amountPaid = rzpOrder.amount_paid / 100; // Convert from paise to rupees

            // Create Payment Record
            const paymentRecord = new Payment({
                userId: userId,
                courseId: courseId,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: amountPaid,
                currency: rzpOrder.currency,
                status: 'successful'
            });
            await paymentRecord.save();

            // Enroll User
            const user = await User.findOne({ uid: userId });
            if (user) {
                if (!user.enrolledCourses.includes(courseId)) {
                    user.enrolledCourses.push(courseId);
                    await user.save();
                }

                // Increment coupon usage if one was applied
                if (couponCode) {
                    await Coupon.findOneAndUpdate(
                        { code: couponCode.toUpperCase() },
                        { $inc: { currentUses: 1 } }
                    );
                }

                res.json({ message: 'Payment verified and enrolled successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Enrollment or payment recording failed', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
});

// --- ADMIN ROUTES ---

// Get all payments (Admin)
router.get('/all', verifyToken, checkAdmin, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('courseId', 'title')
            .sort({ createdAt: -1 });

        // We populate course title.
        // For User, since we use clerk uid (String), we can't easily populate via Mongoose unless we do a manual lookup or store ObjectIds. 
        // We'll manual lookup the user details for better UI context.

        const paymentsWithUsers = await Promise.all(payments.map(async (payment) => {
            const user = await User.findOne({ uid: payment.userId });
            return {
                ...payment.toObject(),
                user: user ? { name: user.name, email: user.email } : { name: 'Unknown', email: 'Unknown' }
            };
        }));

        res.json(paymentsWithUsers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
    }
});

// Refund a payment (Admin)
router.post('/refund/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment record not found' });

        if (payment.status === 'refunded') {
            return res.status(400).json({ message: 'Payment already refunded' });
        }

        // Trigger Razorpay Refund
        // By default, not passing an amount triggers a full refund.
        const refundParams = {
            payment_id: payment.paymentId,
            notes: {
                reason: 'Admin requested refund'
            }
        };

        const refundResponse = await razorpay.payments.refund(refundParams);

        if (refundResponse.status === 'processed') {
            // Update Payment Status
            payment.status = 'refunded';
            await payment.save();

            // Revoke Access
            const user = await User.findOne({ uid: payment.userId });
            if (user) {
                user.enrolledCourses = user.enrolledCourses.filter(
                    (courseId) => courseId.toString() !== payment.courseId.toString()
                );
                await user.save();
            }

            res.json({ message: 'Refund successful and access revoked' });
        } else {
            res.status(400).json({ message: 'Refund failed at Razorpay', refundResponse });
        }

    } catch (error) {
        console.error('Refund Error:', error);
        res.status(500).json({ message: 'Refund process failed', error: error.response?.error?.description || error.message });
    }
});

module.exports = router;
