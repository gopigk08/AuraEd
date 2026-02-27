import { motion } from 'framer-motion';

// Particle Component for Background
const FloatingParticles = () => {
    // Generate random particles
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
                    animate={{
                        y: [`${p.y}vh`, `${p.y - 20}vh`, `${p.y}vh`], // Float up and down
                        x: [`${p.x}vw`, `${p.x + 10}vw`, `${p.x}vw`], // Drift side to side
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay
                    }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.3)',
                        boxShadow: `0 0 ${p.size * 2}px rgba(255, 255, 255, 0.5)`
                    }}
                />
            ))}
        </div>
    );
};

const AuthBackground = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            {/* Large Blobs with Framer Motion */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '15%',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(150px)',
                    borderRadius: '50%',
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.3, 0.2],
                    x: [0, -50, 0],
                    y: [0, -40, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    width: '250px',
                    height: '250px',
                    background: 'var(--secondary)',
                    filter: 'blur(150px)',
                    borderRadius: '50%',
                }}
            />
            <FloatingParticles />
        </div>
    );
};

export default AuthBackground;
