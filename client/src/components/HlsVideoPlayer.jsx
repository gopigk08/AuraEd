import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, RotateCw, Play, Pause } from 'lucide-react';
import videojs from './videojs-setup';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';

// Register custom Quality Menu logic outside the component so it's only done once
let QualityMenuRegistered = false;

const registerQualityMenu = () => {
    if (QualityMenuRegistered) return;

    const MenuButton = videojs.getComponent('MenuButton');
    const MenuItem = videojs.getComponent('MenuItem');

    class QualityMenuItem extends MenuItem {
        constructor(player, options) {
            super(player, options);
            this.qualityLevel = options.qualityLevel;
            // The method 'handleClick' is called automatically by MenuItem when clicked
        }

        handleClick(event) {
            super.handleClick(event);
            const player = this.player();
            const levels = player.qualityLevels();

            for (let i = 0; i < levels.length; i++) {
                if (this.qualityLevel === 'Auto') {
                    levels[i].enabled = true;
                } else {
                    levels[i].enabled = (levels[i].height === this.qualityLevel.height);
                }
            }

            // Re-render items selection state
            const qualityButton = player.controlBar.getChild('QualityMenuButton');
            if (qualityButton && qualityButton.items) {
                qualityButton.items.forEach(item => {
                    item.selected(item === this);
                });
            }
        }
    }

    class QualityMenuButton extends MenuButton {
        constructor(player, options) {
            super(player, options);
            this.controlText('Quality');
        }

        buildCSSClass() {
            return `vjs-quality-menu-button ${super.buildCSSClass()}`;
        }

        createItems() {
            const items = [];
            const player = this.player();
            const levels = player.qualityLevels();

            items.push(new QualityMenuItem(player, {
                label: 'Auto',
                qualityLevel: 'Auto',
                selected: true,
                selectable: true
            }));

            const heights = new Set();
            for (let i = 0; i < levels.length; i++) {
                if (levels[i].height) heights.add(levels[i].height);
            }

            Array.from(heights).sort((a, b) => b - a).forEach(height => {
                let level = null;
                for (let i = 0; i < levels.length; i++) {
                    if (levels[i].height === height) { level = levels[i]; break; }
                }
                if (level) {
                    items.push(new QualityMenuItem(player, {
                        label: height + 'p',
                        qualityLevel: level,
                        selected: false,
                        selectable: true
                    }));
                }
            });

            return items;
        }
    }

    videojs.registerComponent('QualityMenuItem', QualityMenuItem);
    videojs.registerComponent('QualityMenuButton', QualityMenuButton);
    QualityMenuRegistered = true;
};

const HlsVideoPlayer = ({ videoUrl, onEnded, volume = 1, children, autoPlay = false }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [portalContainer, setPortalContainer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay); // default autoplay
    const [showControls, setShowControls] = useState(true);

    // Animation states
    const [animRewind, setAnimRewind] = useState(false);
    const [animForward, setAnimForward] = useState(false);

    // Keep track of the latest onEnded callback without triggering re-renders
    const onEndedRef = useRef(onEnded);
    useEffect(() => {
        onEndedRef.current = onEnded;
    }, [onEnded]);

    useEffect(() => {
        if (!playerRef.current) {
            registerQualityMenu();

            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, {
                autoplay: autoPlay,
                controls: true,
                responsive: true,
                fluid: true,
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                controlBar: {
                    remainingTimeDisplay: false,
                    currentTimeDisplay: true,
                    timeDivider: true,
                    durationDisplay: true
                },
                sources: [{
                    src: videoUrl,
                    type: 'application/x-mpegURL'
                }]
            }, () => {
                videojs.log('player is ready');
                setPortalContainer(videoElement);

                player.on('ended', () => {
                    if (onEndedRef.current) {
                        onEndedRef.current();
                    }
                });

                // Sync React state with video.js state for our custom overlay
                player.on('play', () => setIsPlaying(true));
                player.on('pause', () => setIsPlaying(false));
                player.on('useractive', () => setShowControls(true));
                player.on('userinactive', () => setShowControls(false));

                const qualityLevels = player.qualityLevels();
                qualityLevels.on('addqualitylevel', function (event) {
                    const q = event.qualityLevel;
                    if (q.height) {
                        console.log('Added quality: ' + q.height + 'p');
                    }
                    // Rebuild the menu when new levels are detected
                    const qualityButton = player.controlBar.getChild('QualityMenuButton');
                    if (qualityButton) {
                        qualityButton.update();
                    }
                });

                // Add the custom button to control bar cleanly
                let qualityButton = player.controlBar.getChild('QualityMenuButton');
                if (!qualityButton) {
                    // Try to insert it before the fullscreen toggle
                    const fullScreenIndex = player.controlBar.children().findIndex(c => c.name_ === 'FullscreenToggle');
                    const index = fullScreenIndex > -1 ? fullScreenIndex : player.controlBar.children().length;

                    qualityButton = player.controlBar.addChild('QualityMenuButton', {}, index);

                    // Force the icon to use the gear icon using CSS
                    const icon = qualityButton.el().querySelector('.vjs-icon-placeholder');
                    if (icon) {
                        icon.classList.add('vjs-icon-cog');
                    }
                }

                // Handle mobile auto-rotate & play on maximize
                player.on('fullscreenchange', () => {
                    const isMobileApp = window.innerWidth <= 768; // Mobile user detector

                    if (player.isFullscreen()) {
                        if (isMobileApp) {
                            if (window.screen?.orientation?.lock) {
                                window.screen.orientation.lock('landscape').catch(() => { });
                            }
                            player.play(); // Play video if paused when turning fullscreen
                        }
                    } else {
                        if (isMobileApp) {
                            if (window.screen?.orientation?.unlock) {
                                window.screen.orientation.unlock();
                            }
                        }
                    }
                });
            });
        }
    }, []); // Empty dependency array ensures this runs only once for initialization

    // Update player source when videoUrl changes
    useEffect(() => {
        const player = playerRef.current;
        if (player) {
            // Check if URL is completely new before setting src to avoid restart
            const currentSrc = player.src();
            if (!currentSrc || !currentSrc.includes(videoUrl)) {
                player.src({ src: videoUrl, type: 'application/x-mpegURL' });
                // Play automatically when source changes if autoPlay is true
                if (autoPlay) {
                    const playPromise = player.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Auto-play was prevented. user interaction required.", error);
                        });
                    }
                }
            }
        }
    }, [videoUrl, autoPlay]);

    // Sync volume from props
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.volume(volume);
        }
    }, [volume]);

    // Dispose the player on unmount
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    const handleRewind = (e) => {
        e.stopPropagation();
        if (playerRef.current) {
            const curr = playerRef.current.currentTime();
            playerRef.current.currentTime(Math.max(0, curr - 10));
        }
        setAnimRewind(true);
        setTimeout(() => setAnimRewind(false), 300);
    };

    const handleForward = (e) => {
        e.stopPropagation();
        if (playerRef.current) {
            const curr = playerRef.current.currentTime();
            const dur = playerRef.current.duration();
            playerRef.current.currentTime(Math.min(dur, curr + 10));
        }
        setAnimForward(true);
        setTimeout(() => setAnimForward(false), 300);
    };

    const togglePlayPause = (e) => {
        e.stopPropagation();
        if (playerRef.current) {
            if (playerRef.current.paused()) {
                playerRef.current.play();
            } else {
                playerRef.current.pause();
            }
        }
    };

    return (
        <div data-vjs-player>
            <div ref={videoRef} />
            {portalContainer && createPortal(
                <>
                    {/* Centered YouTube-style Controls */}
                    <div
                        className="vjs-custom-center-controls"
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: '50px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem',
                            pointerEvents: 'none', zIndex: 10,
                            opacity: showControls || !isPlaying ? 1 : 0,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        <button onClick={handleRewind} className="vjs-custom-control-btn" style={{ position: 'relative' }}>
                            <RotateCcw size={32} className={animRewind ? 'anim-rotate-ccw' : ''} />
                            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold', marginTop: '1px' }}>10</span>
                        </button>
                        <button onClick={togglePlayPause} className="vjs-custom-control-btn play-pause">
                            {isPlaying ? <Pause size={40} /> : <Play size={40} style={{ marginLeft: '4px' }} />}
                        </button>
                        <button onClick={handleForward} className="vjs-custom-control-btn" style={{ position: 'relative' }}>
                            <RotateCw size={32} className={animForward ? 'anim-rotate-cw' : ''} />
                            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold', marginTop: '1px' }}>10</span>
                        </button>
                    </div>

                    {/* Appended Children */}
                    {children}
                </>,
                portalContainer
            )}
        </div>
    );
}
export default HlsVideoPlayer;
