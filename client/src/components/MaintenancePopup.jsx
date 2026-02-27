import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Hammer } from 'lucide-react';

const MaintenancePopup = () => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 0, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '24px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 0 50px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated Background Glow */}
                <div className="animate-blob" style={{
                    position: 'absolute', top: '-50%', left: '20%', width: '200px', height: '200px',
                    background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%', pointerEvents: 'none'
                }} />

                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    style={{
                        width: '80px', height: '80px', margin: '0 auto 2rem',
                        background: 'rgba(255, 165, 0, 0.1)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ffa500', border: '1px solid rgba(255, 165, 0, 0.2)'
                    }}
                >
                    <Hammer size={40} />
                </motion.div>

                <h1 style={{
                    fontSize: '2rem', marginBottom: '1rem',
                    color: '#f8fafc',
                    fontWeight: 700
                }}>
                    Under Maintenance
                </h1>

                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.05rem' }}>
                    We're currently upgrading <strong style={{ color: '#fff' }}>AuraEd</strong> to bring you a better learning experience.
                    Please Wait Will Be Back Soon 📌
                </p>

                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 16px', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)',
                    whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden'
                }}>
                    <Clock size={16} className="text-secondary" color="#f472b6" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        Estimated Downtime: <span style={{ color: '#f8fafc', fontWeight: 600 }}>Within 24 Hours</span>
                    </span>
                </div>

                <div style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    &copy; AuraEd Team ❤️
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <a href="/login" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#94a3b8'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Admin Login</a>
                </div>
            </motion.div>
        </div>
    );
};

export default MaintenancePopup;
