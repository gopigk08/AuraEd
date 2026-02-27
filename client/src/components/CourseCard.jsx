import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course }) => {
    const { currentUser } = useAuth();
    return (
        <Link to={`/courses/${course._id}`} className="block group h-full">
            <div className="glass-panel course-card" style={{
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                border: '1px solid var(--border)'
            }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img
                        src={course.thumbnail ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_SERVER_URL || `http://${window.location.hostname}:5000`}${course.thumbnail}`) : '/placeholder-course.jpg'}
                        alt={course.title}
                        className="course-card-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onError={(e) => { e.target.src = '/placeholder-course.jpg'; }}
                    />
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                        padding: '4px 8px', borderRadius: '6px',
                        fontSize: '0.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                        <Clock size={12} /> {course.duration || 'Self-paced'}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {currentUser && currentUser.role === 'admin' && (
                        <div style={{ marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: course.published ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', color: course.published ? '#4CAF50' : '#FF9800', border: `1px solid ${course.published ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`, display: 'inline-block', fontWeight: 600 }}>
                                {course.published ? 'Live' : 'Draft'}
                            </span>
                        </div>
                    )}
                    <h3 style={{
                        marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: 600,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                        {course.title}
                    </h3>

                    <p style={{
                        color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                        {course.description}
                    </p>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text)' }}>
                                    {course.price === 0 ? 'Free' : `₹${course.price}`}
                                </span>
                                {course.originalPrice && Number(course.originalPrice) > Number(course.price) && (
                                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        ₹{course.originalPrice}
                                    </span>
                                )}
                            </div>
                            {course.originalPrice && Number(course.originalPrice) > Number(course.price) && (
                                <div>
                                    <span style={{
                                        color: '#0ea5e9', // cyan-500
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        background: 'rgba(14, 165, 233, 0.1)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        display: 'inline-block'
                                    }}>
                                        {Math.round(((Number(course.originalPrice) - Number(course.price)) / Number(course.originalPrice)) * 100)}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{
                            color: '#ffffff', // Explicitly white for good contrast in light theme
                            background: 'var(--primary)',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            lineHeight: 1.2,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            letterSpacing: '0.5px'
                        }}>
                            <span>View</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Course <BookOpen size={14} /></span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
