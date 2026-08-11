/**
 * ANIMATIONCONTROLLER.JS
 * Manages all animations using Anime.js
 * Handles box animations, sparkles, highlights, and transitions
 */

class AnimationController {
    constructor() {
        this.elements = {};
        this.isInitialized = false;
    }

    /**
     * Initialize animation controller
     */
    static initialize() {
        if (CONFIG.DEBUG) console.log("[AnimationController] Initializing...");

        AnimationController.elements = {
            box: document.getElementById('interactiveBox'),
            boxInner: document.querySelector('.box-inner'),
            cvScreen: document.querySelector('.cv-screen'),
            offerScreen: document.querySelector('.offer-screen'),
            experiencePanel: document.getElementById('experiencePanel'),
            finalMessage: document.getElementById('finalMessage')
        };

        if (CONFIG.DEBUG) console.log("[AnimationController] Ready");
    }

    /**
     * Play intro animation (fade in)
     */
    static playIntroAnimation() {
        if (CONFIG.DEBUG) console.log("[AnimationController] Playing intro animation...");

        anime({
            targets: 'body',
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuad'
        });

        // Screen fade in
        anime({
            targets: '.screen',
            opacity: [0.3, 1],
            translateY: [20, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });

        // Box fade in and scale
        anime({
            targets: AnimationController.elements.box,
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 700,
            delay: 200,
            easing: 'easeOutElastic(1, .6)'
        });

        // Start box bobbing
        AnimationController.startBoxBobbing();
    }

    /**
     * Start continuous bobbing animation on box
     */
    static startBoxBobbing() {
        anime({
            targets: AnimationController.elements.boxInner,
            translateY: [-10, -10],
            duration: 2000,
            easing: 'easeInOutSine',
            loop: true
        });
    }

    /**
     * Pulse effect when box is clicked
     */
    static pulseBox() {
        anime({
            targets: AnimationController.elements.box,
            scale: [1, 1.2, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }

    /**
     * Play sparkles/particle VFX from box
     * Creates animated sparkle elements
     */
    static playBoxSparkles() {
        if (CONFIG.DEBUG) console.log("[AnimationController] Playing sparkles...");

        const sparkleCount = 12;
        const box = AnimationController.elements.box;
        const boxRect = box.getBoundingClientRect();
        const centerX = boxRect.left + boxRect.width / 2;
        const centerY = boxRect.top + boxRect.height / 2;

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.width = '8px';
            sparkle.style.height = '8px';
            sparkle.style.background = `hsl(${Math.random() * 60 + 200}, 100%, 60%)`;
            sparkle.style.borderRadius = '50%';
            sparkle.style.left = centerX + 'px';
            sparkle.style.top = centerY + 'px';
            sparkle.style.boxShadow = `0 0 10px hsl(${Math.random() * 60 + 200}, 100%, 60%)`;
            document.body.appendChild(sparkle);

            const angle = (i / sparkleCount) * Math.PI * 2;
            const distance = 80;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;

            anime({
                targets: sparkle,
                translateX: endX,
                translateY: endY,
                opacity: [1, 0],
                scale: [1, 0.3],
                duration: 800,
                easing: 'easeOutQuad',
                complete: () => sparkle.remove()
            });
        }
    }

    /**
     * Highlight requirement on offer screen
     */
    static highlightRequirement(requirementIndex, highlight) {
        const requirementItem = document.querySelector(`.requirement-item[data-requirement="${requirementIndex}"]`);
        
        if (requirementItem) {
            if (highlight) {
                anime({
                    targets: requirementItem,
                    backgroundColor: 'rgba(255, 255, 0, 0.2)',
                    scale: [1, 1.05],
                    duration: 500,
                    easing: 'easeOutQuad'
                });
            } else {
                anime({
                    targets: requirementItem,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        }
    }

    /**
     * Animate checkmark appearing on CV screen
     */
    static animateCheckmark(requirementIndex) {
        const cvItem = document.querySelector(`.cv-item[data-requirement="${requirementIndex}"]`);
        
        if (cvItem) {
            const checkmark = cvItem.querySelector('.checkmark');
            
            anime({
                targets: cvItem,
                scale: [1, 1.05, 1],
                backgroundColor: ['rgba(255, 255, 255, 0.05)', 'rgba(0, 255, 136, 0.2)', 'rgba(255, 255, 255, 0.05)'],
                duration: 600,
                easing: 'easeOutQuad'
            });

            if (checkmark) {
                anime({
                    targets: checkmark,
                    opacity: [0, 1],
                    scale: [0.3, 1],
                    duration: 500,
                    delay: 100,
                    easing: 'easeOutQuad'
                });
            }
        }
    }

    /**
     * Play final animation - screens dim, everything fades
     */
    static playFinalAnimation() {
        if (CONFIG.DEBUG) console.log("[AnimationController] Playing final animation...");

        // Dim screens
        anime({
            targets: '.screen',
            opacity: [1, 0.2],
            duration: 800,
            easing: 'easeOutQuad'
        });

        // Hide box
        anime({
            targets: AnimationController.elements.box,
            scale: [1, 0.5],
            opacity: [1, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });

        // Hide click prompt
        anime({
            targets: '#clickPrompt',
            opacity: [1, 0],
            duration: 400,
            easing: 'easeOutQuad'
        });
    }

    /**
     * Utility: Create a custom animation
     * For advanced animations with Anime.js
     */
    static createAnimation(config) {
        return anime(config);
    }

    /**
     * Stop all animations (for reset)
     */
    static stopAll() {
        anime.set('*', {
            autoplay: false
        });
        if (CONFIG.DEBUG) console.log("[AnimationController] All animations stopped");
    }
}
