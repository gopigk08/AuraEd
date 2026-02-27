
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { RotateCcw, RotateCw, Play, Pause, Sun, Volume2, VolumeX } from 'lucide-react';
import HlsVideoPlayer from './HlsVideoPlayer';

const VideoPlayer = ({ videoId, videoUrl, onEnded, children, autoPlay = false }) => {
    const iframeRef = useRef(null);
    const hasEndedRef = useRef(false);

    // --- Mobile Swipe Gestures State ---
    const [volume, setVolume] = useState(1);
    const [brightness, setBrightness] = useState(1);
    const [swipeIndicator, setSwipeIndicator] = useState({ type: 'volume', value: 1, visible: false });
    const wrapperRef = useRef(null);
    const touchStartRef = useRef(null);
    const indicatorTimeoutRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const handleTouchStart = (e) => {
            // Only allow swipe gestures in landscape mode
            if (window.innerWidth <= window.innerHeight) return;

            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            const rect = wrapper.getBoundingClientRect();
            const isLeft = (touch.clientX - rect.left) < (rect.width / 2);

            touchStartRef.current = { y: touch.clientY, x: touch.clientX, isLeft, startValue: isLeft ? brightness : volume, isSwiping: false };
        };

        const handleTouchMove = (e) => {
            if (!touchStartRef.current || e.touches.length !== 1) return;

            const touch = e.touches[0];
            const deltaY = touchStartRef.current.y - touch.clientY;
            const deltaX = Math.abs(touchStartRef.current.x - touch.clientX);

            if (!touchStartRef.current.isSwiping) {
                if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > deltaX) {
                    touchStartRef.current.isSwiping = true;
                } else if (deltaX > 10) {
                    touchStartRef.current = null;
                    return;
                }
            }

            if (touchStartRef.current.isSwiping) {
                if (e.cancelable) e.preventDefault();

                const rect = wrapper.getBoundingClientRect();
                const sensitivity = rect.height || 250;
                let newValue = touchStartRef.current.startValue + (deltaY / sensitivity);
                newValue = Math.max(0, Math.min(1, newValue));

                if (touchStartRef.current.isLeft) {
                    setBrightness(newValue);
                    setSwipeIndicator({ type: 'brightness', value: newValue, visible: true });
                } else {
                    setVolume(newValue);
                    setSwipeIndicator({ type: 'volume', value: newValue, visible: true });
                }

                if (indicatorTimeoutRef.current) clearTimeout(indicatorTimeoutRef.current);
            }
        };

        const handleTouchEnd = () => {
            touchStartRef.current = null;
            if (indicatorTimeoutRef.current) clearTimeout(indicatorTimeoutRef.current);
            indicatorTimeoutRef.current = setTimeout(() => {
                setSwipeIndicator(prev => ({ ...prev, visible: false }));
            }, 1000);
        };

        wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
        wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
        wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
        wrapper.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        return () => {
            wrapper.removeEventListener('touchstart', handleTouchStart);
            wrapper.removeEventListener('touchmove', handleTouchMove);
            wrapper.removeEventListener('touchend', handleTouchEnd);
            wrapper.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [brightness, volume]);

    const renderOverlays = () => (
        <>
            {/* Brightness Overlay (Darkness overlay to simulate brightness reduction) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: `rgba(0,0,0,${1 - brightness})`, pointerEvents: 'none', zIndex: 100 }} />

            {/* Swipe Indicator (Sun/Volume) */}
            {swipeIndicator.visible && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '15px 20px', borderRadius: '10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 101, pointerEvents: 'none'
                }}>
                    {swipeIndicator.type === 'brightness' ? <Sun size={32} /> : (swipeIndicator.value === 0 ? <VolumeX size={32} /> : <Volume2 size={32} />)}
                    <div style={{ width: '80px', height: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${swipeIndicator.value * 100}%`, height: '100%', backgroundColor: '#fff' }} />
                    </div>
                </div>
            )}
        </>
    );

    const getGoogleDriveVideoId = (url) => {
        if (!url) return null;
        if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return null;
        const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1) return match1[1];
        const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match2) return match2[1];
        return null;
    };

    const driveId = getGoogleDriveVideoId(videoUrl);
    const isBunnyVideo = videoUrl?.includes('bunny.net') || videoUrl?.includes('mediadelivery.net');
    const isM3U8 = videoUrl?.includes('.m3u8');

    // Listen for Bunny.net player events (moved to top level to obey Hook rules)
    useEffect(() => {
        hasEndedRef.current = false;

        if (!isBunnyVideo) return;

        const handleMessage = (event) => {
            let data = null;

            if (event.data && typeof event.data === 'string') {
                try {
                    data = JSON.parse(event.data);
                } catch (e) { /* ignore */ }
            } else if (event.data && typeof event.data === 'object') {
                data = event.data;
            }

            if (!data) return;

            // Handle 'ready' event -> Force Play if autoPlay
            if ((data.event === 'ready' || data.type === 'ready') && autoPlay) {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
                }
            }

            // Handle 'ended' event
            if (data.type === 'ended' || data.type === 'finish' || data.event === 'video.completed' || data.event === 'ended') {
                if (!hasEndedRef.current) {
                    onEnded && onEnded();
                    hasEndedRef.current = true;
                }
            }

            // Fallback: Check 'timeupdate' for completion
            if (data.event === 'timeupdate' || data.type === 'timeupdate') {
                const value = data.value || data.data;
                if (value && typeof value.currentTime === 'number' && typeof value.duration === 'number') {
                    const { currentTime, duration } = value;
                    if (duration > 0 && (duration - currentTime) <= 1) {
                        if (!hasEndedRef.current) {
                            onEnded && onEnded();
                            hasEndedRef.current = true;
                        }
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onEnded, videoUrl, isBunnyVideo, autoPlay]);


    // Google Drive Video
    if (driveId) {
        return (
            <div className="video-wrapper" ref={wrapperRef} style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe
                    src={`https://drive.google.com/file/d/${driveId}/preview`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                    allow={`${autoPlay ? 'autoplay; ' : ''}encrypted-media; fullscreen`}
                    allowFullScreen
                    title="Google Drive Video"
                ></iframe >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', zIndex: 20, backgroundColor: 'transparent' }}></div>
                {renderOverlays()}
                {children}
            </div >
        );
    }

    // Bunny.net Video
    if (isBunnyVideo) {
        // Ensure autoplay is enabled in the URL if it's not a generic file URL
        const connector = videoUrl.includes('?') ? '&' : '?';
        // URL params: autoplay, muted=true (helper), playsinline=true (mobile)
        const finalBunnyUrl = `${videoUrl}${connector}autoplay=${autoPlay}&muted=false&playsinline=true`;


        return (
            <div className="video-wrapper" ref={wrapperRef} style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe
                    ref={iframeRef}
                    src={finalBunnyUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                    allow={`accelerometer; gyroscope; ${autoPlay ? 'autoplay; ' : ''}encrypted-media; picture-in-picture; clipboard-write; fullscreen`}
                    allowFullScreen={true}
                    title="Bunny.net Video"
                ></iframe>
                {renderOverlays()}
                {children}
            </div>
        );
    }

    if (isM3U8) {
        return (
            <div className="video-wrapper" ref={wrapperRef} style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <HlsVideoPlayer videoUrl={videoUrl} onEnded={onEnded} volume={volume} autoPlay={autoPlay}>
                    {children}
                </HlsVideoPlayer>
                {renderOverlays()}
            </div>
        );
    }

    // YouTube / Generic (ReactPlayer)
    // Construct playable URL
    const playableUrl = videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null);

    // ReactPlayer specific states
    const reactPlayerRef = useRef(null);
    const [rpPlaying, setRpPlaying] = useState(autoPlay);
    const [showRpControls, setShowRpControls] = useState(false);

    // Auto-play when the URL changes if autoPlay is enabled
    useEffect(() => {
        setRpPlaying(autoPlay);
    }, [playableUrl, autoPlay]);

    // Animation states for ReactPlayer
    const [animRpRewind, setAnimRpRewind] = useState(false);
    const [animRpForward, setAnimRpForward] = useState(false);

    const handleRpRewind = (e) => {
        e.stopPropagation();
        if (reactPlayerRef.current) {
            const curr = reactPlayerRef.current.getCurrentTime();
            reactPlayerRef.current.seekTo(Math.max(0, curr - 10), 'seconds');
        }
        setAnimRpRewind(true);
        setTimeout(() => setAnimRpRewind(false), 300);
    };

    const handleRpForward = (e) => {
        e.stopPropagation();
        if (reactPlayerRef.current) {
            const curr = reactPlayerRef.current.getCurrentTime();
            const dur = reactPlayerRef.current.getDuration();
            reactPlayerRef.current.seekTo(Math.min(dur, curr + 10), 'seconds');
        }
        setAnimRpForward(true);
        setTimeout(() => setAnimRpForward(false), 300);
    };

    const toggleRpPlayPause = (e) => {
        e.stopPropagation();
        setRpPlaying(prev => !prev);
    };

    return (
        <div
            ref={wrapperRef}
            className={`video-wrapper ${showRpControls || !rpPlaying ? 'vjs-user-active' : 'vjs-user-inactive'}`}
            style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}
            onMouseEnter={() => setShowRpControls(true)}
            onMouseLeave={() => setShowRpControls(false)}
            onClick={() => setShowRpControls(true)}
        >
            <ReactPlayer
                ref={reactPlayerRef}
                url={playableUrl}
                width="100%"
                height="100%"
                playing={rpPlaying}
                volume={volume}
                controls={true}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1, playsinline: 1 }
                    }
                }}
                onPlay={() => setRpPlaying(true)}
                onPause={() => setRpPlaying(false)}
                onEnded={onEnded}
                onError={(e) => console.error("Video Error:", e)}
            />

            {/* Centered YouTube-style Controls for ReactPlayer */}
            <div
                className="vjs-custom-center-controls"
                style={{
                    opacity: showRpControls || !rpPlaying ? 1 : 0,
                }}
            >
                <button onClick={handleRpRewind} className="vjs-custom-control-btn" style={{ position: 'relative' }}>
                    <RotateCcw size={32} className={animRpRewind ? 'anim-rotate-ccw' : ''} />
                    <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold', marginTop: '1px' }}>10</span>
                </button>
                <button onClick={toggleRpPlayPause} className="vjs-custom-control-btn">
                    {rpPlaying ? <Pause size={40} /> : <Play size={40} style={{ marginLeft: '4px' }} />}
                </button>
                <button onClick={handleRpForward} className="vjs-custom-control-btn" style={{ position: 'relative' }}>
                    <RotateCw size={32} className={animRpForward ? 'anim-rotate-cw' : ''} />
                    <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold', marginTop: '1px' }}>10</span>
                </button>
            </div>

            {renderOverlays()}
            {children}
        </div>
    );
};

export default VideoPlayer;
