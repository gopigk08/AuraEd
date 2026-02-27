import React from 'react';
import { Users, UserPlus, BookOpen, DollarSign } from 'lucide-react';

const DashboardWidgets = () => {
    // Dummy data - in a real app, these would come from props or API
    const stats = [
        {
            title: 'Total Students',
            count: '3,280',
            change: '80% increase in 20 Days',
            icon: Users,
            color: 'var(--admin-users-color)',
            progress: 80
        },
        {
            title: 'New Students',
            count: '245',
            change: '50% increase in 25 Days',
            icon: UserPlus,
            color: 'var(--admin-new-users-color)',
            progress: 50
        },
        {
            title: 'Total Course',
            count: '28',
            change: '76% increase in 20 Days',
            icon: BookOpen,
            color: 'var(--admin-courses-color)',
            progress: 76
        },
        {
            title: 'Fees Collection',
            count: '25,160$',
            change: '30% increase in 30 Days',
            icon: DollarSign,
            color: 'var(--admin-fees-color)',
            progress: 30
        },
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="stat-card" style={{ background: stat.color }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="stat-icon-wrapper">
                                    <Icon size={24} color="white" />
                                </div>
                                <div className="stat-info" style={{ textAlign: 'right' }}>
                                    <p>{stat.title.toUpperCase()}</p>
                                    <h3>{stat.count}</h3>
                                </div>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${stat.progress}%` }}></div>
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{stat.change}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardWidgets;
