// DOM Elements
const emailForm = document.getElementById("emailForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const codeInputs = [
    document.getElementById("code1"),
    document.getElementById("code2"),
    document.getElementById("code3"),
    document.getElementById("code4"),
    document.getElementById("code5"),
    document.getElementById("code6"),
];
const codeError = document.getElementById("codeError");
const countdown = document.getElementById("countdown");
const resendLink = document.getElementById("resendLink");

const newPasswordForm = document.getElementById("newPasswordForm");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const step1Indicator = document.getElementById("step1Indicator");
const step2Indicator = document.getElementById("step2Indicator");
const step3Indicator = document.getElementById("step3Indicator");

const backToPhoneBtn = document.getElementById("backToPhoneBtn");
const backToCodeBtn = document.getElementById("backToCodeBtn");
const verifyCodeBtn = document.getElementById("verifyCodeBtn");

const successMessage = document.getElementById("successMessage");

// Toggle password visibility
const toggleNewPassword = document.getElementById("toggleNewPassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

function togglePasswordVisibility(inputField, toggleBtn) {
    toggleBtn.addEventListener("click", function () {
        const type =
            inputField.getAttribute("type") === "password"
                ? "text"
                : "password";
        inputField.setAttribute("type", type);

        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });
}

togglePasswordVisibility(newPassword, toggleNewPassword);
togglePasswordVisibility(confirmPassword, toggleConfirmPassword);

// Step navigation
function goToStep(stepNumber) {
    // Hide all steps
    [step1, step2, step3].forEach((step) => {
        step.classList.remove("active");
    });

    // Reset step indicators
    [step1Indicator, step2Indicator, step3Indicator].forEach((indicator) => {
        indicator.classList.remove("active");
        indicator.classList.remove("completed");
    });

    // Show active step
    if (stepNumber === 1) {
        step1.classList.add("active");
        step1Indicator.classList.add("active");
    } else if (stepNumber === 2) {
        step2.classList.add("active");
        step1Indicator.classList.add("completed");
        step2Indicator.classList.add("active");
    } else if (stepNumber === 3) {
        step3.classList.add("active");
        step1Indicator.classList.add("completed");
        step2Indicator.classList.add("completed");
        step3Indicator.classList.add("active");
    }
}

// Countdown timer
let timerInterval;
function startCountdown(duration) {
    let timer = duration;
    const minutes = parseInt(timer / 60, 10);
    const seconds = parseInt(timer % 60, 10);

    countdown.textContent =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

    timerInterval = setInterval(function () {
        timer--;

        const minutes = parseInt(timer / 60, 10);
        const seconds = parseInt(timer % 60, 10);

        countdown.textContent =
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds);

        if (timer <= 0) {
            clearInterval(timerInterval);
            resendLink.style.display = "inline";
        }
    }, 1000);
}

// Verification code input handling
codeInputs.forEach((input, index) => {
    input.addEventListener("keyup", function (e) {
        // If a digit is entered, move to next input
        if (this.value.length === 1 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }

        // If backspace is pressed, move to previous input
        if (e.key === "Backspace" && index > 0 && this.value.length === 0) {
            codeInputs[index - 1].focus();
        }
    });

    // Only allow digits
    input.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
    });
});

// Form submissions
emailForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset error message
    emailError.style.display = "none";

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.style.display = "block";
        return;
    }

    // Proceed to step 2
    goToStep(2);

    // Start countdown timer (3 minutes)
    startCountdown(180);

    // Reset verification code inputs
    codeInputs.forEach((input) => {
        input.value = "";
    });
    codeInputs[0].focus();

    // Hide resend link initially
    resendLink.style.display = "none";
});

verifyCodeBtn.addEventListener("click", function () {
    // Reset error message
    codeError.style.display = "none";

    // Check if all code inputs are filled
    let isComplete = true;
    codeInputs.forEach((input) => {
        if (input.value.length !== 1) {
            isComplete = false;
        }
    });

    if (!isComplete) {
        codeError.style.display = "block";
        return;
    }

    // Clear the countdown timer
    clearInterval(timerInterval);

    // Proceed to step 3
    goToStep(3);

    // Reset password fields
    newPassword.value = "";
    confirmPassword.value = "";
});

newPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset error messages
    newPasswordError.style.display = "none";
    confirmPasswordError.style.display = "none";

    let isValid = true;

    // Validate password (min 8 characters)
    if (newPassword.value.length < 8) {
        newPasswordError.style.display = "block";
        isValid = false;
    }

    // Validate passwords match
    if (newPassword.value !== confirmPassword.value) {
        confirmPasswordError.style.display = "block";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show success message
    successMessage.style.display = "block";

    // Hide form content
    step3.querySelector("form").style.display = "none";

    // Redirect to login after 3 seconds
    setTimeout(function () {
        window.location.href = "/login";
    }, 3000);
});

// Navigation buttons
backToPhoneBtn.addEventListener("click", function (e) {
    e.preventDefault();
    goToStep(1);
    clearInterval(timerInterval);
});

backToCodeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    goToStep(2);
    startCountdown(180);
});

// Resend code link
resendLink.addEventListener("click", function (e) {
    e.preventDefault();
    startCountdown(180);
    resendLink.style.display = "none";

    // Show a temporary message
    const timer = document.querySelector(".timer");
    const originalText = timer.innerHTML;
    timer.innerHTML =
        '<span style="color: #4caf50;">Verification code resent!</span>';

    setTimeout(function () {
        timer.innerHTML = originalText;
        resendLink.style.display = "none";
    }, 2000);
});
