import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, Bell, Check, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLayout } from '../context/LayoutContext';
import api from '../utils/api';
import { getGravatarUrl } from '../utils/gravatar';
import { getImageUrl } from '../utils/getImageUrl';

const Topbar = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();
    const { currentUser: user, logout } = useAuth();
    const { headerTitle, sidebarVisible } = useLayout();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    useEffect(() => {
        if (user) {
            setImgSrc(user.photoURL || (user.email ? getGravatarUrl(user.email) : null));
        }
    }, [user]);
    const [allCourses, setAllCourses] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const markAsRead = async (e, notificationId) => {
        e.stopPropagation();
        // Optimistically remove from list immediately
        setNotifications(prev => prev.filter(n => n._id !== notificationId));

        try {
            await api.put(`/notifications/${notificationId}/read`, { immediate: true });
        } catch (error) {
            console.error("Failed to mark as read");
            // Optionally revert if needed, but for "Mark as Read" it's usually fine to just ignore failure or retry silently
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await api.put(`/notifications/${notification._id}/read`);
                // Update local state to mark as read
                setNotifications(prev => prev.map(n =>
                    n._id === notification._id ? { ...n, isRead: true } : n
                ));
            }

            if (notification.relatedCourse) {
                navigate(`/courses/${notification.relatedCourse}`); // Fixed URL format
                setShowNotifDropdown(false);
            }
        } catch (error) {
            console.error("Failed to mark notification read");
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const endpoint = (user && user.role === 'admin') ? '/courses/all' : '/courses';
                const { data } = await api.get(endpoint);
                setAllCourses(data || []);
            } catch (error) {
                console.error('Failed to fetch courses for search');
            }
        };
        fetchCourses();

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCourses = searchQuery.trim() === ''
        ? []
        : allCourses.filter(course =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
        }
    };

    return (
        <header className={`topbar ${!sidebarVisible ? 'full-width' : ''}`}>
            {/* Left: Mobile Toggle & Header Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                {sidebarVisible && (
                    <button className="btn-icon mobile-only block md:hidden" onClick={onMenuClick} style={{ color: 'var(--text)' }}>
                        <Menu />
                    </button>
                )}
                {!sidebarVisible && (
                    <button className="btn-icon" onClick={() => navigate(-1)} style={{ color: 'var(--text)' }}>
                        {/* Back Button for Focus Mode */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                )}
                {headerTitle && !isMobileSearchExpanded && (
                    <h2 style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: headerTitle.length > 50 ? '1.1rem' : '1.5rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '800px',
                        background: 'linear-gradient(to right, var(--text), var(--text-muted))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }} className="hide-on-mobile">
                        {headerTitle}
                    </h2>
                )}
            </div>

            {/* Right: Actions & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, minWidth: 'fit-content', width: isMobileSearchExpanded ? '100%' : 'auto' }}>

                {/* Mobile Search Toggle Icon */}
                <button
                    className="btn-icon mobile-only block md:hidden search-toggle-btn"
                    onClick={() => {
                        setIsMobileSearchExpanded(!isMobileSearchExpanded);
                        if (!isMobileSearchExpanded) {
                            setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 100);
                        }
                    }}
                    style={isMobileSearchExpanded ? { display: 'none', color: 'var(--text)' } : { color: 'var(--text)' }}
                >
                    <Search size={20} />
                </button>

                {/* Search Bar */}
                <div
                    ref={searchRef}
                    style={{
                        position: isMobileSearchExpanded ? 'absolute' : 'relative',
                        width: '450px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    className={`search-container ${isMobileSearchExpanded ? 'mobile-expanded' : 'search-hidden-mobile'}`}
                >
                    <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--primary)', zIndex: 10 }} />
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                        }}
                        onKeyDown={handleSearch}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'var(--input-bg)',
                            color: 'var(--text)',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontSize: '0.95rem'
                        }}
                        onFocus={(e) => {
                            setShowDropdown(true);
                            e.target.style.background = 'var(--surface)';
                            e.target.style.borderColor = 'var(--primary)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            // Don't close immediately to allow clicking dropdown items
                            e.target.style.background = 'rgba(0,0,0,0.2)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />

                    {/* Close Search Button (Mobile Only) */}
                    {isMobileSearchExpanded && (
                        <button
                            className="mobile-only"
                            onClick={() => setIsMobileSearchExpanded(false)}
                            style={{ position: 'absolute', right: '12px', color: 'var(--text-muted)', zIndex: 10, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    )}

                    {/* Live Search Dropdown */}
                    {showDropdown && filteredCourses.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '110%',
                            left: 0,
                            width: '100%',
                            background: 'var(--surface)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {filteredCourses.map(course => (
                                <div
                                    key={course._id}
                                    onClick={() => {
                                        navigate(`/courses/${course._id}`);
                                        setShowDropdown(false);
                                        setSearchQuery('');
                                    }}
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border)',
                                        color: 'var(--text)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        background: 'var(--input-bg)',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <img
                                            src={getImageUrl(course.thumbnail)}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.3
                                        }}>
                                            {course.title}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                                {course.price === 0 ? 'Free' : `₹${course.price}`}
                                            </span>
                                            {course.duration && (
                                                <>
                                                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)' }}></span>
                                                    <span>{course.duration}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: isMobileSearchExpanded ? 'none' : 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={toggleTheme} className="btn-icon hover-scale" style={{
                        color: 'var(--text)',
                        padding: '0.6rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.2s'
                    }}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="relative" ref={notifRef}>
                        <button
                            className="btn-icon hover-scale"
                            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                            style={{
                                color: 'var(--text)',
                                padding: '0.6rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    border: '2px solid var(--surface)'
                                }}>{unreadCount}</span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifDropdown && (
                            <div className="glass-panel animate-fade-in" style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                width: '320px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                borderRadius: '12px',
                                padding: '0.5rem',
                                zIndex: 100,
                                border: '1px solid var(--border)',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>Notifications</h4>
                                </div>

                                {notifications.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No notifications
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {notifications.map(notif => (
                                            <div
                                                key={notif._id}
                                                onClick={() => handleNotificationClick(notif)}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    background: 'rgba(var(--primary-rgb), 0.1)',
                                                    cursor: 'pointer',
                                                    borderLeft: '3px solid var(--primary)',
                                                    transition: 'all 0.2s',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.5rem'
                                                }}
                                                className="hover:bg-white/5"
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: 'bold',
                                                            color: notif.type === 'offer' ? '#f59e0b' : notif.type === 'warning' ? '#ef4444' : 'var(--primary)',
                                                            textTransform: 'uppercase',
                                                            background: 'rgba(0,0,0,0.2)',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            {notif.type}
                                                        </span>
                                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {/* Mark as Read Button - Absolute Top Right */}
                                                    {!notif.isRead && (
                                                        <button
                                                            onClick={(e) => markAsRead(e, notif._id)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '12px',
                                                                right: '12px',
                                                                border: 'none',
                                                                background: 'none',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                color: 'var(--primary)',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                zIndex: 10
                                                            }}
                                                            className="hover-bg-primary-subtle"
                                                            onMouseEnter={(e) => e.target.style.background = 'rgba(var(--primary-rgb), 0.1)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                        >
                                                            Mark as Read
                                                        </button>
                                                    )}
                                                </div>

                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', color: 'var(--text)', paddingRight: '80px' }}>
                                                        {/* Padding Right to avoid overlap with button */}
                                                        {notif.title}
                                                    </h5>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                                        {notif.message}
                                                    </p>

                                                    {/* Offer Type: Show Course Cards */}
                                                    {notif.type === 'offer' && notif.relatedCourses && notif.relatedCourses.length > 0 && (
                                                        <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                            {notif.relatedCourses.map((course, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Prevent parent click
                                                                        navigate(`/courses/${course._id}`);
                                                                        setShowNotifDropdown(false);
                                                                    }}
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.75rem',
                                                                        background: 'rgba(0,0,0,0.2)',
                                                                        padding: '0.5rem',
                                                                        borderRadius: '6px',
                                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                                        cursor: 'pointer',
                                                                        transition: 'background 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                                                                >
                                                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                                                        <img
                                                                            src={getImageUrl(course.thumbnail)}
                                                                            alt=""
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                            onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
                                                                        />
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                            {course.title}
                                                                        </div>
                                                                        <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>
                                                                            {course.price === 0 ? 'Free' : `₹${course.price}`}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {user && (
                    <div ref={profileRef} style={{ position: 'relative', display: isMobileSearchExpanded ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                        <div
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            style={{
                                width: '40px', height: '40px',
                                borderRadius: '12px',
                                background: imgSrc ? 'transparent' : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '1rem', fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                cursor: 'pointer'
                            }}>
                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt={user.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    referrerPolicy="no-referrer"
                                    onError={() => {
                                        if (imgSrc === user.photoURL && user.email) {
                                            setImgSrc(getGravatarUrl(user.email));
                                        } else {
                                            setImgSrc(null);
                                        }
                                    }}
                                />
                            ) : (
                                user.name?.[0]?.toUpperCase()
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        {showProfileDropdown && (
                            <div className="glass-panel animate-fade-in" style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                width: '220px',
                                borderRadius: '12px',
                                padding: '0.5rem',
                                zIndex: 100,
                                border: '1px solid var(--border)',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                            }}>
                                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                                </div>

                                <button
                                    onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}
                                    style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', width: '100%' }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <User size={16} /> View Profile
                                </button>

                                <button
                                    onClick={() => { setShowProfileDropdown(false); navigate('/dashboard'); }}
                                    style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', width: '100%' }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <LayoutDashboard size={16} /> Dashboard
                                </button>

                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }}></div>

                                <button
                                    onClick={() => { setShowProfileDropdown(false); logout(); navigate('/'); }}
                                    style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', width: '100%' }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
