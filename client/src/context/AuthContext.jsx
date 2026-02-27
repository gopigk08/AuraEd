import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../utils/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ─── Sync helper: verify Firebase token → get our JWT + user from backend ───
    const syncWithBackend = async (firebaseUser) => {
        const firebaseToken = await firebaseUser.getIdToken(true);
        const { data } = await api.post('/auth/sync', {}, {
            headers: { Authorization: `Bearer ${firebaseToken}` },
        });
        // Store OUR access token (not Firebase token) for all subsequent API calls
        localStorage.setItem('token', data.accessToken);
        const fullUser = { ...firebaseUser, ...data.user };
        setCurrentUser(fullUser);
        localStorage.setItem('user', JSON.stringify(fullUser));
        return fullUser;
    };

    // ─── Auth Methods ─────────────────────────────────────────────────────────

    const signup = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const loginWithGoogle = async () => {
        // Aggressively clear Firebase cached identity to force the picker UI
        try { await signOut(auth); } catch (e) { /* ignore */ }
        googleProvider.setCustomParameters({
            prompt: 'consent select_account',
        });
        return signInWithPopup(auth, googleProvider);
    };

    const logout = async () => {
        try {
            // Tell server to clear the httpOnly refresh token cookie
            await api.post('/auth/logout');
        } catch (e) {
            console.warn('Logout server call failed (non-critical):', e.message);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        return signOut(auth);
    };

    // ─── Auth State Listener ──────────────────────────────────────────────────
    // onAuthStateChanged fires on sign-in and sign-out.
    // We only sync with backend on sign-in; sign-out is handled by logout().
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    await syncWithBackend(firebaseUser);
                } catch (error) {
                    console.error('Auth Sync Error:', error);
                    // Fallback: keep firebase user in state but clear bad token
                    localStorage.removeItem('token');
                    setCurrentUser(firebaseUser);
                }
            } else {
                // Firebase signed out (e.g. on page load if not logged in)
                // Only clear if we don't already have a valid session via refresh cookie
                const hasToken = localStorage.getItem('token');
                if (!hasToken) {
                    localStorage.removeItem('user');
                    setCurrentUser(null);
                }
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        user: currentUser,
        setCurrentUser,
        signup,
        login,
        loginWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--background)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '3rem 4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            border: '4px solid rgba(139, 92, 246, 0.2)',
                            borderTop: '4px solid var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <div>
                            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.75rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Welcome to AuraEd
                            </h2>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: '0.5px' }}>
                                Preparing your learning experience...
                            </p>
                        </div>
                    </div>
                    <style>
                        {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(20px) scale(0.95); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        `}
                    </style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
