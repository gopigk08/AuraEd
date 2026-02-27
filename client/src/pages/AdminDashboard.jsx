import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash, ChevronDown, ChevronUp, Video, Bell, Send, Timer, Hammer, BookOpen, Settings, Users, Ticket, CreditCard } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({
        title: '', description: '', price: '', originalPrice: '', thumbnail: '', videoUrl: '', introVideos: [], sections: [], published: false
    });
    const newCourseFormRef = useRef(null);
    const [activeTab, setActiveTab] = useState('courses'); // Default to functional tab
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({
        title: '', message: '', type: 'info', recipient: 'all', relatedCourses: []
    });
    const [users, setUsers] = useState([]);
    const [manualEnrollEmail, setManualEnrollEmail] = useState('');
    const [manualEnrollCourse, setManualEnrollCourse] = useState('');

    const [bunnyConfig, setBunnyConfig] = useState({ apiKey: '', libraryId: '', collectionId: '' });
    const [bunnyVideos, setBunnyVideos] = useState([]);
    const [loadingBunny, setLoadingBunny] = useState(false);

    // Maintenance Mode State
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    // Global Announcement State
    const [globalAnnouncement, setGlobalAnnouncement] = useState('');

    // Coupon State
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({
        code: '', discountPercentage: '', maxUses: '', validUntil: ''
    });

    // Payments State
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [maintRes, annRes] = await Promise.all([
                    api.get('/settings/maintenance'),
                    api.get('/settings/announcement')
                ]);
                setMaintenanceMode(maintRes.data?.value === true);
                setGlobalAnnouncement(annRes.data?.value || '');
            } catch (error) {
                console.error("Failed to fetch settings");
            }
        };
        fetchSettings();
    }, []);

    const toggleMaintenanceMode = async () => {
        try {
            const newValue = !maintenanceMode;
            await api.post('/settings', { key: 'maintenance', value: newValue });
            setMaintenanceMode(newValue);
            toast.success(`Maintenance Mode ${newValue ? 'Enabled' : 'Disabled'}`);
        } catch (error) {
            toast.error('Failed to update maintenance mode');
        }
    };

    const handleUpdateAnnouncement = async () => {
        try {
            await api.post('/settings', { key: 'announcement', value: globalAnnouncement });
            toast.success('Global announcement updated directly!');
        } catch (error) {
            toast.error('Failed to update announcement');
        }
    };

    const fetchBunnyVideos = async (e) => {
        e.preventDefault();
        setLoadingBunny(true);
        try {
            const { data } = await api.post('/bunny/videos', bunnyConfig);
            setBunnyVideos(data.items || []);
            toast.success(`Fetched ${data.items?.length || 0} videos`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch videos. Check credentials.');
        } finally {
            setLoadingBunny(false);
        }
    };

    // Curriculum Helpers
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (index) => {
        setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const addSection = () => {
        setCurrentCourse(prev => ({
            ...prev,
            sections: [...prev.sections, { group: '', title: 'New Section', lectures: [] }]
        }));
    };

    const updateSectionTitle = (index, title) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], title };
            return { ...prev, sections: newSections };
        });
    };

    const updateSectionGroup = (index, group) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], group };
            return { ...prev, sections: newSections };
        });
    };

    const removeSection = (index) => {
        if (!window.confirm('Remove this section?')) return;
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index, 1);
            return { ...prev, sections: newSections };
        });
    };

    const addLecture = (sectionIndex) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            const targetSection = { ...newSections[sectionIndex] };
            targetSection.lectures = [...targetSection.lectures, { title: 'New Lecture', videoUrl: '', duration: '', freePreview: false, notes: [] }];
            newSections[sectionIndex] = targetSection;
            return { ...prev, sections: newSections };
        });
    };

    const updateLecture = (sectionIndex, lectureIndex, field, value) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            const targetSection = { ...newSections[sectionIndex] };
            const targetLecture = { ...targetSection.lectures[lectureIndex], [field]: value };
            const newLectures = [...targetSection.lectures];
            newLectures[lectureIndex] = targetLecture;
            targetSection.lectures = newLectures;
            newSections[sectionIndex] = targetSection;
            return { ...prev, sections: newSections };
        });
    };

    const removeLecture = (sectionIndex, lectureIndex) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            const targetSection = { ...newSections[sectionIndex] };
            const newLectures = [...targetSection.lectures];
            newLectures.splice(lectureIndex, 1);
            targetSection.lectures = newLectures;
            newSections[sectionIndex] = targetSection;
            return { ...prev, sections: newSections };
        });
    };

    const addNote = (sectionIndex, lectureIndex) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            const targetSection = { ...newSections[sectionIndex] };
            const newLectures = [...targetSection.lectures];
            const targetLecture = { ...newLectures[lectureIndex] };
            targetLecture.notes = [...(targetLecture.notes || []), { title: 'New Note', url: '' }];
            newLectures[lectureIndex] = targetLecture;
            targetSection.lectures = newLectures;
            newSections[sectionIndex] = targetSection;
            return { ...prev, sections: newSections };
        });
    };

    const updateNote = (sectionIndex, lectureIndex, noteIndex, field, value) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            const targetSection = { ...newSections[sectionIndex] };
            const newLectures = [...targetSection.lectures];
            const targetLecture = { ...newLectures[lectureIndex] };
            const newNotes = [...(targetLecture.notes || [])];
            newNotes[noteIndex] = { ...newNotes[noteIndex], [field]: value };
            targetLecture.notes = newNotes;
            newLectures[lectureIndex] = targetLecture;
            targetSection.lectures = newLectures;
            newSections[sectionIndex] = targetSection;
            return { ...prev, sections: newSections };
        });
    };

    const removeNote = (sectionIndex, lectureIndex, noteIndex) => {
        setCurrentCourse(prev => {
            const newSections = [...prev.sections];
            const targetSection = { ...newSections[sectionIndex] };
            const newLectures = [...targetSection.lectures];
            const targetLecture = { ...newLectures[lectureIndex] };
            const newNotes = [...(targetLecture.notes || [])];
            newNotes.splice(noteIndex, 1);
            targetLecture.notes = newNotes;
            newLectures[lectureIndex] = targetLecture;
            targetSection.lectures = newLectures;
            newSections[sectionIndex] = targetSection;
            return { ...prev, sections: newSections };
        });
    };

    // Data Fetching
    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses/all');
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const fetchAllNotifications = async () => {
        try {
            const { data } = await api.get('/notifications/all');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        }
    };

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payment/all');
            setPayments(data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchAllNotifications();
        fetchUsers();
        fetchCoupons();
        fetchPayments();
    }, []);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const courseData = { ...currentCourse };
            if (courseData.originalPrice) {
                courseData.originalPrice = Number(courseData.originalPrice);
            } else {
                courseData.originalPrice = null;
            }

            if (isEditing) {
                await api.put(`/courses/${currentCourse._id}`, courseData);
                toast.success('Course updated');
            } else {
                await api.post('/courses', courseData);
                toast.success('Course created');
            }
            setIsEditing(false);
            setCurrentCourse({ title: '', description: '', price: '', originalPrice: '', thumbnail: '', videoUrl: '', introVideos: [], sections: [], published: false });
            fetchCourses();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success('Course deleted');
            fetchCourses();
        } catch (error) {
            toast.error('Failed to delete course');
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        try {
            await api.post('/notifications', newNotification);
            toast.success('Notification Sent');
            setNewNotification({ title: '', message: '', type: 'info', recipient: 'all', relatedCourses: [] });
            fetchAllNotifications();
        } catch (error) {
            toast.error('Failed to send notification');
        }
    };

    const handleDeleteNotification = async (id) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            await api.delete(`/notifications/${id}`);
            toast.success('Notification deleted');
            fetchAllNotifications();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleClearAllNotifications = async () => {
        if (!window.confirm('Delete ALL notifications?')) return;
        try {
            await api.delete('/notifications/all');
            toast.success('All notifications cleared');
            fetchAllNotifications();
        } catch (error) {
            toast.error('Failed to clear notifications');
        }
    };

    const handleManualEnroll = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/enroll-manual', { email: manualEnrollEmail, courseId: manualEnrollCourse });
            toast.success("Enrolled successfully");
            setManualEnrollEmail('');
            setManualEnrollCourse('');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleForceLogout = async (uid) => {
        if (!window.confirm("Are you sure you want to log out this user from all their devices?")) return;
        try {
            const { data } = await api.post(`/users/${uid}/force-logout`);
            toast.success(data.message || 'User logged out');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to force logout');
        }
    };

    // --- Coupon Handlers ---
    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', newCoupon);
            toast.success('Coupon created successfully');
            setNewCoupon({ code: '', discountPercentage: '', maxUses: '', validUntil: '' });
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const handleToggleCoupon = async (id) => {
        try {
            await api.patch(`/coupons/${id}/toggle`);
            toast.success('Coupon status updated');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to update coupon status');
        }
    };

    // --- Payment Handlers ---
    const handleRefund = async (id) => {
        if (!window.confirm("Are you sure you want to refund this payment? This will revoke the user's access to the course.")) return;

        const toastId = toast.loading('Processing refund via Razorpay...');
        try {
            const { data } = await api.post(`/payment/refund/${id}`);
            toast.success(data.message || 'Refund successful', { id: toastId });
            fetchPayments();
            fetchUsers(); // To update access UI
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to process refund', { id: toastId });
        }
    };

    const handleUploadThumbnail = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading thumbnail...');

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // data is the path string, e.g. "/uploads/image-123.jpg"
            // We need to construct the full URL
            const serverUrl = `http://${window.location.hostname}:5000`;
            setCurrentCourse({ ...currentCourse, thumbnail: `${serverUrl}${data}` });
            toast.success('Thumbnail uploaded!', { id: toastId });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload thumbnail', { id: toastId });
        }
    };

    // Helper to format duration
    const formatDuration = (seconds) => {
        const totalSeconds = Math.round(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}hr ${minutes > 0 ? minutes + 'mins' : ''}`.trim();
        }
        return `${minutes}mins`;
    };

    const fetchLectureDetails = async (sectionIndex, lectureIndex, videoUrl) => {
        if (!videoUrl) return;

        // Try to extract Video ID and Library ID (if possible from URL, otherwise use config)
        // Common URL: https://iframe.mediadelivery.net/play/{libraryId}/{videoId} or https://player.mediadelivery.net/embed/{libraryId}/{videoId}
        let videoId = '';
        let libId = bunnyConfig.libraryId; // Default to config

        const regex = /(?:play|embed)\/(\d+)\/([a-zA-Z0-9-]+)/;
        const match = videoUrl.match(regex);
        if (match) {
            libId = match[1];
            videoId = match[2];
        }

        // Check for m3u8 URLs to use the generic parser
        if (videoUrl.includes('.m3u8')) {
            const toastId = toast.loading('Parsing m3u8 duration...');
            try {
                const { data } = await api.post('/settings/m3u8-duration', { url: videoUrl });
                if (data.length) {
                    const formattedDuration = formatDuration(data.length);
                    updateLecture(sectionIndex, lectureIndex, 'duration', formattedDuration);
                    toast.success('Duration auto-fetched!', { id: toastId });
                } else {
                    toast.error('Could not determine duration from m3u8', { id: toastId });
                }
            } catch (error) {
                console.error("m3u8 parse error", error);
                toast.error('Failed to parse m3u8 file', { id: toastId });
            }
            return;
        }

        // Check for other generic URLs to skip auto-fetch
        if (videoUrl.includes('drive.google.com') || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            // Retrieve duration if possible or just return
            // For now, just skip the error
            return;
        }

        if (!videoId || !libId || !bunnyConfig.apiKey) {
            toast.error('Cannot auto-fetch. Ensure URL is valid and API Key is set in "Video Library" tab.');
            return;
        }

        const toastId = toast.loading('Fetching video details...');

        try {
            const { data } = await api.post('/bunny/video-details', {
                apiKey: bunnyConfig.apiKey,
                libraryId: libId,
                videoId: videoId
            });

            // Update Lecture
            setCurrentCourse(prev => {
                const newSections = [...prev.sections];
                const targetSection = { ...newSections[sectionIndex] };
                const newLectures = [...targetSection.lectures];
                const targetLecture = { ...newLectures[lectureIndex] };

                targetLecture.duration = formatDuration(data.length);
                // Optional: Update title if empty? Let's just update duration for now as requested.
                // targetLecture.title = data.title; 

                newLectures[lectureIndex] = targetLecture;
                targetSection.lectures = newLectures;
                newSections[sectionIndex] = targetSection;
                return { ...prev, sections: newSections };
            });
            toast.success('Duration updated!', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch details', { id: toastId });
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', paddingBottom: '1rem' }}>
                    Admin Dashboard
                </h1>

                {/* Main Content Area using Profile Layout */}
                <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                    {/* Sidebar Tabs */}
                    <div className="glass-panel" style={{ borderRadius: '16px', padding: '1rem', height: 'fit-content' }}>
                        <button
                            onClick={() => setActiveTab('courses')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'courses' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'courses' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'courses' ? 600 : 400,
                                marginBottom: '0.5rem', transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <BookOpen size={20} /> Course Management
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'notifications' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'notifications' ? 600 : 400,
                                marginBottom: '0.5rem', transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <Bell size={20} /> Notification Center
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'videos' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'videos' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'videos' ? 600 : 400,
                                marginBottom: '0.5rem', transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <Video size={20} /> Video Library
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'settings' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'settings' ? 600 : 400,
                                transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <Settings size={20} /> Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('students')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'students' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'students' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'students' ? 600 : 400,
                                transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left',
                                marginBottom: '0.5rem'
                            }}
                        >
                            <Users size={20} /> Student Management
                        </button>
                        <button
                            onClick={() => setActiveTab('coupons')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'coupons' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'coupons' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'coupons' ? 600 : 400,
                                transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left',
                                marginBottom: '0.5rem'
                            }}
                        >
                            <Ticket size={20} /> Coupons
                        </button>
                        <button
                            onClick={() => setActiveTab('transactions')}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '12px',
                                background: activeTab === 'transactions' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'transactions' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'transactions' ? 600 : 400,
                                transition: '0.2s', border: 'none', cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <CreditCard size={20} /> Transactions & Refunds
                        </button>
                    </div>

                    {/* Content Area */}
                    <div style={{ minWidth: 0 }}>


                        {/* Courses Tab */}
                        {activeTab === 'courses' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {/* Left: Course List */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Courses</h2>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setCurrentCourse({ title: '', description: '', price: '', originalPrice: '', thumbnail: '', videoUrl: '', introVideos: [], sections: [], published: false });
                                                setExpandedSections({});
                                                // Scroll to form and focus first input
                                                if (newCourseFormRef.current) {
                                                    setTimeout(() => {
                                                        newCourseFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        const firstInput = newCourseFormRef.current.querySelector('input');
                                                        if (firstInput) firstInput.focus();
                                                    }, 100);
                                                }
                                            }}
                                            style={{ background: '#00b894', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <Plus size={16} /> New
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {courses.map(course => (
                                            <div key={course._id} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
                                                <img
                                                    src={getImageUrl(course.thumbnail)}

                                                    alt={course.title}
                                                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.8rem' }}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                                />
                                                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                                                    {course.title}
                                                    <span style={{ marginLeft: '8px', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: course.published ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', color: course.published ? '#4CAF50' : '#FF9800', border: `1px solid ${course.published ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`, verticalAlign: 'middle', display: 'inline-block' }}>
                                                        {course.published ? 'Live' : 'Draft'}
                                                    </span>
                                                </h3>
                                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{course.description.substring(0, 60)}...</p>
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                    <button
                                                        onClick={() => { setIsEditing(true); setCurrentCourse(course); setExpandedSections({}); }}
                                                        style={{ flex: 1, background: '#f1f2f6', color: '#2d3436', border: '1px solid #ddd', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '5px' }}
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        style={{ flex: 1, background: '#fff0f0', color: '#d63031', border: '1px solid #ffcccc', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '5px' }}
                                                    >
                                                        <Trash size={14} /> Del
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Course Form & Curriculum */}
                                <div ref={newCourseFormRef} style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)' }}>
                                        {isEditing ? 'Edit Course' : 'Create New Course'}
                                    </h2>

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {/* Basic Details */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Course Title</label>
                                            <input
                                                value={currentCourse.title}
                                                onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                                                placeholder="Enter course title"
                                                required
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Description</label>
                                            <textarea
                                                value={currentCourse.description}
                                                onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                                                placeholder="Enter course description"
                                                required
                                                rows={3}
                                                className="form-input"
                                                style={{ fontFamily: 'inherit', borderRadius: '6px' }}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <label style={{ fontWeight: '500' }}>Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={currentCourse.price}
                                                    onChange={e => setCurrentCourse({ ...currentCourse, price: e.target.value })}
                                                    required
                                                    className="form-input"
                                                    style={{ borderRadius: '6px' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <label style={{ fontWeight: '500' }}>Original Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={currentCourse.originalPrice || ''}
                                                    onChange={e => setCurrentCourse({ ...currentCourse, originalPrice: e.target.value })}
                                                    className="form-input"
                                                    style={{ borderRadius: '6px' }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Thumbnail URL</label>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input
                                                    value={currentCourse.thumbnail}
                                                    onChange={e => setCurrentCourse({ ...currentCourse, thumbnail: e.target.value })}
                                                    placeholder="https://..."
                                                    className="form-input"
                                                    style={{ flex: 1, borderRadius: '6px' }}
                                                />
                                                <input
                                                    type="file"
                                                    id="thumbnail-upload"
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={handleUploadThumbnail}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('thumbnail-upload').click()}
                                                    style={{
                                                        padding: '0 1rem',
                                                        background: 'var(--surface-hover)',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        color: 'var(--text)'
                                                    }}
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </div>

                                        {/* Thumbnail Preview */}
                                        {currentCourse.thumbnail && (
                                            <div style={{ marginTop: '-0.5rem' }}>
                                                <img
                                                    src={currentCourse.thumbnail}
                                                    alt="Thumbnail preview"
                                                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                    onError={e => { e.target.style.display = 'none'; }}
                                                    onLoad={e => { e.target.style.display = 'block'; }}
                                                />
                                            </div>
                                        )}

                                        {/* Published Toggle */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                            <input
                                                type="checkbox"
                                                id="published-toggle"
                                                checked={currentCourse.published || false}
                                                onChange={e => setCurrentCourse({ ...currentCourse, published: e.target.checked })}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                            />
                                            <label htmlFor="published-toggle" style={{ fontWeight: '500', cursor: 'pointer', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <span>Course Live Status</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>
                                                    {currentCourse.published ? 'Live: Visible/Purchasable by everyone.' : 'Hidden: Only visible in this dashboard.'}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Intro Videos – multi-section builder */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label style={{ fontWeight: '500' }}>Intro Videos</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentCourse(prev => ({
                                                        ...prev,
                                                        introVideos: [...(prev.introVideos || []), { title: 'Intro', url: '' }]
                                                    }))}
                                                    style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                                >
                                                    + Add Video
                                                </button>
                                            </div>
                                            {(!currentCourse.introVideos || currentCourse.introVideos.length === 0) && (
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                                                    No intro videos. Click "+ Add Video" to add YouTube, m3u8, Bunny, or Drive links.
                                                </p>
                                            )}
                                            {(currentCourse.introVideos || []).map((vid, vIdx) => (
                                                <div key={vIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <input
                                                        value={vid.title}
                                                        onChange={e => setCurrentCourse(prev => {
                                                            const arr = [...(prev.introVideos || [])];
                                                            arr[vIdx] = { ...arr[vIdx], title: e.target.value };
                                                            return { ...prev, introVideos: arr };
                                                        })}
                                                        placeholder="Label (e.g. Trailer)"
                                                        className="form-input"
                                                        style={{ flex: '0 0 120px', borderRadius: '6px', fontSize: '0.85rem' }}
                                                    />
                                                    <input
                                                        value={vid.url}
                                                        onChange={e => setCurrentCourse(prev => {
                                                            const arr = [...(prev.introVideos || [])];
                                                            arr[vIdx] = { ...arr[vIdx], url: e.target.value };
                                                            return { ...prev, introVideos: arr };
                                                        })}
                                                        placeholder="YouTube / m3u8 / Bunny / Drive URL"
                                                        className="form-input"
                                                        style={{ flex: 1, borderRadius: '6px', fontSize: '0.85rem' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentCourse(prev => {
                                                            const arr = [...(prev.introVideos || [])];
                                                            arr.splice(vIdx, 1);
                                                            return { ...prev, introVideos: arr };
                                                        })}
                                                        style={{ color: '#d63031', background: 'rgba(214,48,49,0.1)', border: 'none', borderRadius: '4px', padding: '0.4rem 0.6rem', cursor: 'pointer' }}
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                                        {/* Curriculum Builder */}
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Curriculum Builder</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {currentCourse.sections?.map((section, sIndex) => (
                                                    <div key={sIndex} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Section {sIndex + 1}:</span>
                                                                    <input
                                                                        value={section.title}
                                                                        onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                                                                        className="form-input"
                                                                        style={{ flex: 1, borderRadius: '4px', padding: '0.5rem' }}
                                                                        placeholder="Section Title"
                                                                    />
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.5rem' }}>
                                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', width: '70px' }}>Group Tag:</span>
                                                                    <input
                                                                        value={section.group || ''}
                                                                        onChange={(e) => updateSectionGroup(sIndex, e.target.value)}
                                                                        className="form-input"
                                                                        style={{ flex: 1, borderRadius: '4px', padding: '0.4rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)' }}
                                                                        placeholder="e.g., JAVA DATA STRUCTURES & ALGORITHMS (Optional)"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                                                                <button type="button" onClick={() => toggleSection(sIndex)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                                                    {expandedSections[sIndex] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                                </button>
                                                                <button type="button" onClick={() => removeSection(sIndex)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#d63031' }}>
                                                                    <Trash size={18} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {expandedSections[sIndex] && (
                                                            <div style={{ padding: '1rem', background: 'var(--surface)' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                                    {section.lectures.map((lecture, lIndex) => (
                                                                        <div key={lIndex} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
                                                                                <div style={{ flex: '1 1 200px' }}>
                                                                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Lecture Title</label>
                                                                                    <input
                                                                                        value={lecture.title}
                                                                                        onChange={(e) => updateLecture(sIndex, lIndex, 'title', e.target.value)}
                                                                                        className="form-input"
                                                                                        style={{ width: '100%', borderRadius: '4px', padding: '0.5rem' }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ flex: '2 1 250px' }}>
                                                                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Video URL</label>
                                                                                    <input
                                                                                        value={lecture.videoUrl}
                                                                                        onChange={(e) => updateLecture(sIndex, lIndex, 'videoUrl', e.target.value)}
                                                                                        onBlur={() => {
                                                                                            if (lecture.videoUrl && !lecture.duration) {
                                                                                                fetchLectureDetails(sIndex, lIndex, lecture.videoUrl);
                                                                                            }
                                                                                        }}
                                                                                        className="form-input"
                                                                                        style={{ width: '100%', borderRadius: '4px', padding: '0.5rem' }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ flex: '0 0 160px' }}>
                                                                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Duration</label>
                                                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                                                        <input
                                                                                            value={lecture.duration || ''}
                                                                                            onChange={(e) => updateLecture(sIndex, lIndex, 'duration', e.target.value)}
                                                                                            placeholder="10:05"
                                                                                            className="form-input"
                                                                                            style={{ width: '100%', borderRadius: '4px', padding: '0.5rem' }}
                                                                                        />
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => fetchLectureDetails(sIndex, lIndex, lecture.videoUrl)}
                                                                                            title="Auto-fetch duration"
                                                                                            style={{
                                                                                                background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px',
                                                                                                padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                                            }}
                                                                                        >
                                                                                            <Timer size={16} />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Demo toggle */}
                                                                                <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                                                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: lecture.freePreview ? '#00b894' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>Demo</label>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={!!lecture.freePreview}
                                                                                        onChange={e => updateLecture(sIndex, lIndex, 'freePreview', e.target.checked)}
                                                                                        title="Mark as demo – visible to non-enrolled users"
                                                                                        style={{ width: '18px', height: '18px', accentColor: '#00b894', cursor: 'pointer' }}
                                                                                    />
                                                                                </div>
                                                                                <button type="button" onClick={() => removeLecture(sIndex, lIndex)} style={{ flex: '0 0 auto', color: '#d63031', border: 'none', background: 'rgba(214, 48, 49, 0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', borderRadius: '4px', height: 'fit-content' }}>
                                                                                    <Trash size={16} />
                                                                                </button>
                                                                            </div>

                                                                            {/* Notes Section within Lecture (Simplified) */}
                                                                            <div style={{ marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid #ddd' }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Notes/Resources</span>
                                                                                    <button type="button" onClick={() => addNote(sIndex, lIndex)} style={{ fontSize: '0.8rem', color: '#0984e3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>+ Add Note</button>
                                                                                </div>
                                                                                {lecture.notes?.map((note, nIndex) => (
                                                                                    <div key={nIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                                        <input
                                                                                            value={note.title}
                                                                                            onChange={(e) => updateNote(sIndex, lIndex, nIndex, 'title', e.target.value)}
                                                                                            placeholder="Note Title"
                                                                                            className="form-input"
                                                                                            style={{ flex: 1, borderRadius: '4px', fontSize: '0.9rem', padding: '0.4rem' }}
                                                                                        />
                                                                                        <input
                                                                                            value={note.url}
                                                                                            onChange={(e) => updateNote(sIndex, lIndex, nIndex, 'url', e.target.value)}
                                                                                            placeholder="URL (PDF/Link)"
                                                                                            className="form-input"
                                                                                            style={{ flex: 2, borderRadius: '4px', fontSize: '0.9rem', padding: '0.4rem' }}
                                                                                        />
                                                                                        <button type="button" onClick={() => removeNote(sIndex, lIndex, nIndex)} style={{ color: '#d63031', border: 'none', background: 'none', cursor: 'pointer' }}>
                                                                                            <Trash size={14} />
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <button type="button" onClick={() => addLecture(sIndex)} style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--border)', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>
                                                                        + Add Lecture
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <button type="button" onClick={addSection} style={{ padding: '0.75rem', background: 'var(--surface-hover)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                    + Add Section
                                                </button>
                                            </div>
                                        </div>

                                        <button type="submit" style={{ marginTop: '2rem', padding: '1rem', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                                            {isEditing ? 'Update Course' : 'Create Course'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)' }}>Send Notification</h2>
                                    <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Title</label>
                                            <input
                                                value={newNotification.title}
                                                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                                required
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Message</label>
                                            <textarea
                                                value={newNotification.message}
                                                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                                required
                                                rows={3}
                                                className="form-input"
                                                style={{ fontFamily: 'inherit', borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Type</label>
                                            <select
                                                value={newNotification.type}
                                                onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            >
                                                <option value="info">Info</option>
                                                <option value="warning">Warning</option>
                                                <option value="success">Success</option>
                                                <option value="offer">Offer</option>
                                            </select>
                                        </div>

                                        {/* Multi-Select Courses for Offer Type */}
                                        {newNotification.type === 'offer' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <label style={{ fontWeight: '500' }}>Select Courses (Multiple)</label>
                                                <div style={{
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '6px',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    padding: '0.5rem'
                                                }}>
                                                    {courses.map(course => (
                                                        <div key={course._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <input
                                                                type="checkbox"
                                                                id={`course-${course._id}`}
                                                                checked={newNotification.relatedCourses.includes(course._id)}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    setNewNotification(prev => {
                                                                        const current = prev.relatedCourses || [];
                                                                        if (checked) {
                                                                            return { ...prev, relatedCourses: [...current, course._id] };
                                                                        } else {
                                                                            return { ...prev, relatedCourses: current.filter(id => id !== course._id) };
                                                                        }
                                                                    });
                                                                }}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <img
                                                                src={getImageUrl(course.thumbnail)}

                                                                alt=""
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                                onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
                                                            />
                                                            <label htmlFor={`course-${course._id}`} style={{ cursor: 'pointer', fontSize: '0.95rem', width: '100%', display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: '500' }}>{course.title}</span>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{course.price}</span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                    {courses.length === 0 && <p style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>No courses available.</p>}
                                                </div>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selected: {newNotification.relatedCourses?.length || 0}</p>
                                            </div>
                                        )}
                                        <button type="submit" style={{ marginTop: '1rem', padding: '0.8rem', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Send
                                        </button>
                                    </form>
                                </div>

                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>History</h2>
                                        {notifications.length > 0 && (
                                            <button onClick={handleClearAllNotifications} style={{ color: '#d63031', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No notifications.</p> : notifications.map(notif => (
                                            <div key={notif._id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', borderLeft: `4px solid ${notif.type === 'warning' ? '#ff7675' : notif.type === 'offer' ? '#f59e0b' : '#74b9ff'}` }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{notif.title}</span>
                                                    <button onClick={() => handleDeleteNotification(notif._id)} style={{ color: '#d63031', border: 'none', background: 'none', cursor: 'pointer' }}><Trash size={14} /></button>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{notif.message}</p>

                                                {/* Show Related Courses for Offer */}
                                                {notif.type === 'offer' && notif.relatedCourses && notif.relatedCourses.length > 0 && (
                                                    <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        {notif.relatedCourses.map((course, idx) => (
                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                                                {course.thumbnail && (
                                                                    <img
                                                                        src={getImageUrl(course.thumbnail)}

                                                                        alt=""
                                                                        style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
                                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                                    />
                                                                )}
                                                                <span style={{ fontSize: '0.8rem' }}>{course.title || 'Unknown Course'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#999' }}>
                                                    {new Date(notif.createdAt).toLocaleDateString()} • {notif.type}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Video Library Tab (Bunny.net) */}
                        {activeTab === 'videos' && (
                            <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                                {/* Configuration Panel */}
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)', alignSelf: 'start' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Video size={20} /> Bunny.net Configuration
                                    </h2>
                                    <form onSubmit={fetchBunnyVideos} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>API Key (Access Key)</label>
                                            <input
                                                type="password"
                                                value={bunnyConfig.apiKey}
                                                onChange={(e) => setBunnyConfig({ ...bunnyConfig, apiKey: e.target.value })}
                                                required
                                                placeholder="Enter API Key"
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Library ID</label>
                                            <input
                                                value={bunnyConfig.libraryId}
                                                onChange={(e) => setBunnyConfig({ ...bunnyConfig, libraryId: e.target.value })}
                                                required
                                                placeholder="Enter Library ID"
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Collection ID (Optional)</label>
                                            <input
                                                value={bunnyConfig.collectionId}
                                                onChange={(e) => setBunnyConfig({ ...bunnyConfig, collectionId: e.target.value })}
                                                placeholder="Enter Collection ID"
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loadingBunny}
                                            style={{
                                                marginTop: '1rem',
                                                padding: '0.8rem',
                                                background: '#fd79a8', // Bunny color-ish
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                cursor: loadingBunny ? 'wait' : 'pointer',
                                                opacity: loadingBunny ? 0.7 : 1
                                            }}
                                        >
                                            {loadingBunny ? 'Fetching...' : 'Fetch Videos'}
                                        </button>
                                    </form>
                                </div>

                                {/* Results Grid */}
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)' }}>
                                        Video Library ({bunnyVideos.length})
                                    </h2>

                                    {bunnyVideos.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            <Video size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                            <p>No videos loaded. Enter credentials to fetch content.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                            {bunnyVideos.map((video) => (
                                                <div key={video.guid} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                    <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                                                        <img
                                                            src={video.thumbnailUrl || `https://${bunnyConfig.libraryId}.b-cdn.net/${video.guid}/${video.thumbnailFileName}`}
                                                            alt={video.title}
                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    </div>
                                                    <div style={{ padding: '0.8rem' }}>
                                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={video.title}>
                                                            {video.title}
                                                        </h4>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {formatDuration(video.length)}
                                                            </span>
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`https://player.mediadelivery.net/embed/${bunnyConfig.libraryId}/${video.guid}`);
                                                                    toast.success('Embed URL Copied!');
                                                                }}
                                                                style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Copy URL
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div style={{ width: '100%' }}>
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Hammer size={24} /> Site Settings
                                    </h2>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Maintenance Mode</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                                Enable to show a maintenance popup to all non-admin users.
                                            </p>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                                            <input
                                                type="checkbox"
                                                checked={maintenanceMode}
                                                onChange={toggleMaintenanceMode}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: maintenanceMode ? '#22c55e' : '#ccc',
                                                transition: '.4s', borderRadius: '34px'
                                            }}></span>
                                            <span style={{
                                                position: 'absolute', content: '""', height: '26px', width: '26px',
                                                left: '4px', bottom: '4px', backgroundColor: 'white',
                                                transition: '.4s', borderRadius: '50%',
                                                transform: maintenanceMode ? 'translateX(26px)' : 'translateX(0)'
                                            }}></span>
                                        </label>
                                    </div>

                                    {/* Global Announcement Panel */}
                                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Global Announcement Bar</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                                Set a message to display at the very top of the app. Leave empty to hide.
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <textarea
                                                value={globalAnnouncement}
                                                onChange={(e) => setGlobalAnnouncement(e.target.value)}
                                                placeholder="e.g. Flash Sale: 50% Off Top Courses Today Only!"
                                                rows={2}
                                                className="form-input"
                                                style={{ fontFamily: 'inherit', borderRadius: '6px' }}
                                            />
                                            <button
                                                onClick={handleUpdateAnnouncement}
                                                style={{ alignSelf: 'flex-start', padding: '0.6rem 1.2rem', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                                            >
                                                Update Announcement
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Students Tab */}
                        {activeTab === 'students' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {/* Left: Manual Enrollment Form */}
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)', alignSelf: 'start' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Users size={20} /> Manual Enrollment
                                    </h2>
                                    <form onSubmit={handleManualEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Student Email</label>
                                            <input
                                                type="email"
                                                value={manualEnrollEmail}
                                                onChange={(e) => setManualEnrollEmail(e.target.value)}
                                                required
                                                placeholder="user@example.com"
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Target Course</label>
                                            <select
                                                value={manualEnrollCourse}
                                                onChange={(e) => setManualEnrollCourse(e.target.value)}
                                                required
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            >
                                                <option value="" disabled>Select a course</option>
                                                {courses.map(c => (
                                                    <option key={c._id} value={c._id}>{c.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            style={{
                                                marginTop: '1rem', padding: '0.8rem', background: '#6c5ce7', color: 'white',
                                                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                                            }}
                                        >
                                            Enroll Student
                                        </button>
                                    </form>
                                </div>

                                {/* Right: Students List */}
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)' }}>
                                        Student Directory ({users.length})
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                                        {users.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No students found.</p> : users.map(user => (
                                            <div key={user._id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                                                {/* Desktop/Tablet layout via grid or flex wrap */}
                                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                                                    <div style={{ flex: '1 1 200px' }}>
                                                        <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem', fontWeight: 'bold' }}>{user.name || 'No Name provided'}</h3>
                                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user.email}</p>
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {user.enrolledCourses?.map(c => (
                                                                <span key={c._id} style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(108, 92, 231, 0.1)', color: '#6c5ce7', borderRadius: '12px', border: '1px solid rgba(108, 92, 231, 0.2)' }}>
                                                                    {c.title}
                                                                </span>
                                                            ))}
                                                            {(!user.enrolledCourses || user.enrolledCourses.length === 0) && (
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free User</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ flex: '0 0 auto', textAlign: 'left', minWidth: '150px' }}>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Join: {new Date(user.createdAt).toLocaleDateString()}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                                                            Last Login: {
                                                                user.activeSessions && user.activeSessions.length > 0
                                                                    ? new Date(Math.max(...user.activeSessions.map(session => new Date(session.lastActive).getTime()))).toLocaleString()
                                                                    : 'Never'
                                                            }
                                                        </span>
                                                        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                                            <button
                                                                onClick={() => handleForceLogout(user.uid)}
                                                                title="Log out from all devices"
                                                                style={{
                                                                    background: 'rgba(214, 48, 49, 0.1)',
                                                                    color: '#d63031',
                                                                    border: '1px solid rgba(214, 48, 49, 0.2)',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.8rem',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                Force Logout
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Coupons Tab */}
                        {activeTab === 'coupons' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {/* Left: Create Coupon Form */}
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)', alignSelf: 'start' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Plus size={20} /> Create New Coupon
                                    </h2>
                                    <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Coupon Code</label>
                                            <input
                                                type="text"
                                                value={newCoupon.code}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                                required
                                                placeholder="e.g. SUMMER50"
                                                className="form-input"
                                                style={{ borderRadius: '6px', textTransform: 'uppercase' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Discount Percentage (%)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={newCoupon.discountPercentage}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                                                required
                                                placeholder="e.g. 20"
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Max Uses (Optional)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newCoupon.maxUses}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                                                placeholder="Leave empty for unlimited"
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontWeight: '500' }}>Expiration Date (Optional)</label>
                                            <input
                                                type="datetime-local"
                                                value={newCoupon.validUntil}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                                                className="form-input"
                                                style={{ borderRadius: '6px' }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            style={{
                                                marginTop: '1rem', padding: '0.8rem', background: '#6c5ce7', color: 'white',
                                                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                                            }}
                                        >
                                            Create Coupon
                                        </button>
                                    </form>
                                </div>

                                {/* Right: Coupons List */}
                                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)' }}>
                                        Active Coupons ({coupons.length})
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                                        {coupons.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No coupons found.</p> : coupons.map(coupon => (
                                            <div key={coupon._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', opacity: coupon.isActive ? 1 : 0.6 }}>
                                                <div>
                                                    <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}>{coupon.code}</h3>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '12px' }}>
                                                            {coupon.discountPercentage}% OFF
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'rgba(108, 92, 231, 0.1)', color: '#6c5ce7', borderRadius: '12px' }}>
                                                            Uses: {coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : '(Unlimited)'}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        Expires: {coupon.validUntil ? new Date(coupon.validUntil).toLocaleString() : 'Never'}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleToggleCoupon(coupon._id)}
                                                        title={coupon.isActive ? "Deactivate" : "Activate"}
                                                        style={{
                                                            background: coupon.isActive ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                            color: coupon.isActive ? '#eab308' : '#22c55e',
                                                            border: 'none',
                                                            padding: '6px 12px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {coupon.isActive ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                                        title="Delete"
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            color: '#ef4444',
                                                            border: 'none',
                                                            padding: '6px 10px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={20} /> Transaction History
                                </h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>User</th>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>Course</th>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>Amount (₹)</th>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>Txn ID</th>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                                                <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</td>
                                                </tr>
                                            ) : (
                                                payments.map(payment => (
                                                    <tr key={payment._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <div style={{ fontWeight: 500 }}>{payment.user?.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{payment.user?.email}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>{payment.courseId?.title || 'Unknown Course'}</td>
                                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{payment.amount}</td>
                                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.paymentId}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            <span style={{
                                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500,
                                                                background: payment.status === 'successful' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                color: payment.status === 'successful' ? '#22c55e' : '#ef4444'
                                                            }}>
                                                                {payment.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            {payment.status === 'successful' ? (
                                                                <button
                                                                    onClick={() => handleRefund(payment._id)}
                                                                    style={{
                                                                        padding: '6px 12px', background: 'transparent', color: '#ef4444',
                                                                        border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer',
                                                                        fontWeight: 500, fontSize: '0.85rem', transition: '0.2s'
                                                                    }}
                                                                >
                                                                    Issue Refund
                                                                </button>
                                                            ) : (
                                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
