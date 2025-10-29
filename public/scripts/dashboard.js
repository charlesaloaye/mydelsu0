// Sidebar Toggle Functionality
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const body = document.body;

if (openSidebar) {
    openSidebar.addEventListener("click", () => {
        body.classList.add("sidebar-active");
    });
}

function closeSidebarMenu() {
    body.classList.remove("sidebar-active");
}

if (closeSidebar) {
    closeSidebar.addEventListener("click", closeSidebarMenu);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebarMenu);
}

// Ads Banner Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".ads-banner .ad-slide");
const dots = document.querySelectorAll(".indicator-dots .dot");
const bannerContainer = document.querySelector(".ads-banner");
const leftNav = document.querySelector(".banner-nav-left");
const rightNav = document.querySelector(".banner-nav-right");

function showAdSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    if (bannerContainer) {
        bannerContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function nextAdSlide() {
    currentSlide++;
    showAdSlide(currentSlide);
}

function prevAdSlide() {
    currentSlide--;
    showAdSlide(currentSlide);
}

if (leftNav) leftNav.addEventListener("click", prevAdSlide);
if (rightNav) rightNav.addEventListener("click", nextAdSlide);

let adSlideInterval;
if (slides.length > 1) {
    adSlideInterval = setInterval(nextAdSlide, 5000);
}

if (bannerContainer) {
    bannerContainer.addEventListener("mouseenter", () => {
        clearInterval(adSlideInterval);
    });

    bannerContainer.addEventListener("mouseleave", () => {
        clearInterval(adSlideInterval);
        adSlideInterval = setInterval(nextAdSlide, 5000);
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentSlide = index;
        showAdSlide(currentSlide);
    });
});
