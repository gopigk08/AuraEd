import { Link } from 'react-router-dom';
import { User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser: user, logout } = useAuth();

    return (
        <nav className="navbar" style={{
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-gradient">
                    AuraEd
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/courses">All Courses</Link>
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link to="/profile">My Learning</Link>
                            <Link to="/dashboard">Dashboard</Link>
                            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                            <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
