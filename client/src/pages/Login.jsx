import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthBackground from '../components/AuthBackground';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, loginWithGoogle, logout, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Check Maintenance Status
            let isMaintenance = false;
            try {
                const { data } = await api.get('/settings/maintenance');
                isMaintenance = data.value === true;
            } catch (err) {
                console.error("Failed to check maintenance status", err);
            }

            // 2. Perform Login
            const userCredential = await login(email, password);
            const user = userCredential.user;

            // 3. Sync immediately to get user role
            const firebaseToken = await user.getIdToken();
            const { data: syncData } = await api.post('/auth/sync', {}, {
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });

            if (isMaintenance && syncData.user.role !== 'admin') {
                await logout(); // Kick them out immediately
                navigate('/'); // Redirect to home so Maintenance Popup shows
                return; // Stop execution
            }

            // Save to localStorage immediately so App.jsx sees it after redirect
            localStorage.setItem('user', JSON.stringify({ ...user, ...syncData.user }));
            localStorage.setItem('token', syncData.accessToken); // Ensure EXACT API token is set

            // Sync React context synchronously to avoid navigation race condition
            setCurrentUser({ ...user, ...syncData.user });

            toast.success('Welcome back!');
            const from = location.state?.from?.pathname || '/';
            if (from !== '/') {
                navigate(from);
            } else if (syncData.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            if (error.message.includes("Maintenance Mode")) {
                await logout();
                navigate('/');
            } else if (error.code === 'auth/invalid-credential') {
                toast.error('Invalid email or password. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Incorrect password. Please try again.');
            } else {
                toast.error(error.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // 1. Check Maintenance Status
            let isMaintenance = false;
            try {
                const { data } = await api.get('/settings/maintenance');
                isMaintenance = data.value === true;
            } catch (err) {
                console.error("Failed to check maintenance status", err);
            }

            // 2. Perform Google Login
            const userCredential = await loginWithGoogle();
            const user = userCredential.user;

            // 3. Sync immediately to get user role
            const firebaseToken = await user.getIdToken();
            const { data: syncData } = await api.post('/auth/sync', {}, {
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });

            if (isMaintenance && syncData.user.role !== 'admin') {
                await logout();
                navigate('/'); // Redirect to home so Maintenance Popup shows
                return;
            }

            // Save to localStorage immediately
            localStorage.setItem('user', JSON.stringify({ ...user, ...syncData.user }));
            localStorage.setItem('token', syncData.accessToken);

            // Sync React context synchronously to avoid navigation race condition
            setCurrentUser({ ...user, ...syncData.user });

            toast.success('Welcome back!');
            if (syncData.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            if (error.message && error.message.includes("Maintenance Mode")) {
                await logout();
                navigate('/');
            } else {
                toast.error(error.message || 'Google login failed');
            }
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem',
            background: 'var(--background)'
        }}>
            {/* Animated Background Elements */}
            <AuthBackground />

            {/* Login Card */}
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '420px',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: 800,
                            marginBottom: '0.5rem',
                            color: 'var(--text)'
                        }}
                    >
                        Welcome Back
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}
                    >
                        Enter your credentials to access your account
                    </motion.p>
                </div>

                <motion.form
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >

                    {/* Email Input */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <motion.input
                                whileFocus={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: 'var(--text)',
                                    outline: 'none',
                                    transition: 'background 0.2s',
                                    fontSize: '0.95rem'
                                }}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <motion.input
                                whileFocus={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 3rem 0.9rem 3rem',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: 'var(--text)',
                                    outline: 'none',
                                    transition: 'background 0.2s',
                                    fontSize: '0.95rem'
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Remember Me & Forgot Password */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)', userSelect: 'none' }}>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    background: rememberMe ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}>
                                {rememberMe && <Check size={12} color="white" />}
                            </motion.div>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            Remember me
                        </label>
                        <Link to="#" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary-light)'} onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}>
                            Forgot Password?
                        </Link>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)'
                        }}
                    >
                        {isLoading ? 'Signing In...' : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </motion.button>
                </motion.form>

                <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ position: 'relative', background: 'none', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem', backdropFilter: 'blur(20px)' }}> {/* Trick for transparent bg on line */}
                        <span style={{ background: 'var(--surface)', padding: '0 10px' }}>Or continue with</span>
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            color: 'var(--text)',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            transition: 'border 0.2s'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </motion.button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
