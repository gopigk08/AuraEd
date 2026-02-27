import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import CourseCard from '../components/CourseCard';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const endpoint = (currentUser && currentUser.role === 'admin') ? '/courses/all' : '/courses';
                const { data } = await api.get(endpoint);
                setCourses(data);
                setFilteredCourses(data);
            } catch (error) {
                toast.error('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const courseId = searchParams.get('id');

    useEffect(() => {
        if (courseId) {
            const filtered = courses.filter(course => course._id === courseId);
            setFilteredCourses(filtered);
        } else if (!searchQuery) {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course =>
                course.title.toLowerCase().includes(searchQuery) ||
                course.description.toLowerCase().includes(searchQuery)
            );
            setFilteredCourses(filtered);
        }
    }, [searchQuery, courseId, courses]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '1.1rem' }}>Loading catalog...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="courses-page" style={{ padding: '4rem 0' }}>
            <div className="container">
                <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Courses'}
                </h1>

                {filteredCourses.length === 0 ? (
                    <p>No courses found matching your search.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredCourses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
