"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    userStatus: "",
    firstName: "",
    lastName: "",
    whatsapp: "",
    email: "",
    password: "",
    confirmPassword: "",
    howDidYouHear: "",
    referralNumber: "",
    socialMedia: "",
    agreeToTerms: false,
  });

  // Check for referral in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refNumber = urlParams.get("ref");
    if (refNumber) {
      setFormData((prev) => ({
        ...prev,
        howDidYouHear: "friend",
        referralNumber: refNumber,
      }));
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const loadingMessages = [
    "Setting up your account...",
    "Adding past questions to your library...",
    "Getting your resources ready...",
    "Preparing your dashboard...",
    "Loading DELSU info...",
    "Setting up your profile...",
    "Getting everything ready for you...",
    "Almost done...",
  ];

  useEffect(() => {
    if (isLoading && progress < 99) {
      const timer = setTimeout(() => {
        setProgress((prev) => {
          const increment = Math.random() * 10 + 5;
          const newProgress = Math.min(prev + increment, 99);

          if (Math.floor(newProgress / 15) > Math.floor(prev / 15)) {
            const messageIndex =
              Math.floor(newProgress / 15) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
          }

          return newProgress;
        });
      }, 500);
      return () => clearTimeout(timer);
    } else if (progress >= 99 && isLoading) {
      setShowConfetti(true);
    }
  }, [isLoading, progress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userStatus)
      newErrors.userStatus = "Please select your status";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^[\d\s+()-]+$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.howDidYouHear) {
      newErrors.howDidYouHear = "Please tell us how you heard about us";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setProgress(0);
    setLoadingMessage(loadingMessages[0]);

    // Map frontend fields (camelCase) to backend expected snake_case
    const payload = {
      user_status: formData.userStatus,
      first_name: formData.firstName,
      last_name: formData.lastName,
      whatsapp: formData.whatsapp,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      how_did_you_hear: formData.howDidYouHear,
      referral_number: formData.referralNumber || null,
      social_media: formData.socialMedia || null,
      agree_to_terms: formData.agreeToTerms,
    };

    try {
      const response = await api.register(payload);

      // If registration returns token, store it
      if (response?.success && response?.data?.token) {
        api.setToken(response.data.token);
      }

      // Proceed with existing loading UI flow; show final activation step
      setProgress((p) => (p < 90 ? 90 : p));
      setLoadingMessage("Preparing your dashboard...");
    } catch (err) {
      // Stop loader and show validation/server errors
      setIsLoading(false);

      // Map backend validation errors (snake_case) to frontend fields (camelCase)
      const backendErrors = err?.message && err?.errors ? err.errors : null;
      const apiError = err?.errors || err?.response?.errors || null;
      const errorsSource = backendErrors || apiError;

      if (errorsSource && typeof errorsSource === "object") {
        const map = {
          user_status: "userStatus",
          first_name: "firstName",
          last_name: "lastName",
          whatsapp: "whatsapp",
          email: "email",
          password: "password",
          password_confirmation: "confirmPassword",
          how_did_you_hear: "howDidYouHear",
          referral_number: "referralNumber",
          social_media: "socialMedia",
          agree_to_terms: "agreeToTerms",
        };
        const newErrors = {};
        Object.keys(errorsSource).forEach((key) => {
          const target = map[key] || key;
          const messages = errorsSource[key];
          newErrors[target] = Array.isArray(messages)
            ? messages[0]
            : String(messages);
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: err?.message || "Registration failed" });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const Confetti = () => {
    const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 3 + Math.random() * 2,
      size: 8 + Math.random() * 4,
      backgroundColor: ["#22c55e", "#488bbf", "#fbbf24"][
        Math.floor(Math.random() * 3)
      ],
      rotation: Math.random() * 360,
    }));

    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute rounded-full"
            style={{
              left: `${piece.left}%`,
              top: "-20px",
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.backgroundColor,
              animation: `fall ${piece.animationDuration}s linear infinite`,
              animationDelay: `${piece.animationDelay}s`,
              transform: `rotate(${piece.rotation}deg)`,
            }}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom right, #488bbf, #2c5f8f)",
        }}
        className="min-h-screen flex flex-col relative overflow-hidden"
      >
        {showConfetti && <Confetti />}

        {/* Header */}
        <header className="shadow-sm sticky top-0 z-50 bg-[#488bbf]">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-white">my</span>
              <span className="px-2 py-1 rounded font-bold text-xl bg-white text-[#488bbf]">
                DELSU
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 animate-[fadeIn_0.2s_ease-in]">
                  <a
                    href="https://news.mydelsu.com/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#488bbf]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="font-medium">Home</span>
                    </div>
                  </a>
                  <a
                    href="https://mydelsu.com/tools/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#488bbf]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Free Tools</span>
                    </div>
                  </a>
                  <a
                    href="https://mydelsu.com/past-questions/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#488bbf]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      <span className="font-medium">Past Questions</span>
                    </div>
                  </a>
                  <a
                    href="https://mydelsu.com/course-outline/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#488bbf]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      <span className="font-medium">Course Outline</span>
                    </div>
                  </a>
                  <a
                    href="https://mydelsu.com/course-summaries/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#488bbf]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Course Summaries</span>
                    </div>
                  </a>
                  <div className="border-t border-gray-200 my-2"></div>
                  <a
                    href="https://mydelsu.com/about/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-[#488bbf]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">About Us</span>
                    </div>
                  </a>
                  <a
                    href="https://mydelsu.com/contact/"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#488bbf" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="font-medium">Contact Us</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {showMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            ></div>
          )}
        </header>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="flex items-center space-x-2 text-3xl">
                <span className="font-semibold text-gray-800">my</span>
                <span
                  style={{ backgroundColor: "#488bbf" }}
                  className="text-white px-3 py-2 rounded font-bold"
                >
                  DELSU
                </span>
              </div>
            </div>

            <div className="relative mb-4">
              <div
                style={{ color: "#488bbf" }}
                className="text-7xl md:text-8xl font-bold animate-pulse"
              >
                {Math.floor(progress)}%
              </div>
              {progress >= 99 && (
                <div className="absolute -top-4 -right-4">
                  <span className="text-4xl">🎉</span>
                </div>
              )}
            </div>

            <p
              style={{ color: "#488bbf" }}
              className="text-xl font-semibold mb-6 min-h-[60px] flex items-center justify-center"
            >
              {progress < 99
                ? loadingMessage
                : "You're almost there! One last step:"}
            </p>

            <div className="relative w-full bg-gray-200 rounded-full h-4 mb-8 overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#488bbf",
                }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>

            {progress < 99 && (
              <div className="flex justify-center space-x-2 mb-6">
                <div
                  style={{ backgroundColor: "#488bbf" }}
                  className="w-3 h-3 rounded-full animate-bounce"
                ></div>
                <div
                  style={{ backgroundColor: "#488bbf", animationDelay: "0.2s" }}
                  className="w-3 h-3 rounded-full animate-bounce"
                ></div>
                <div
                  style={{ backgroundColor: "#488bbf", animationDelay: "0.4s" }}
                  className="w-3 h-3 rounded-full animate-bounce"
                ></div>
              </div>
            )}

            {progress >= 99 && (
              <div className="space-y-6">
                <a
                  href="https://wa.me/2348100879906?text=Hi%2C%20I%20just%20registered%20on%20myDelsu%20and%20need%20to%20activate%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.488" />
                  </svg>
                  <span>Click to Activate Account</span>
                </a>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Chat with our admin on WhatsApp to verify and activate your
                  account
                </p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fall {
            to {
              transform: translateY(110vh) rotate(720deg);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="shadow-sm sticky top-0 z-50 bg-[#488bbf]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-white">my</span>
            <span className="px-2 py-1 rounded font-bold text-xl bg-white text-[#488bbf]">
              DELSU
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 animate-[fadeIn_0.2s_ease-in]">
                <a
                  href="https://news.mydelsu.com/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#488bbf]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-medium">Home</span>
                  </div>
                </a>
                <a
                  href="https://mydelsu.com/tools/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#488bbf]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Free Tools</span>
                  </div>
                </a>
                <a
                  href="https://mydelsu.com/past-questions/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#488bbf]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span className="font-medium">Past Questions</span>
                  </div>
                </a>
                <a
                  href="https://mydelsu.com/course-outline/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#488bbf]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span className="font-medium">Course Outline</span>
                  </div>
                </a>
                <a
                  href="https://mydelsu.com/course-summaries/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#488bbf]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Course Summaries</span>
                  </div>
                </a>
                <div className="border-t border-gray-200 my-2"></div>
                <a
                  href="https://mydelsu.com/about/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#488bbf]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">About Us</span>
                  </div>
                </a>
                <a
                  href="https://mydelsu.com/contact/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="font-medium">Contact Us</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {showMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          ></div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Join myDelsu
          </h1>
          <p className="text-gray-600">
            Your gateway to verified DELSU information and resources
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="userStatus"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                I am a/an: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="userStatus"
                  name="userStatus"
                  value={formData.userStatus}
                  onChange={handleChange}
                  className={`outline-none w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white appearance-none cursor-pointer ${
                    errors.userStatus
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#488bbf]"
                  }`}
                >
                  <option value="">Select your status</option>
                  <option value="aspirant">
                    Aspirant (Planning to apply to DELSU)
                  </option>
                  <option value="current_student">Current Student</option>
                  <option value="alumni">Alumni (Former Student)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.userStatus && (
                <p className="mt-1 text-sm text-red-500">{errors.userStatus}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`outline-none w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#488bbf]"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{ outline: "none" }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#488bbf]"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  📱
                </span>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#488bbf] focus:border-transparent transition bg-white ${
                    errors.whatsapp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-red-500">{errors.whatsapp}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`outline-none w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#488bbf]"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`outline-none w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#488bbf]"
                  }`}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`outline-none w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#488bbf]"
                  }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* How did you hear about us */}
            <div>
              <label
                htmlFor="howDidYouHear"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                How did you hear about us?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="howDidYouHear"
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleChange}
                  style={{ outline: "none" }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white appearance-none cursor-pointer ${
                    errors.howDidYouHear
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#488bbf]"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="friend">A friend told me</option>
                  <option value="social_media">Social Media</option>
                  <option value="search_engine">Google/Search Engine</option>
                  <option value="school">At school/campus</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.howDidYouHear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.howDidYouHear}
                </p>
              )}
            </div>

            {/* Friend Referral Number */}
            {formData.howDidYouHear === "friend" && (
              <div className="animate-[fadeIn_0.3s_ease-in]">
                <label
                  htmlFor="referralNumber"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Friend's WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    👥
                  </span>
                  <input
                    type="tel"
                    id="referralNumber"
                    name="referralNumber"
                    value={formData.referralNumber}
                    onChange={handleChange}
                    className="outline-none w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] transition bg-white"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the WhatsApp number of the friend who referred you
                </p>
              </div>
            )}

            {/* Social Media Source */}
            {formData.howDidYouHear === "social_media" && (
              <div className="animate-[fadeIn_0.3s_ease-in]">
                <label
                  htmlFor="socialMedia"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Which social media platform?
                </label>
                <div className="relative">
                  <select
                    id="socialMedia"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleChange}
                    style={{ outline: "none" }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#488bbf] transition bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter (X)</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp Status</option>
                    <option value="tiktok">TikTok</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 border-gray-300 rounded accent-[#488bbf]"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I agree to the{" "}
                  <Link
                    href="/auth/terms-of-service"
                    style={{ color: "#488bbf" }}
                    className="hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <a
                    href="#"
                    style={{ color: "#488bbf" }}
                    className="hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-[#488bbf]"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="hover:underline font-medium text-[#488bbf]"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
