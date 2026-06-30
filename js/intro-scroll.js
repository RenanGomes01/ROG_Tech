/**
 * Intro cinematográfica — zoom no wrapper, vídeo só no currentTime.
 * Sem scrollTo(0) nem display:none no meio da transição (evita salto ao início).
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
        const videoDuration = introVideo.duration;

        if (!videoDuration || !Number.isFinite(videoDuration)) {
            introContainer.style.display = 'none';
            return;
        }

        document.documentElement.classList.add('intro-scroll-active');
        document.body.classList.add('intro-active');

        introVideo.pause();
        introVideo.currentTime = 0;

        lockZoomLayer();
        gsap.set('.intro-ui', { opacity: 1 });
        gsap.set(introContainer, { autoAlpha: 1, pointerEvents: 'auto' });

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

        // A — UI terminal
        tl.to('.intro-ui', { opacity: 0, duration: 0.15 });

        // B — Vídeo até o frame da pupila (só currentTime, sem transform no <video>)
        tl.to(introVideo, {
            currentTime: videoDuration,
            duration: 0.55,
        });

        // C — Zoom só no wrapper (origin fixo no CSS do #intro-video-zoom)
        tl.to(introVideoZoom, {
            scale: 30,
            opacity: 0,
            duration: 0.25,
        });

        // D — Some a caixa preta no mesmo instante do fim do zoom
        tl.to(
            introContainer,
            {
                autoAlpha: 0,
                duration: 0.25,
            },
            '<'
        );

        // Libera cliques no portfólio só quando a intro terminou (ida); no reverso reativa
        tl.eventCallback('onUpdate', () => {
            const done = tl.progress() >= 0.999;
            introContainer.style.pointerEvents = done ? 'none' : 'auto';
        });
    };

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

    const start = () => {
        buildTimeline();
    };

    if (introVideo.readyState >= 2) {
        start();
    } else {
        introVideo.addEventListener('canplay', start, { once: true });
    }
}

document.addEventListener('DOMContentLoaded', initIntroScroll);
