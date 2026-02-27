import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getYouTubeVideoId } from '../utils/helpers';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, Lock, ChevronDown, ChevronUp, ListVideo, X, Clock } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import PaymentButton from '../components/PaymentButton';
import PDFViewer from '../components/PDFViewer';
import { loadRazorpay } from '../utils/paymentUtils';

import { useLayout } from '../context/LayoutContext';

const CourseDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { setHeaderTitle, setSidebarVisible } = useLayout();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [viewingNote, setViewingNote] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isPlayerPlaylistOpen, setIsPlayerPlaylistOpen] = useState(false);
    const [activeIntroIndex, setActiveIntroIndex] = useState(0);

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');

    // Check if user is enrolled or admin
    const isEnrolled = user?.enrolledCourses?.includes(id) || user?.role === 'admin';

    useEffect(() => {
        // Hide Main Sidebar for "Focus Mode" -> RESTORED TO SHOW SIDEBAR (User Request)
        setSidebarVisible(true);

        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${id}`);
                setCourse(data);
                setHeaderTitle(data.title);

                // Initialize expanded sections (only first one open, or none)
                if (data.sections) {
                    const initialExpanded = {};
                    // Uncomment the next line if you want the FIRST section to be open by default
                    // initialExpanded[0] = true; 
                    setExpandedSections(initialExpanded);
                }

                // Set initial video (Intro or first lecture if enrolled)
                if (isEnrolled && data.sections?.[0]?.lectures?.[0]) {
                    setCurrentLecture(data.sections[0].lectures[0]);
                } else if (data.introVideos?.length > 0) {
                    // Use first intro video from the new multi-video array
                    setCurrentLecture({ title: data.introVideos[0].title || 'Introduction', videoUrl: data.introVideos[0].url, freePreview: true });
                    setActiveIntroIndex(0);
                } else if (data.videoUrl) {
                    // Legacy single intro video fallback
                    setCurrentLecture({ title: 'Introduction', videoUrl: data.videoUrl, freePreview: true });
                }
            } catch (error) {
                toast.error('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();

        // Cleanup: Restore Title on unmount
        return () => {
            setHeaderTitle(null);
            // setSidebarVisible(true); // Don't need to force true if we never set it false, but good for cleanup just in case.
        };
    }, [id, isEnrolled, setHeaderTitle, setSidebarVisible]);

    const [completedLectures, setCompletedLectures] = useState(new Set());

    // Sync completed lectures from user profile
    useEffect(() => {
        if (user && user.courseProgress) {
            const courseProg = user.courseProgress.find(p => p.courseId === id);
            if (courseProg) {
                setCompletedLectures(new Set(courseProg.completedLectures));
            }
        }
    }, [user, id]);

    const handleToggleProgress = async (lectureId, e) => {
        e.stopPropagation(); // Prevent playing video when checking box
        if (!user) return;

        // Optimistic update
        setCompletedLectures(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lectureId)) newSet.delete(lectureId);
            else newSet.add(lectureId);
            return newSet;
        });

        try {
            await api.put(`/courses/${id}/progress`, { lectureId });
            // Ideally we'd update the global user context here, but optimistic UI is enough for now
        } catch (error) {
            console.error("Failed to update progress", error);
            // Revert on error (optional, skipping for simplicity)
            toast.error("Failed to save progress");
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) {
            setCouponError('Please enter a code');
            return;
        }

        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode });
            setDiscount(data.discountPercentage);
            setCouponError('');
            toast.success(data.message || 'Coupon Applied!');
        } catch (error) {
            setDiscount(0);
            setCouponError(error.response?.data?.message || 'Invalid coupon');
        }
    };

    const handleBuyCourse = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // 1. Create Order
            const { data: order } = await api.post('/payment/create-order', {
                courseId: id,
                userId: user.uid,
                couponCode: discount > 0 ? couponCode : undefined
            });

            // 2. Initialize Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // You need to add this to client/.env too if not present, or fetch from backend
                amount: order.amount,
                currency: order.currency,
                name: "AuraEd",
                description: course.title,
                image: "/logo.png", // specific logo or default
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            courseId: id,
                            userId: user.uid,
                            couponCode: discount > 0 ? couponCode : undefined
                        });

                        toast.success(verifyRes.data.message);
                        window.location.reload(); // Refresh to update enrollment status
                    } catch (error) {
                        console.error("Payment Verification Failed", error);
                        toast.error(error.response?.data?.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phoneNumber || ""
                },
                notes: {
                    address: "AuraEd Corporate Office"
                },
                theme: {
                    color: "#8b5cf6"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Order Creation Failed", error);
            toast.error(error.response?.data?.message || 'Could not initiate payment');
        }
    };

    const handleEnrollSuccess = () => {
        // setIsEnrolled is not a state, we rely on window.reload to fetch fresh user data
        window.location.reload();
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '1.1rem' }}>Loading course...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
    if (!course) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Course not found</div>;

    const videoId = currentLecture?.videoUrl ? getYouTubeVideoId(currentLecture.videoUrl) : null;

    // Helper to compute the playlist (all demo videos + enrolled videos)
    const getAvailablePlaylist = () => {
        if (!course) return [];
        let list = [];

        // 1. Always include demo/intro videos at the start
        if (course.introVideos && course.introVideos.length > 0) {
            const intros = course.introVideos.map((iv, idx) => ({
                ...iv,
                _id: iv._id || `intro-${idx}`, // Ensure they have an ID to match against
                title: iv.title || `Demo Video ${idx + 1}`,
                videoUrl: iv.videoUrl || iv.url,
                freePreview: true, // Intro videos are always considered free preview
                isIntro: true
            }));
            list = [...intros];
        }

        // 2. Add course section lectures
        const sectionLectures = course.sections?.flatMap(s => s.lectures || []) || [];
        if (!isEnrolled) {
            list = [...list, ...sectionLectures.filter(l => l.freePreview)];
        } else {
            list = [...list, ...sectionLectures];
        }
        return list;
    };

    const handleLectureVideoEnded = async () => {
        if (!currentLecture) return;

        console.log("handleLectureVideoEnded called for:", currentLecture.title, currentLecture._id);

        // 1. Mark as completed if not already
        if (!completedLectures.has(currentLecture._id)) {
            console.log("Marking as completed...");
            // Optimistic update
            setCompletedLectures(prev => {
                const newSet = new Set(prev).add(currentLecture._id);
                console.log("New completed set:", [...newSet]);
                return newSet;
            });
            try {
                await api.put(`/courses/${id}/progress`, { lectureId: currentLecture._id });
                toast.success("Progress Saved!");
            } catch (error) {
                console.error("Failed to save progress on video end", error);
            }
        } else {
            console.log("Already marked as completed.");
        }

        // 2. Find and play next lecture
        const availableLectures = getAvailablePlaylist();

        const currIndex = availableLectures.findIndex(l => l._id === currentLecture._id);

        if (currIndex !== -1 && currIndex < availableLectures.length - 1) {
            const nextLecture = availableLectures[currIndex + 1];
            toast.success(`Up Next: ${nextLecture.title}`);
            setCurrentLecture(nextLecture);

            // Auto scroll to active lecture in sidebar if needed (optional enhancement)
        }
    };

    return (
        <>
            <div className={`player-sidebar-overlay mobile-only ${isMobileSidebarOpen ? 'visible' : ''}`} onClick={() => setIsMobileSidebarOpen(false)}></div>
            <div className="course-player-grid">

                {/* Left Side: Video Player */}
                <div className="player-video-area">
                    <div className="video-wrapper">
                        {currentLecture?.videoUrl ? (
                            <VideoPlayer
                                videoId={getYouTubeVideoId(currentLecture.videoUrl)}
                                videoUrl={currentLecture.videoUrl}
                                onEnded={handleLectureVideoEnded}
                            >
                                <div className={`mobile-only in-player-overlay ${isPlayerPlaylistOpen ? 'panel-open' : ''}`}>
                                    <button
                                        className={`player-playlist-btn ${isPlayerPlaylistOpen ? 'is-open' : ''}`}
                                        onClick={() => setIsPlayerPlaylistOpen(prev => !prev)}
                                    >
                                        <div style={{ transition: 'transform 0.3s ease', transform: isPlayerPlaylistOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {isPlayerPlaylistOpen ? <X size={24} /> : <ListVideo size={24} />}
                                        </div>
                                    </button>

                                    <div className={`player-playlist-panel ${isPlayerPlaylistOpen ? 'open' : ''}`}>
                                        <div className="player-playlist-header">
                                            <h3>Up Next</h3>
                                            <button onClick={() => setIsPlayerPlaylistOpen(false)}>
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="player-playlist-content">
                                            {(() => {
                                                const availableLectures = getAvailablePlaylist();

                                                const currIndex = availableLectures.findIndex(l => l._id === currentLecture._id);
                                                // If current isn't in available (like intro video), show all available
                                                const nextLectures = currIndex === -1 ? availableLectures : availableLectures.slice(currIndex + 1);

                                                if (nextLectures.length === 0) return <p style={{ opacity: 0.7, padding: '1rem', margin: 0 }}>No more lectures.</p>;

                                                return nextLectures.map((lecture, i) => (
                                                    <div
                                                        key={lecture._id}
                                                        className="player-playlist-item"
                                                        onClick={() => {
                                                            if (currentLecture?._id !== lecture._id) {
                                                                setCurrentLecture(lecture);
                                                            }
                                                            setIsPlayerPlaylistOpen(false);
                                                        }}
                                                    >
                                                        <PlayCircle size={16} />
                                                        <span>{lecture.title}</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </VideoPlayer>
                        ) : (
                            <div style={{ width: '100%', height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', backgroundColor: '#111' }}>
                                <PlayCircle size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <p>Select a lecture to start watching</p>
                            </div>
                        )}
                    </div>

                    {/* Removed Intro Video Tab Switcher as requested by user -> moving to sidebar */}

                    {/* Course Title and Navigation */}
                    <div style={{ padding: '1rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', color: 'var(--text)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{currentLecture?.title || course.title}</h1>
                                <button className="mobile-only btn btn-outline" onClick={() => setIsMobileSidebarOpen(true)} style={{ padding: '0.75rem', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ListVideo size={24} />
                                </button>
                            </div>
                            {isEnrolled && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {(currentLecture?.notes?.length > 0 || currentLecture?.noteUrl) && (
                                        <button
                                            onClick={() => setViewingNote(currentLecture?.notes?.[0]?.url || currentLecture?.noteUrl)}
                                            className="btn btn-outline"
                                            style={{ color: 'var(--text)', borderColor: 'var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            📄 View Notes
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            const allLectures = course.sections?.flatMap(s => s.lectures || []) || [];
                                            const currIndex = allLectures.findIndex(l => l._id === currentLecture._id);
                                            if (currIndex > 0) setCurrentLecture(allLectures[currIndex - 1]);
                                        }}
                                        disabled={(() => {
                                            const allLectures = course.sections?.flatMap(s => s.lectures || []) || [];
                                            const currIndex = allLectures.findIndex(l => l._id === currentLecture._id);
                                            return currIndex <= 0;
                                        })()}
                                        className="btn btn-outline"
                                        style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => {
                                            const allLectures = course.sections?.flatMap(s => s.lectures || []) || [];
                                            const currIndex = allLectures.findIndex(l => l._id === currentLecture._id);
                                            if (currIndex !== -1 && currIndex < allLectures.length - 1) {
                                                setCurrentLecture(allLectures[currIndex + 1]);
                                            }
                                        }}
                                        disabled={(() => {
                                            const allLectures = course.sections?.flatMap(s => s.lectures || []) || [];
                                            const currIndex = allLectures.findIndex(l => l._id === currentLecture._id);
                                            return currIndex === -1 || currIndex >= allLectures.length - 1;
                                        })()}
                                        className="btn btn-primary"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isEnrolled && (
                            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginTop: '2rem' }}>
                                <h2 style={{ color: 'var(--text)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{course.title}</h2>

                                {/* Price Section */}
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text)', lineHeight: 1 }}>
                                            {course.price === 0 ? 'Free' : `₹${course.price}`}
                                        </span>
                                        {course.originalPrice && Number(course.originalPrice) > Number(course.price) && (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                                                    ₹{course.originalPrice}
                                                </span>
                                                <span style={{
                                                    color: 'var(--accent)',
                                                    fontWeight: 'bold',
                                                    background: 'rgba(6, 182, 212, 0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {Math.round(((Number(course.originalPrice) - Number(course.price)) / Number(course.originalPrice)) * 100)}% DISCOUNT
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {course.price > 0 && !isEnrolled && (
                                        <div style={{
                                            marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px', border: '1px solid var(--border)'
                                        }}>
                                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 600 }}>Have a Coupon?</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter code"
                                                    disabled={discount > 0}
                                                    className="form-input"
                                                    style={{ flex: 1, padding: '0.6rem 1rem', height: 'auto', textTransform: 'uppercase' }}
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={discount > 0}
                                                    className="btn btn-outline"
                                                    style={{ height: 'auto', padding: '0.6rem 1.2rem', borderColor: discount > 0 ? '#22c55e' : 'var(--border)' }}
                                                >
                                                    {discount > 0 ? 'Applied ✓' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: 0 }}>{couponError}</p>}
                                            {discount > 0 && (
                                                <p style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                                                    {discount}% discount applied! You save ₹{Math.round((course.price * discount) / 100)}.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ marginTop: '0.5rem' }}>
                                        {course.price === 0 ? (
                                            <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                                Enroll Free
                                            </button>
                                        ) : (
                                            <div style={{ width: '100%' }}>
                                                <button onClick={handleBuyCourse} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                                    {discount > 0
                                                        ? `Buy Now for ₹${Math.max(0, course.price - (course.price * discount) / 100)}`
                                                        : `Buy Now for ₹${course.price}`
                                                    }
                                                </button>
                                            </div>
                                        )}
                                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            30-Day Money-Back Guarantee • Full Lifetime Access
                                        </p>
                                    </div>
                                </div>

                                <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {course.description ? course.description.split(/(:-\s*)/g).map((part, index) => {
                                        // If the part matches :-, render it and add a break
                                        if (part.match(/:-\s*/)) {
                                            return <span key={index} style={{ fontWeight: 600, color: 'var(--text)' }}>{part}<br /></span>;
                                        }
                                        return <span key={index}>{part}</span>;
                                    }) : 'No description available.'}
                                </div>
                            </div>
                        )}
                        {/* Lecture Notes Section */}
                        {viewingNote && (
                            <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>📄</span> Lecture Notes
                                    </h3>
                                    <button onClick={() => setViewingNote(null)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Close <ChevronUp size={16} />
                                    </button>
                                </div>
                                {(currentLecture?.notes?.length > 0 || (currentLecture?.noteUrl && currentLecture?.notes?.length > 0)) && (
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                        {currentLecture.noteUrl && (
                                            <button
                                                onClick={() => setViewingNote(currentLecture.noteUrl)}
                                                className={`btn ${viewingNote === currentLecture.noteUrl ? 'btn-primary' : 'btn-outline'}`}
                                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                            >
                                                Main Note
                                            </button>
                                        )}
                                        {currentLecture.notes.map((note, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setViewingNote(note.url)}
                                                className={`btn ${viewingNote === note.url ? 'btn-primary' : 'btn-outline'}`}
                                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                            >
                                                {note.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div style={{ width: '100%', minHeight: '600px', borderRadius: 'calc(var(--radius) - 4px)', backgroundColor: '#f1f5f9' }}>
                                    <PDFViewer pdfUrl={viewingNote} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Curriculum Sidebar */}
                <div className={`player-sidebar ${isMobileSidebarOpen ? 'open' : ''}`} style={{ background: 'var(--surface)', borderLeft: 'var(--glass-border)' }}>
                    <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: 'var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Course Content</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
                                {course.sections?.length} Sections • {course.sections?.reduce((acc, sec) => acc + (sec.lectures?.length || 0), 0)} Lectures
                            </p>
                        </div>
                        <button className="mobile-only hide-on-desktop" onClick={() => setIsMobileSidebarOpen(false)} style={{ color: 'var(--text)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>

                        {/* ── Demo Videos section (non-enrolled only) ─────────────── */}
                        {!isEnrolled && (() => {
                            // Combine Intro Videos + Free Preview Lectures
                            const introLecs = (course.introVideos || []).map((vid, idx) => ({
                                _id: `intro-${idx}`,
                                title: vid.title || `Introduction ${idx + 1}`,
                                videoUrl: vid.url,
                                freePreview: true,
                                _sectionTitle: 'Intro Video'
                            }));
                            const freeLecs = course.sections?.flatMap(s =>
                                (s.lectures || []).filter(l => l.freePreview).map(l => ({ ...l, _sectionTitle: s.title }))
                            ) || [];
                            const demoLectures = [...introLecs, ...freeLecs];

                            if (demoLectures.length === 0) return null;

                            return (
                                <div style={{ borderBottom: 'var(--glass-border)' }}>
                                    {/* Demo Videos Accordion Header */}
                                    <button
                                        onClick={() => toggleSection('demo')}
                                        className="section-header"
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: expandedSections['demo'] ? 'rgba(0,184,148,0.08)' : 'linear-gradient(135deg, rgba(0,184,148,0.08), rgba(0,184,148,0.02))',
                                            border: 'none',
                                            borderBottom: expandedSections['demo'] ? '1px solid rgba(0,184,148,0.2)' : 'none',
                                            color: '#00b894',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>🎬</span>
                                            <div style={{ textAlign: 'left' }}>
                                                <span style={{ fontSize: '0.95rem', display: 'block' }}>Demo Videos</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                                                    {demoLectures.length} free preview{demoLectures.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        {expandedSections['demo'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>

                                    {/* Demo Videos Accordion Content */}
                                    {expandedSections['demo'] && (
                                        <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                                            {demoLectures.map((lecture, idx) => {
                                                const isActive = currentLecture?._id === lecture._id || (currentLecture?.videoUrl === lecture.videoUrl);
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            if (currentLecture?._id !== lecture._id) {
                                                                setCurrentLecture(lecture);
                                                            }
                                                        }}
                                                        style={{
                                                            width: '100%', padding: '0.75rem 1rem 0.75rem 1.5rem',
                                                            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                                            background: isActive
                                                                ? 'linear-gradient(90deg, rgba(0,184,148,0.12), transparent)'
                                                                : 'transparent',
                                                            borderLeft: `3px solid ${isActive ? '#00b894' : 'transparent'}`,
                                                            border: 'none',
                                                            borderBottom: '1px solid rgba(255,255,255,0.02)',
                                                            cursor: 'pointer', color: isActive ? '#00b894' : 'var(--text-muted)',
                                                            textAlign: 'left', transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <PlayCircle size={16} style={{ marginTop: '3px', flexShrink: 0, color: isActive ? '#00b894' : 'var(--text-muted)' }} />
                                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                                            <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, lineHeight: 1.4 }}>
                                                                {lecture.title}
                                                            </span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                                <span>{lecture._sectionTitle}</span>
                                                                {lecture.duration && lecture.duration !== '0:00' && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{lecture.duration}</span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Course Content Divider */}
                                    <div style={{ padding: '1rem 1.5rem 0.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Course Content
                                        </span>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ── Full course sections (all users) ────────────────────── */}
                        {course.sections?.length > 0 ? (
                            course.sections.map((section, sIndex) => {
                                const showGroupHeader = section.group && (sIndex === 0 || course.sections[sIndex - 1].group !== section.group);

                                return (
                                    <div key={sIndex}>
                                        {showGroupHeader && (
                                            <div style={{
                                                padding: '1.5rem 1.5rem 0.5rem 1.5rem',
                                                color: 'var(--accent)',
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <div style={{ width: '4px', height: '14px', backgroundColor: 'var(--accent)', borderRadius: '2px' }}></div>
                                                {section.group}
                                            </div>
                                        )}
                                        <div style={{ borderBottom: 'var(--glass-border)' }}>
                                            <button
                                                onClick={() => toggleSection(sIndex)}
                                                className="section-header"
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem 1.5rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    background: expandedSections[sIndex] ? 'rgba(255,255,255,0.02)' : 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text)',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <span style={{ fontSize: '0.95rem' }}>{section.title}</span>
                                                {expandedSections[sIndex] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>

                                            {expandedSections[sIndex] && (
                                                <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                                                    {section.lectures?.map((lecture, lIndex) => {
                                                        const isLocked = !isEnrolled && !lecture.freePreview;
                                                        const isActive = currentLecture?._id === lecture._id || (currentLecture?.videoUrl === lecture.videoUrl && currentLecture?.title === lecture.title);
                                                        const isCompleted = completedLectures.has(lecture._id);

                                                        return (
                                                            <div key={lIndex} style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <button
                                                                    disabled={isLocked}
                                                                    onClick={() => {
                                                                        if (!isLocked && currentLecture?._id !== lecture._id) {
                                                                            setCurrentLecture(lecture);
                                                                        }
                                                                    }}
                                                                    className={`lecture-item ${isActive ? 'active' : ''}`}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '0.75rem 1rem 0.75rem 1.5rem',
                                                                        display: 'flex',
                                                                        alignItems: 'flex-start',
                                                                        gap: '0.75rem',
                                                                        background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.1), transparent)' : 'transparent',
                                                                        borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                                                                        borderBottom: 'none',
                                                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                                                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                                                        transition: 'all 0.2s',
                                                                        textAlign: 'left'
                                                                    }}
                                                                >
                                                                    {/* Checkbox for Progress */}
                                                                    {isEnrolled ? (
                                                                        <div
                                                                            onClick={(e) => handleToggleProgress(lecture._id, e)}
                                                                            style={{
                                                                                width: '18px', height: '18px',
                                                                                border: `2px solid ${isCompleted ? 'var(--primary)' : '#4b5563'}`,
                                                                                borderRadius: '4px',
                                                                                backgroundColor: isCompleted ? 'var(--primary)' : 'transparent',
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                marginTop: '3px', cursor: 'pointer', flexShrink: 0
                                                                            }}
                                                                        >
                                                                            {isCompleted && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ marginTop: '3px' }}>
                                                                            {isLocked ? <Lock size={16} /> : <PlayCircle size={16} />}
                                                                        </div>
                                                                    )}

                                                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                                                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: isActive ? 500 : 400, lineHeight: 1.4 }}>
                                                                            {lIndex + 1}. {lecture.title}
                                                                        </span>
                                                                        {/* FREE PREVIEW badge for non-enrolled */}
                                                                        {!isEnrolled && lecture.freePreview && (
                                                                            <span style={{
                                                                                display: 'inline-block', fontSize: '0.65rem', fontWeight: 700,
                                                                                color: '#00b894', background: 'rgba(0,184,148,0.12)',
                                                                                border: '1px solid rgba(0,184,148,0.3)',
                                                                                borderRadius: '4px', padding: '1px 6px',
                                                                                marginTop: '3px', letterSpacing: '0.5px'
                                                                            }}>FREE PREVIEW</span>
                                                                        )}

                                                                        <div style={{
                                                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                                                            marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)'
                                                                        }}>
                                                                            {/* Duration */}
                                                                            {lecture.duration && lecture.duration !== "0:00" && (
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                    <Clock size={12} />
                                                                                    <span>
                                                                                        {(() => {
                                                                                            const d = String(lecture.duration);
                                                                                            // If it's already nicely formatted (has 'min' or 'hr'), just return it
                                                                                            if (d.includes('min') || d.includes('hr')) return d;

                                                                                            // If it's the old "MM:SS" or "MM:SS.ms" format from Wistia/Bunny length calc
                                                                                            let totalSeconds = 0;
                                                                                            if (d.includes(':')) {
                                                                                                const parts = d.split(':');
                                                                                                totalSeconds = parseInt(parts[0]) * 60 + parseFloat(parts[1] || 0);
                                                                                            } else {
                                                                                                totalSeconds = parseFloat(d);
                                                                                            }

                                                                                            if (isNaN(totalSeconds) || totalSeconds === 0) return d;

                                                                                            const rounded = Math.round(totalSeconds);
                                                                                            const hours = Math.floor(rounded / 3600);
                                                                                            const minutes = Math.floor((rounded % 3600) / 60);

                                                                                            if (hours > 0) {
                                                                                                return `${hours}hr ${minutes > 0 ? minutes + 'mins' : ''}`.trim();
                                                                                            }
                                                                                            return `${minutes}mins`;
                                                                                        })()}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {/* Resources Button */}
                                                                            {(lecture.notes?.length > 0 || lecture.noteUrl) && (
                                                                                <div
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        if (isLocked) {
                                                                                            toast.error("Enroll to access resources");
                                                                                            return;
                                                                                        }
                                                                                        setViewingNote(lecture.notes?.[0]?.url || lecture.noteUrl);
                                                                                        if (!isActive) setCurrentLecture(lecture);
                                                                                    }}
                                                                                    style={{
                                                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                                                        color: isLocked ? 'var(--text-muted)' : 'var(--accent)',
                                                                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                                                                        padding: '2px 6px',
                                                                                        borderRadius: '4px',
                                                                                        background: isLocked ? 'transparent' : 'rgba(6, 182, 212, 0.1)',
                                                                                        border: isLocked ? '1px solid var(--border)' : '1px solid rgba(6, 182, 212, 0.3)',
                                                                                        opacity: isLocked ? 0.6 : 1
                                                                                    }}
                                                                                >
                                                                                    <span>{isLocked ? '🔒 Resources' : '📄 Resources'}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No content added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetails;
