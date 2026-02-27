import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGravatarUrl } from '../utils/gravatar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Home, BookOpen, GraduationCap, LayoutDashboard, Layout,
    LogOut, UserCircle, X, Shield, Sun, Moon
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { currentUser: user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        if (user) {
            setImgSrc(user.photoURL || (user.email ? getGravatarUrl(user.email) : null));
        }
    }, [user]);

    const links = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Browse Courses', path: '/courses', icon: BookOpen },
    ];

    if (user) {
        if (user.role !== 'admin') {
            links.push({ name: 'Dashboard', path: '/dashboard', icon: Layout });
        }
        links.push({ name: 'Profile', path: '/profile', icon: UserCircle });
        if (user.role === 'admin') {
            links.push({ name: 'Admin Dashboard', path: '/admin', icon: Shield });
        }
    }

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header / Logo */}
                <div className="sidebar-logo-container">
                    <Link to="/" style={{ display: 'block' }}>
                        <img src="/banner-removebg-preview.png" alt="AuraEd" className="sidebar-logo" />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.path);
                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={onClose}
                                        className={`nav-item ${active ? 'active' : ''}`}
                                    >
                                        <Icon size={20} className="nav-icon" />
                                        <span className="nav-text">{link.name}</span>
                                        {active && <div className="active-indicator" />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom User Section */}
                {user ? (
                    <div className="sidebar-footer">
                        <div className="user-card">
                            <div className="user-avatar">
                                {imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt={user.name}
                                        className="user-avatar-img"
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
                                    user.name?.[0]?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="user-info">
                                <p className="user-name">{user.name || 'User'}</p>
                                <p className="user-email" title={user.email}>{user.email}</p>
                            </div>
                        </div>

                        <button onClick={logout} className="btn-logout">
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <div className="sidebar-footer">
                        <Link to="/login" className="btn btn-primary w-full">
                            Login
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
