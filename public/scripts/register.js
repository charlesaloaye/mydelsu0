// User Type Selection - REMOVED

// Password Visibility Toggle
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("password_confirmation");

function togglePasswordVisibility(inputField, toggleBtn) {
    toggleBtn.addEventListener("click", function () {
        // Toggle type attribute
        const type =
            inputField.getAttribute("type") === "password"
                ? "text"
                : "password";
        inputField.setAttribute("type", type);

        // Toggle eye icon
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });
}

togglePasswordVisibility(password, togglePassword);
togglePasswordVisibility(confirmPassword, toggleConfirmPassword);

// Password Strength Meter
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("passwordStrengthBar");
const strengthText = document.getElementById("passwordStrengthText");

passwordInput.addEventListener("input", function () {
    const password = this.value;
    let strength = 0;

    // Length check
    if (password.length >= 8) {
        strength += 1;
    }

    // Contains number check
    if (/\d/.test(password)) {
        strength += 1;
    }

    // Contains special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    }

    // Contains uppercase letter check
    if (/[A-Z]/.test(password)) {
        strength += 1;
    }

    // Update strength bar and text
    strengthBar.className = "password-strength-bar";

    if (password.length === 0) {
        strengthBar.style.width = "0%";
        strengthText.textContent = "Password strength";
        strengthText.style.color = "";
    } else if (strength < 2) {
        strengthBar.classList.add("weak");
        strengthText.textContent = "Weak password";
        strengthText.style.color = "f44336";
    } else if (strength < 4) {
        strengthBar.classList.add("medium");
        strengthText.textContent = "Medium password";
        strengthText.style.color = "#ffa726";
    } else {
        strengthBar.classList.add("strong");
        strengthText.textContent = "Strong password";
        strengthText.style.color = "#4caf50";
    }
});

// Form Validation and Submission
const registerForm = document.getElementById("registerForm");
const userTypeSelect = document.getElementById("userType");
const fullNameInput = document.getElementById("fullName");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const agreeTermsCheckbox = document.getElementById("agreeTerms");

// Error message elements
const userTypeError = document.getElementById("userTypeError");
const fullNameError = document.getElementById("fullNameError");
const phoneError = document.getElementById("phoneError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    // Reset all error messages
    [
        userTypeError,
        fullNameError,
        phoneError,
        emailError,
        passwordError,
        confirmPasswordError,
    ].forEach((error) => {
        error.style.display = "none";
    });

    // Validate User Type
    if (userTypeSelect.value === "") {
        userTypeError.style.display = "block";
        isValid = false;
    }

    // Validate Full Name
    if (fullNameInput.value.trim().length < 3) {
        fullNameError.style.display = "block";
        isValid = false;
    }

    // Validate Phone Number (11 digits)
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneError.style.display = "block";
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.style.display = "block";
        isValid = false;
    }

    // Validate Password (min 8 characters)
    if (password.value.length < 8) {
        passwordError.style.display = "block";
        isValid = false;
    }

    // Validate Confirm Password
    if (password.value !== confirmPassword.value) {
        confirmPasswordError.style.display = "block";
        isValid = false;
    }

    // Validate Terms Checkbox
    if (!agreeTermsCheckbox.checked) {
        alert("Please agree to the Terms of Service and Privacy Policy");
        isValid = false;
    }

    if (isValid) {
        // Here you would normally send data to backend
        // For demo purposes, show success message and redirect
        alert("Account created successfully! Redirecting to login page...");
        window.location.href = "login.html";
    }
});
