// DOM elements
const percentageCounter = document.getElementById("percentageCounter");
const setupMessage = document.getElementById("setupMessage");
const loadingBar = document.getElementById("loadingBar");
const whatsappButton = document.getElementById("whatsappButton");
const activationNote = document.getElementById("activationNote");
const userInitials = document.getElementById("userInitials");

// Setup messages
const setupMessages = [
    "Setting up your dashboard...",
    "Checking account status...",
    "Preparing your tools...",
    "Loading academic resources...",
    "Configuring your preferences...",
    "Setting up community access...",
];

// User data (would normally come from login)
const userEmail = localStorage.getItem("userEmail") || "";

// Set user initials in avatar
if (userInitials && userEmail) {
    userInitials.textContent = userEmail.charAt(0).toUpperCase();
}

// Update WhatsApp link with user's email
if (whatsappButton && userEmail) {
    const currentHref = whatsappButton.getAttribute("href");
    whatsappButton.setAttribute(
        "href",
        currentHref + encodeURIComponent(userEmail)
    );
}

// Animation variables
let currentProgress = 0;
let currentMessageIndex = 0;

// Main progress animation function
function animateProgress() {
    if (currentProgress < 98) {
        // Calculate increment - faster at first, slower as we approach 98%
        let increment;
        if (currentProgress < 50) {
            increment = Math.random() * 5 + 2; // Faster at beginning (2-7)
        } else if (currentProgress < 80) {
            increment = Math.random() * 3 + 1; // Medium speed (1-4)
        } else {
            increment = Math.random() * 0.8 + 0.2; // Slower at end (0.2-1)
        }

        // Ensure we don't go over 98%
        currentProgress = Math.min(98, currentProgress + increment);

        // Update UI
        updateUI();

        // Continue animation with random delay
        const delay = Math.random() * 300 + 100; // 100-400ms
        setTimeout(animateProgress, delay);
    } else {
        // We've reached 98%, show activation button
        showActivationButton();
    }
}

// Update UI elements
function updateUI() {
    // Update percentage counter
    percentageCounter.textContent = Math.round(currentProgress) + "%";

    // Update loading bar
    loadingBar.style.width = currentProgress + "%";
}

// Change setup message periodically
function changeSetupMessage() {
    if (currentProgress < 98) {
        // Fade out
        setupMessage.style.opacity = 0;

        setTimeout(() => {
            // Change message
            currentMessageIndex =
                (currentMessageIndex + 1) % setupMessages.length;
            setupMessage.textContent = setupMessages[currentMessageIndex];

            // Fade in
            setupMessage.style.opacity = 1;
        }, 500);
    }
}

// Show activation button when progress is complete
function showActivationButton() {
    // Pause briefly at 98%
    setTimeout(() => {
        // Change setup message
        setupMessage.style.opacity = 0;

        setTimeout(() => {
            setupMessage.textContent = "Almost done! Final step required:";
            setupMessage.style.opacity = 1;
            setupMessage.style.fontWeight = "600";
            setupMessage.style.color = "var(--primary-color)";

            // Show WhatsApp button with pulse animation
            whatsappButton.style.display = "flex";
            whatsappButton.classList.add("pulse-button");

            // Show activation note
            activationNote.style.display = "block";
        }, 500);
    }, 800);
}

// Initial setup
setupMessage.style.transition = "opacity 0.5s ease";

// Start progress animation after a short delay
setTimeout(animateProgress, 500);

// Change setup message every 3 seconds
setInterval(changeSetupMessage, 3000);
