const mongoose = require('mongoose');
const Course = require('../models/Course');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const removePrice = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const courseId = '698999fe4af562181ae72988';

        // Use $unset to completely remove the field
        const updated = await Course.findByIdAndUpdate(
            courseId,
            { $unset: { originalPrice: "" } },
            { new: true }
        );

        console.log('Removed Original Price. Current Course State:', updated.title, updated.price, updated.originalPrice);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

removePrice();
