const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Admin Middleware Check
const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error during admin verification" });
    }
};

// GET all coupons (Admin Only)
router.get('/', verifyToken, checkAdmin, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching coupons' });
    }
});

// POST check/validate coupon (Public, during checkout)
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Coupon code required' });

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon' });
        }

        if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }

        if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
            return res.status(400).json({ message: 'This coupon has reached its usage limit' });
        }

        res.json({
            message: 'Coupon applied',
            discountPercentage: coupon.discountPercentage
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error validating coupon' });
    }
});

// POST new coupon (Admin Only)
router.post('/', verifyToken, checkAdmin, async (req, res) => {
    try {
        const { code, discountPercentage, maxUses, validUntil } = req.body;

        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase(),
            discountPercentage,
            maxUses: maxUses || null,
            validUntil: validUntil ? new Date(validUntil) : null
        });

        await newCoupon.save();
        res.status(201).json(newCoupon);

    } catch (error) {
        res.status(500).json({ message: 'Server Error creating coupon' });
    }
});

// DELETE a coupon (Admin Only)
router.delete('/:id', verifyToken, checkAdmin, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting coupon' });
    }
});

// PATCH toggle active status (Admin Only)
router.patch('/:id/toggle', verifyToken, checkAdmin, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating coupon' });
    }
});

module.exports = router;
