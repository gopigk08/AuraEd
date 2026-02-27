import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbPxqaOuAvbTD6U78Llxs3o8Z2a5JkPjA",
    authDomain: "auraed-88875.firebaseapp.com",
    projectId: "auraed-88875",
    storageBucket: "auraed-88875.firebasestorage.app",
    messagingSenderId: "203454526401",
    appId: "1:203454526401:web:b00fca8701a687024c3540"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
