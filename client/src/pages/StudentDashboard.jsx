import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { PlayCircle, BookOpen, Award, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseProgress, setCourseProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/auth/enrolled');
                setEnrolledCourses(data.enrolledCourses || []);
                setCourseProgress(data.courseProgress || []);
            } catch (error) {
                console.error("Failed to load dashboard", error);
                toast.error(error.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchDashboardData();
        }
    }, [currentUser]);

    // Calculate Stats
    const totalEnrolled = enrolledCourses.length;

    // Calculate progress for a specific course
    const getProgress = (courseId) => {
        const progress = courseProgress.find(p => p.courseId === courseId);
        if (!progress) return 0;

        const course = enrolledCourses.find(c => c._id === courseId);
        if (!course) return 0;

        const courseLectures = [];
        course.sections?.forEach(sec => {
            sec.lectures?.forEach(l => courseLectures.push(l._id));
        });

        const totalLectures = courseLectures.length;
        if (totalLectures === 0) return 0;

        // Count only completed lectures that actually exist in the current course sections
        const validCompleted = progress.completedLectures.filter(id => courseLectures.includes(id));

        const calculatedProgress = Math.round((validCompleted.length / totalLectures) * 100);
        return calculatedProgress > 100 ? 100 : calculatedProgress;
    };

    const completedCoursesCount = enrolledCourses.filter(c => getProgress(c._id) === 100).length;
    const inProgressCount = totalEnrolled - completedCoursesCount;

    // Find "Continue Learning" course (First incomplete course)
    const continueCourse = enrolledCourses.find(c => getProgress(c._id) < 100 && getProgress(c._id) > 0) || enrolledCourses[0];

    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Hello, <span className="text-gradient">{currentUser?.name?.split(' ')[0]}</span>! 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Let's learn something new today.</p>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
                <StatCard icon={<BookOpen size={24} />} title="Enrolled Courses" value={totalEnrolled} color="var(--primary)" />
                <StatCard icon={<Clock size={24} />} title="In Progress" value={inProgressCount} color="var(--accent)" />
                <StatCard icon={<Award size={24} />} title="Completed" value={completedCoursesCount} color="var(--secondary)" />
            </div>

            {/* Continue Learning Section */}
            {continueCourse && (
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <PlayCircle className="text-gradient" /> Continue Learning
                    </h2>
                    <div className="glass-panel" style={{
                        padding: '2rem',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Background Glow */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)',
                            zIndex: 0
                        }}></div>

                        <img
                            src={continueCourse.thumbnail}
                            alt={continueCourse.title}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                zIndex: 1
                            }}
                        />

                        <div style={{ flex: 1, zIndex: 1, minWidth: '200px' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: 'rgba(139, 92, 246, 0.2)',
                                color: 'var(--primary)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                marginBottom: '0.8rem'
                            }}>
                                RESUME
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{continueCourse.title}</h3>
                            <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '400px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <span>Progress</span>
                                    <span>{getProgress(continueCourse._id)}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${getProgress(continueCourse._id)}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/courses/${continueCourse._id}`)}
                                className="btn btn-primary"
                                style={{ padding: '0.8rem 2rem' }}
                            >
                                Continue Watching <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* All Courses Grid */}
            <div>
                <h2 style={{ marginBottom: '1.5rem' }}>My Courses</h2>
                {enrolledCourses.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                        {enrolledCourses.map(course => (
                            <div
                                key={course._id}
                                className="card course-card"
                                onClick={() => navigate(`/courses/${course._id}`)}
                                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="course-card-img"
                                        style={{
                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '4rem 1rem 1rem',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                                    }}>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: 'auto' }}>{course.title}</h4>

                                    <div style={{ marginTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <span>{getProgress(course._id)}% Complete</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${getProgress(course._id)}%`, height: '100%', background: 'var(--accent)', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't enrolled in any courses yet.</p>
                        <button onClick={() => navigate('/courses')} className="btn btn-primary">Browse Courses</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            width: '50px', height: '50px', borderRadius: '12px',
            background: `rgba(${color === 'var(--primary)' ? '139, 92, 246' : color === 'var(--accent)' ? '6, 182, 212' : '236, 72, 153'}, 0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{title}</div>
        </div>
    </div>
);

export default StudentDashboard;
