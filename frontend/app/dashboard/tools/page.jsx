"use client";
import React from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import AuthGuard from "../../../components/AuthGuard";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";

export default function ToolsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const tools = [
    {
      id: "cgpa-calculator",
      title: "CGPA Calculator",
      description: "Calculate your Cumulative Grade Point Average with ease",
      icon: "📊",
      href: "/dashboard/cgpa-calculator",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      features: [
        "Multiple semesters",
        "Different grading scales",
        "Export results",
      ],
    },
    {
      id: "aggregate-checker",
      title: "Aggregate Checker",
      description: "Check your aggregate scores and admission requirements",
      icon: "🎯",
      href: "/dashboard/aggregate-checker",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      features: ["JAMB scores", "O'Level grades", "Department requirements"],
    },
    {
      id: "gpa-calculator",
      title: "GPA Calculator",
      description: "Calculate semester GPA and track academic performance",
      icon: "📈",
      href: "/dashboard/gpa-calculator",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      features: ["Semester tracking", "Grade analysis", "Performance trends"],
    },
    {
      id: "course-summaries",
      title: "Course Summaries & Notes",
      description: "Access comprehensive study materials and course summaries",
      icon: "📚",
      href: "/dashboard/course-summaries",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      features: ["Subject notes", "Study guides", "Quick references"],
    },
    {
      id: "past-questions",
      title: "Past Questions Library",
      description: "Browse, search and download past examination questions",
      icon: "📝",
      href: "/dashboard/past-questions",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      features: ["Search by course", "Download PDFs", "Recent exams"],
    },
    {
      id: "grade-tracker",
      title: "Grade Tracker",
      description: "Track your grades across all courses and semesters",
      icon: "📋",
      href: "/dashboard/grade-tracker",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      features: ["Grade history", "Progress tracking", "Performance insights"],
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="dashboard" />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Academic Tools 🛠️
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential tools to help you excel in your academic journey at
              DELSU. Calculate grades, access study materials, and track your
              progress.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group block transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div
                  className={`${tool.bgColor} rounded-2xl p-8 h-full border-2 border-transparent group-hover:border-gray-200 transition-all duration-300`}
                >
                  {/* Icon */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {tool.icon}
                    </div>
                    <h3 className={`text-2xl font-bold ${tool.textColor} mb-2`}>
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {tool.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r ${tool.color} text-white font-semibold group-hover:shadow-lg transition-all duration-300`}
                    >
                      <span>Get Started</span>
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Use Our Academic Tools?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Fast & Accurate
                  </h3>
                  <p className="text-gray-600">
                    Quick calculations and reliable results for all your
                    academic needs.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600">
                    Your academic data is safe and only accessible to you.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Student-Focused
                  </h3>
                  <p className="text-gray-600">
                    Designed specifically for DELSU students by DELSU students.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Excel Academically?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Start using our tools today and take control of your academic
                journey.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Go to Dashboard
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
