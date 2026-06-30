/**
 * Intro cinematográfica — compatível com iOS/Android (prime do vídeo + scrub estável).
 */
function initIntroScroll() {
    const introContainer = document.getElementById('intro-container');
    const introVideoZoom = document.getElementById('intro-video-zoom');
    const introVideo = document.getElementById('intro-video');

    if (!introContainer || !introVideoZoom || !introVideo) {
        return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        introContainer.style.display = 'none';
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
        ignoreMobileResize: true,
    });

    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let timelineBuilt = false;
    let videoPrimed = false;

    const configureVideoElement = () => {
        introVideo.muted = true;
        introVideo.defaultMuted = true;
        introVideo.playsInline = true;
        introVideo.setAttribute('muted', '');
        introVideo.setAttribute('playsinline', '');
        introVideo.setAttribute('webkit-playsinline', '');
    };

    const paintFirstFrame = () => {
        try {
            if (introVideo.readyState >= HTMLMediaElement.HAVE_METADATA) {
                introVideo.currentTime = 0.001;
            }
        } catch (_) {
            /* ignore seek errors on iOS before buffer */
        }
        introVideo.classList.add('is-ready');
    };

    /** iOS/Safari: play()+pause() destrava o decoder e exibe o primeiro frame */
    const primeVideo = async () => {
        if (videoPrimed) {
            return true;
        }

        configureVideoElement();
        paintFirstFrame();

        try {
            const playPromise = introVideo.play();
            if (playPromise && typeof playPromise.then === 'function') {
                await playPromise;
            }
            introVideo.pause();
            introVideo.currentTime = 0;
            introVideo.classList.add('is-ready');
            videoPrimed = true;
            return true;
        } catch (_) {
            return false;
        }
    };

    const lockZoomLayer = () => {
        gsap.set(introVideoZoom, {
            transformOrigin: '48% 38%',
            scale: 1,
            opacity: 1,
            x: 0,
            y: 0,
        });
        gsap.set(introVideo, { opacity: 1 });
    };

    const buildTimeline = () => {
        if (timelineBuilt) {
            return;
        }

        const videoDuration = introVideo.duration;

        if (!videoDuration || !Number.isFinite(videoDuration)) {
            introContainer.style.display = 'none';
            return;
        }

        timelineBuilt = true;

        document.documentElement.classList.add('intro-scroll-active');
        document.body.classList.add('intro-active');

        introVideo.pause();
        introVideo.currentTime = 0;

        lockZoomLayer();
        gsap.set('.intro-ui', { opacity: 1 });
        gsap.set(introContainer, { autoAlpha: 1, pointerEvents: 'auto' });

        const videoScrub = { time: 0 };

        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: introContainer,
                start: 'top top',
                end: '+=2500',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        tl.to('.intro-ui', { opacity: 0, duration: 0.15 });

        tl.to(videoScrub, {
            time: videoDuration,
            duration: 0.55,
            onUpdate: () => {
                if (introVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                    introVideo.currentTime = videoScrub.time;
                }
            },
        });

        tl.to(introVideoZoom, {
            scale: 30,
            opacity: 0,
            duration: 0.25,
        });

        tl.to(
            introContainer,
            {
                autoAlpha: 0,
                duration: 0.25,
            },
            '<'
        );

        tl.eventCallback('onUpdate', () => {
            const done = tl.progress() >= 0.999;
            introContainer.style.pointerEvents = done ? 'none' : 'auto';
        });
    };

    const unlockFromGesture = () => {
        primeVideo().then(() => {
            paintFirstFrame();
            if (!timelineBuilt) {
                buildTimeline();
            }
            ScrollTrigger.refresh();
        });
    };

    const bindGestureUnlock = () => {
        const opts = { once: true, passive: true };
        introContainer.addEventListener('touchstart', unlockFromGesture, opts);
        introContainer.addEventListener('touchmove', unlockFromGesture, opts);
        window.addEventListener('touchstart', unlockFromGesture, opts);
    };

    if (isTouchDevice) {
        ScrollTrigger.normalizeScroll(true);
        const hint = introContainer.querySelector('.scroll-indicator p');
        if (hint) {
            hint.textContent = 'Toque e deslize para iniciar';
        }
    }

    introVideo.addEventListener(
        'error',
        () => {
            introContainer.style.display = 'none';
        },
        { once: true }
    );

    if (introVideo.error) {
        introContainer.style.display = 'none';
        return;
    }

    configureVideoElement();
    introVideo.setAttribute('x-webkit-airplay', 'deny');

    introVideo.addEventListener('loadeddata', paintFirstFrame, { once: true });
    introVideo.addEventListener('loadedmetadata', paintFirstFrame, { once: true });

    bindGestureUnlock();

    const start = async () => {
        const primed = await primeVideo();
        buildTimeline();
        ScrollTrigger.refresh();

        if (!primed && isTouchDevice) {
            bindGestureUnlock();
        }
    };

    if (introVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        start();
    } else {
        introVideo.addEventListener('canplay', start, { once: true });
        introVideo.addEventListener('loadeddata', start, { once: true });
    }
}

document.addEventListener('DOMContentLoaded', initIntroScroll);
