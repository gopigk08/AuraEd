import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthBackground from '../components/AuthBackground';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }
        setIsLoading(true);
        try {
            await signup(email, password);
            toast.success('Account created successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to create account: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            toast.success('Logged in with Google');
            navigate('/');
        } catch (error) {
            toast.error('Failed to login with Google: ' + error.message);
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

            {/* Register Card */}
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
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                        style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem auto',
                            boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        <UserPlus color="white" size={24} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            marginBottom: '0.5rem',
                            background: 'linear-gradient(to right, #fff, #c4b5fd)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'white'
                        }}
                    >
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}
                    >
                        Join our community of learners today
                    </motion.p>
                </div>

                <motion.form
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
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
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
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
                                placeholder="Create a password"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 3rem 0.9rem 3rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
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

                    {/* Confirm Password Input */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <motion.input
                                whileFocus={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 3rem 0.9rem 3rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
                        {isLoading ? 'Creating Account...' : (
                            <>Sign Up <ArrowRight size={18} /></>
                        )}
                    </motion.button>
                </motion.form>

                <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', left: 0, top: '50%', width: '100%', height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ position: 'relative', background: 'none', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem', backdropFilter: 'blur(20px)' }}>
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
                        Sign up with Google
                    </motion.button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;
