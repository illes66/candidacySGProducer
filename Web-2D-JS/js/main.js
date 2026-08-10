/**
 * MAIN.JS
 * Entry point - Initializes the entire playable
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("=== Say Games Producer Playable ===");
    console.log("Initializing...");

    // Initialize game
    GameManagerInstance.initialize();

    // Optional: Setup debugging
    if (CONFIG.DEBUG) {
        window.gameState = () => GameManagerInstance.getState();
        window.resetGame = () => {
            GameManagerInstance.reset();
            location.reload();
        };
        console.log("Debug mode ON - use gameState() and resetGame() in console");
    }

    console.log("✅ Playable ready!");
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    if (GameManagerInstance.getState().completed < CONFIG.TOTAL_REQUIREMENTS) {
        e.preventDefault();
        e.returnValue = '';
    }
});
