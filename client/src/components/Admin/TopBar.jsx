import React from 'react';
import { Search, Bell, Moon, MessageSquare, Menu } from 'lucide-react';

const TopBar = ({ toggleSidebar }) => {
    return (
        <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="icon-btn" onClick={toggleSidebar} style={{ display: 'none' }}>
                    <Menu size={24} />
                </button>
                <div className="search-bar">
                    <Search size={18} color="#b2bec3" />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>
            </div>

            <div className="topbar-actions">
                <div className="icon-btn">
                    <Moon size={20} />
                </div>
                <div className="icon-btn">
                    <MessageSquare size={20} />
                    <span className="badge">5</span>
                </div>
                <div className="icon-btn">
                    <Bell size={20} />
                    <span className="badge">8</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 'bold' }}>Admin User</div>
                        <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>Administrator</div>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#dfe6e9',
                        overflow: 'hidden'
                    }}>
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=6c5ce7&color=fff" alt="Profile" width="100%" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
