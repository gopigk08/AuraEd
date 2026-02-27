const admin = require('firebase-admin');

try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        // Render/Prod: Decode base64 encoded string
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
        serviceAccount = JSON.parse(decoded);
    } else {
        // Local dev
        serviceAccount = require('./serviceAccountKey.json');
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin Initialized successfully.");
    }
} catch (error) {
    console.error("Firebase Admin Error:", error);
    console.warn("\n⚠️ WARNING: FIREBASE_SERVICE_ACCOUNT_BASE64 env variable or serviceAccountKey.json not found.");
    console.warn("Authentication features will not work until you configure it.\n");

    // Mock auth for development so server doesn't crash entirely if ignored
    admin.auth = () => ({
        verifyIdToken: async () => { throw new Error("Firebase Admin not configured correctly."); }
    });
}

module.exports = admin;
