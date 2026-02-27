import React from 'react';
import { LayoutDashboard, Users, BookOpen, Bell, Settings, LogOut, GraduationCap, Calendar, FileText } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'professors', label: 'Professors', icon: GraduationCap },
        { id: 'events', label: 'Event Management', icon: Calendar },
        { id: 'library', label: 'Library', icon: FileText },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="brand-logo">
                    <GraduationCap size={28} />
                    <span>EDUMIN</span>
                </div>
            </div>

            <div className="sidebar-menu">
                <div className="menu-section-label">Main Menu</div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    );
                })}

                <div className="menu-section-label">Settings</div>
                <div className="menu-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
                <div className="menu-item" style={{ color: '#ff7675' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
