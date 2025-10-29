"use client";
import React, { useState } from "react";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";

function ForgotPasswordPage() {
  const [step, setStep] = useState("request"); // request, sent
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    resetMethod: "email", // email or whatsapp
  });
  const [errors, setErrors] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or WhatsApp number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Password reset requested:", formData);
      setStep("sent");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        style={{ backgroundColor: "#488bbf" }}
        className="shadow-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-white">my</span>
            <span
              style={{ backgroundColor: "#ffffff", color: "#488bbf" }}
              className="px-2 py-1 rounded font-bold text-xl"
            >
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
                <Link
                  href="https://news.mydelsu.com/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-medium">Home</span>
                  </div>
                </Link>
                <Link
                  href="https://mydelsu.com/tools/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
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
                </Link>
                <Link
                  href="https://mydelsu.com/past-questions/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span className="font-medium">Past Questions</span>
                  </div>
                </Link>
                <Link
                  href="https://mydelsu.com/course-outline/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span className="font-medium">Course Outline</span>
                  </div>
                </Link>
                <Link
                  href="https://mydelsu.com/course-summaries/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
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
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  href="https://mydelsu.com/about/"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#488bbf" }}
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
                </Link>
                <Link
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
                </Link>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-md">
        {step === "request" ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#488bbf" }}
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                No worries! We'll help you reset it
              </p>
            </div>

            {/* Reset Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
              <div className="space-y-6">
                {/* Email or Phone */}
                <div>
                  <label
                    htmlFor="emailOrPhone"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Email or WhatsApp Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    style={{ outline: "none" }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition bg-white ${
                      errors.emailOrPhone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#488bbf]"
                    }`}
                    placeholder="Enter your registered email or phone"
                  />
                  {errors.emailOrPhone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.emailOrPhone}
                    </p>
                  )}
                </div>

                {/* Reset Method Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    How would you like to reset your password?
                  </label>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.resetMethod === "email"
                          ? "border-[#488bbf] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="resetMethod"
                        value="email"
                        checked={formData.resetMethod === "email"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.resetMethod === "email"
                            ? "border-[#488bbf]"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.resetMethod === "email" && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: "#488bbf" }}
                          ></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <svg
                          className="w-5 h-5"
                          style={{ color: "#488bbf" }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <div>
                          <span className="font-medium text-gray-900 block">
                            Send reset link via Email
                          </span>
                          <span className="text-xs text-gray-500">
                            We'll email you a password reset link
                          </span>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.resetMethod === "whatsapp"
                          ? "border-[#488bbf] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="resetMethod"
                        value="whatsapp"
                        checked={formData.resetMethod === "whatsapp"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.resetMethod === "whatsapp"
                            ? "border-[#488bbf]"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.resetMethod === "whatsapp" && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: "#488bbf" }}
                          ></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.488" />
                        </svg>
                        <div>
                          <span className="font-medium text-gray-900 block">
                            Get help via WhatsApp
                          </span>
                          <span className="text-xs text-gray-500">
                            Chat with our admin for instant help
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                {formData.resetMethod === "whatsapp" ? (
                  <a
                    href="https://wa.me/2348100879906?text=Hi%2C%20I%20forgot%20my%20password%20and%20need%20help%20resetting%20it.%20My%20account%20details%20are%3A"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#488bbf" }}
                    className="flex items-center justify-center space-x-2 w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.488" />
                    </svg>
                    <span>Chat with Admin on WhatsApp</span>
                  </a>
                ) : (
                  <button
                    onClick={handleSubmit}
                    style={{ backgroundColor: "#488bbf" }}
                    className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Send Reset Link
                  </button>
                )}

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    style={{ color: "#488bbf" }}
                    className="text-sm font-medium hover:underline inline-flex items-center space-x-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    <span>Back to login</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Check Your{" "}
                {formData.resetMethod === "email" ? "Email" : "WhatsApp"}!
              </h1>
              <p className="text-gray-600">
                We've sent you instructions to reset your password
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 mt-0.5 shrink-0"
                      style={{ color: "#488bbf" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm text-gray-700">
                      {formData.resetMethod === "email" ? (
                        <>
                          <p className="font-semibold mb-1">What to do next:</p>
                          <ol className="list-decimal ml-4 space-y-1">
                            <li>Check your email inbox</li>
                            <li>Look for an email from myDelsu</li>
                            <li>Click the reset link in the email</li>
                            <li>Create your new password</li>
                          </ol>
                          <p className="mt-3 text-xs text-gray-600">
                            Didn't receive the email? Check your spam folder or
                            try again in a few minutes.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold mb-1">
                            What happens next:
                          </p>
                          <ol className="list-decimal ml-4 space-y-1">
                            <li>Our admin will message you on WhatsApp</li>
                            <li>Verify your identity with them</li>
                            <li>They'll help you reset your password</li>
                            <li>You'll be back to your account in no time!</li>
                          </ol>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resend Option */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Didn't get anything?
                  </p>
                  <button
                    onClick={() => setStep("request")}
                    style={{ color: "#488bbf" }}
                    className="text-sm font-medium hover:underline"
                  >
                    Try again
                  </button>
                </div>

                {/* Back to Login */}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/auth/login"
                    style={{ backgroundColor: "#488bbf" }}
                    className="flex items-center justify-center space-x-2 w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    <span>Back to Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your account security is our priority
          </p>
        </div>
      </div>

      <style>{`
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

export default function ProtectedForgotPasswordPage() {
  return (
    <AuthGuard requireAuth={false}>
      <ForgotPasswordPage />
    </AuthGuard>
  );
}
