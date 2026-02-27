const admin = require('firebase-admin');

try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized");
} catch (error) {
    console.warn("\n⚠️ WARNING: serviceAccountKey.json not found in config folder.");
    console.warn("Authentication features will not work until you add this file.");
    console.warn("See walkthrough.md for instructions.\n");

    // Mock auth for development so server doesn't crash
    admin.auth = () => ({
        verifyIdToken: async () => { throw new Error("Firebase Admin not configured"); }
    });
}

module.exports = admin;
