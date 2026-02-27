const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Global Request Logger to Debug Timeouts
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Routes
// Routes
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bunnyRoutes = require('./routes/bunnyRoutes');

app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bunny', bunnyRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    }
}));

// Database Connection
console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully to:', mongoose.connection.name))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
