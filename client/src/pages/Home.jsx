import { Link } from 'react-router-dom';
import { PlayCircle, ShieldCheck, Users, ArrowRight, Star, Youtube, Code, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="home" style={{ minHeight: 'calc(100vh - var(--topbar-height))', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

            {/* --- Hero Section --- */}
            <section className="hero" style={{
                position: 'relative',
                padding: '6rem 1.5rem',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--hero-bg)',
                overflow: 'hidden'
            }}>
                {/* Dynamic Background Elements */}
                <div className="animate-blob" style={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                    opacity: 0.15, filter: 'blur(80px)', zIndex: 0
                }} />
                <div className="animate-blob animation-delay-2000" style={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '45vw', height: '45vw',
                    background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)',
                    opacity: 0.15, filter: 'blur(80px)', zIndex: 0
                }} />
                <div className="animate-blob animation-delay-4000" style={{
                    position: 'absolute', top: '40%', left: '40%', width: '40vw', height: '40vw',
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                    opacity: 0.1, filter: 'blur(90px)', zIndex: 0
                }} />

                <motion.div
                    className="container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', textAlign: 'center' }}
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '8px 20px', borderRadius: '50px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
                                <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#22c55e', opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '10px', width: '10px', background: '#22c55e' }}></span>
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                Trusted by <span style={{ color: 'var(--text)', fontWeight: 700 }}>10,000+</span> Students
                            </span>
                        </div>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1 variants={itemVariants} style={{
                        fontSize: 'clamp(3rem, 7vw, 6rem)',
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        fontWeight: 800,
                        letterSpacing: '-2px'
                    }}>
                        Master the Future with <br />
                        <span className="text-gradient animate-gradient-x" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                            Future-Ready Skills
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        color: 'var(--text-muted)',
                        maxWidth: '48rem',
                        margin: '0 auto 3.5rem',
                        lineHeight: 1.6
                    }}>
                        Access world-class education designed for the modern era. From coding to design,
                        unlock your potential with expert-led courses and <span style={{ color: 'var(--text)', fontWeight: 600 }}>interactive learning experiences</span>.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/courses" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                            Start Learning Now <ArrowRight size={20} />
                        </Link>

                    </motion.div>

                    {/* Stats/Floating Cards */}
                    <motion.div
                        variants={itemVariants}
                        style={{
                            marginTop: '6rem',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            flexWrap: 'wrap'
                        }}
                    >
                        {[
                            { label: 'Courses', value: '150+', icon: Youtube, color: '#ff0000' },
                            { label: 'Students', value: '10k+', icon: Users, color: '#3b82f6' },
                            { label: 'Rating', value: '4.9/5', icon: Star, color: '#eab308' },
                            { label: 'Career Growth', value: '95%', icon: TrendingUp, color: '#22c55e' }
                        ].map((stat, index) => (
                            <div key={index} className="glass-panel" style={{
                                padding: '1.5rem 2.5rem',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                minWidth: '200px'
                            }}>
                                <div style={{
                                    padding: '10px',
                                    background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.1)`,
                                    borderRadius: '12px',
                                    color: stat.color
                                }}>
                                    <stat.icon size={24} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>{stat.value}</h4>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* --- Features Section --- */}
            <section style={{ padding: '6rem 1.5rem', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose AuraEd?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Experience the difference with our premium learning platform.</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            {
                                icon: PlayCircle,
                                title: 'Learn at Your Own Pace',
                                desc: 'Lifetime access to all courses. Revisit complex topics anytime and learn on your schedule.',
                                gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                                color: '#3b82f6'
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Industry Recognized',
                                desc: 'Certificates that are valued by top companies. content curated by industry veterans.',
                                gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(249, 115, 22, 0.1))',
                                color: '#eab308'
                            },
                            {
                                icon: Users,
                                title: 'Community & Peer Support',
                                desc: 'Join exclusive study groups and get 24/7 support from mentors and peers.',
                                gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(244, 63, 94, 0.1))',
                                color: '#ec4899'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="glass-panel glass-card-hover"
                                whileHover={{ y: -10 }}
                                style={{
                                    padding: '2.5rem',
                                    borderRadius: '24px',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '16px',
                                    background: item.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem', color: item.color
                                }}>
                                    <item.icon size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
