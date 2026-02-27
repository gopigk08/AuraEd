import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getGravatarUrl } from '../utils/gravatar';
import { User, Mail, Edit2, Save, X, BookOpen, Settings, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = ({ initialTab = 'settings' }) => {
    const { currentUser, setCurrentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isEditing, setIsEditing] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // Form State
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || '');
        }
    }, [currentUser]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Only update name, picture is handled automatically via Auth Provider or Gravatar
            const { data } = await api.put('/auth/me', { name });
            setCurrentUser(data); // Update context
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    // Determine Profile Picture
    const profilePic = currentUser.picture || currentUser.photoURL || getGravatarUrl(currentUser.email);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Cover Banner */}
            <div style={{
                height: '250px',
                background: 'linear-gradient(135deg, var(--primary-dark), var(--background))',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3), transparent 50%)'
                }}></div>
            </div>

            <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                {/* Profile Header Card */}
                <div className="glass-panel" style={{
                    padding: '2rem',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '2rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '150px', height: '150px',
                            borderRadius: '50%',
                            border: '4px solid var(--surface)',
                            background: 'var(--surface)',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}>
                            {!imageError ? (
                                <img
                                    src={profilePic}
                                    alt={currentUser.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        if (e.target.src !== getGravatarUrl(currentUser.email)) {
                                            e.target.src = getGravatarUrl(currentUser.email);
                                        } else {
                                            setImageError(true);
                                        }
                                    }}
                                />
                            ) : (
                                currentUser.name?.[0]?.toUpperCase()
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div style={{ flex: 1, marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{currentUser.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <Mail size={16} /> {currentUser.email}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}>
                                {currentUser.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={logout} className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                    {/* Sidebar Tabs */}
                    <div className="glass-panel" style={{ borderRadius: '16px', padding: '1rem', height: 'fit-content' }}>
                        <button
                            onClick={() => navigate('/profile')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'settings' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'settings' ? 600 : 400,
                                transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <Settings size={20} /> Profile Details
                        </button>
                    </div>

                    {/* Content */}
                    <div>
                        {activeTab === 'settings' && (
                            <div className="animate-fade-in glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ margin: 0 }}>Profile Settings</h2>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="btn btn-outline">
                                            <Edit2 size={16} /> Edit Profile
                                        </button>
                                    ) : (
                                        <button onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ color: 'var(--text-muted)' }}>
                                            <X size={18} /> Cancel
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleUpdateProfile}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={!isEditing}
                                                style={{ paddingLeft: '3rem', opacity: !isEditing ? 0.7 : 1 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={currentUser.email}
                                                disabled={true}
                                                style={{ paddingLeft: '3rem', opacity: 0.7, cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Email cannot be changed.</p>
                                    </div>

                                    {isEditing && (
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                            style={{ width: '100%' }}
                                        >
                                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                        </button>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
