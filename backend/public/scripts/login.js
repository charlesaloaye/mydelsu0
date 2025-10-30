// Password toggle functionality
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {
    // Toggle type attribute
    const type =
        password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Toggle eye icon
    this.querySelector("i").classList.toggle("fa-eye");
    this.querySelector("i").classList.toggle("fa-eye-slash");
});

// // Form submission
// const loginForm = document.getElementById("loginForm");
// loginForm.addEventListener("submit", function (e) {
//     e.preventDefault();

//     const phone = document.getElementById("phone").value;
//     const password = document.getElementById("password").value;

//     // Basic validation
//     if (!phone || !password) {
//         alert("Please fill in all fields");
//         return;
//     }

//     // Phone number validation
//     const phoneRegex = /^\d{11}$/;
//     if (!phoneRegex.test(phone)) {
//         alert("Please enter a valid phone number (11 digits)");
//         return;
//     }

//     // Here you would normally handle authentication
//     // For demo, redirect to dashboard
//     window.location.href = "dashboard";
// });
