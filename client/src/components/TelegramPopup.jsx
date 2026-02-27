import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TelegramPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already seen the popup in this session
        const hasSeenPopup = sessionStorage.getItem('hasSeenTelegramPopup');

        if (!hasSeenPopup) {
            // Show popup after a short delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('hasSeenTelegramPopup', 'true');
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid #1e293b',
                    position: 'relative'
                }}>
                    <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.05rem', fontWeight: '600' }}>
                        Telegram Community !!
                    </h3>
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body Content */}
                <div style={{ padding: '1.25rem' }}>
                    <div style={{
                        background: '#111827',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '1rem',
                        position: 'relative'
                    }}>
                        {/* Fake squid game icon styling based on image */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: '#0ea5e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '2rem'
                        }}>
                            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="white" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </div>

                        <div style={{ color: 'white', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>join</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>@Official_Channel</div>
                        </div>

                    </div>

                    <p style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '500' }}>
                        Join The Channel For Latest Updates 👍
                    </p>
                    <p style={{ margin: '0 0 1.25rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                        Don't miss any Future updates!
                    </p>

                    <a
                        href="https://t.me/Auraed_official"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleClose}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.875rem',
                            background: '#f43f5e',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#e11d48'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#f43f5e'}
                    >
                        Join Now!
                    </a>
                </div>
            </div>

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                `}
            </style>
        </div>
    );
};

export default TelegramPopup;
