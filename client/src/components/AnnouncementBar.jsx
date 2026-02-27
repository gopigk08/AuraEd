import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Megaphone, X } from 'lucide-react';

const AnnouncementBar = () => {
    const [announcement, setAnnouncement] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const { data } = await api.get('/settings/announcement');
                if (data && data.value) {
                    // Check if user dismissed it this session
                    const dismissed = sessionStorage.getItem(`announcement_dismissed_${data.updatedAt}`);
                    if (!dismissed) {
                        setAnnouncement(data.value);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load announcement", error);
            }
        };

        fetchAnnouncement();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // We use the exact text as part of the key so if admin updates it, it shows again
        sessionStorage.setItem(`announcement_dismissed_${announcement}`, 'true');
    };

    if (!isVisible || !announcement) return null;

    return (
        <div style={{
            background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
            color: 'white',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <Megaphone size={16} />
            <span style={{ flex: 1 }}>{announcement}</span>
            <button
                onClick={handleDismiss}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default AnnouncementBar;
