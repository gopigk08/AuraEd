import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Heart, ArrowRight, BookOpen, User, Home, Info, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(to bottom, var(--background), var(--surface))',
            borderTop: '1px solid var(--border)',
            padding: '5rem 1.5rem 1.5rem',
            color: 'var(--text-muted)',
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden'
        }}>
            {/* Add a subtle glow for premium feel */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                width: '60%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                opacity: 0.5
            }}></div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', textDecoration: 'none' }}>
                            <img src="/banner-transparent.png" alt="AuraEd Logo" className="footer-logo" style={{
                                height: '120px', // Adjusted size for horizontal main logo
                                objectFit: 'contain'
                            }} />
                        </Link>
                        <p style={{ lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
                            Transforming the way you learn with premium education, expert-led courses, and a vibrant community. Unlock your potential with AuraEd.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, index) => (
                                <a key={index} href={social.href} style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: 'var(--surface-hover, rgba(255,255,255,0.05))',
                                    border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--primary)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px -10px var(--primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.5px' }}>Explore</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Home', path: '/', icon: Home },
                                { name: 'Courses', path: '/courses', icon: BookOpen },
                                { name: 'About Us', path: '/#', icon: Info },
                                { name: 'Contact', path: '/#', icon: MessageCircle }
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link to={item.path} style={{
                                        transition: 'all 0.2s',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: 'var(--text-muted)',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--primary)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <item.icon size={14} />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 style={{ color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.5px' }}>Get in Touch</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <li>
                                <a href="https://wa.me/919398645123?text=Hello%20%F0%9F%91%8B" target="_blank" rel="noopener noreferrer" style={{
                                    display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={16} color="var(--primary)" />
                                    </div>
                                    <span style={{ fontSize: '0.95rem' }}>Contact Me</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:gugulothug24@gmail.com" style={{
                                    display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail size={16} color="var(--primary)" />
                                    </div>
                                    <span style={{ fontSize: '0.95rem' }}>gugulothug24@gmail.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 style={{ color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.5px' }}>Join Our Newsletter</h3>
                        <p style={{ marginBottom: '1.2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>Subscribe to get latest updates, new courses, and exclusive offers.</p>
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '4px',
                                transition: 'border-color 0.3s'
                            }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <input type="email" placeholder="Enter your email" required style={{
                                    flex: 1, padding: '0.8rem 1rem', background: 'transparent', border: 'none',
                                    color: 'var(--text)', outline: 'none', fontSize: '0.95rem'
                                }} />
                                <button type="submit" style={{
                                    background: 'var(--primary)', color: '#fff', border: 'none',
                                    borderRadius: '8px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'background 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.9)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.8rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
                        <span>Made with</span>
                        <Heart size={16} fill="var(--primary)" color="var(--primary)" style={{ animation: 'pulse 2s infinite' }} />
                        <span>by the <strong style={{ color: 'var(--text)', fontWeight: 600 }}>AuraEd Team</strong></span>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} AuraEd. All rights reserved.</p>
                </div>
            </div>

            {/* Inline styles for custom animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
                    gap: 4rem;
                    margin-bottom: 4rem;
                }
                @media (max-width: 992px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                }
                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                /* Logo Theme Adapting */
                .footer-logo {
                    /* Add a subtle dark drop shadow so the white text remains readable on light theme */
                    filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));
                    transition: transform 0.3s ease, filter 0.3s ease;
                }
                .footer-logo:hover {
                    transform: scale(1.05);
                    filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
                }
                
                /* Check your specific dark mode class/attribute here - commonly .dark or [data-theme="dark"] */
                :global(.dark) .footer-logo,
                [data-theme="dark"] .footer-logo {
                    /* Add specific dark mode filters if needed, assuming transparent for now */
                }
                
                @media (prefers-color-scheme: dark) {
                    /* Fallback if no classes are used and OS is dark */
                    :root:not([data-theme="light"]):not(.light) .footer-logo {
                        /* Add specific dark mode filters if needed */
                    }
                }
            `}} />
        </footer>
    );
};

export default Footer;
