"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import apiClient from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

function WalletPage() {
  const { user, isAuthenticated } = useAuth();
  const [showAirtimeModal, setShowAirtimeModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fundForm, setFundForm] = useState({
    amount: "",
  });

  const [airtimeForm, setAirtimeForm] = useState({
    phone_number: "",
    network: "mtn",
    amount: "",
  });

  const [dataForm, setDataForm] = useState({
    phone_number: "",
    network: "mtn",
    data_plan: "",
    amount: "",
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bank_details: {
      account_number: "",
      bank_name: "",
      account_name: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dataPlans, setDataPlans] = useState([]);
  const [loadingDataPlans, setLoadingDataPlans] = useState(false);

  // Load wallet data
  useEffect(() => {
    if (isAuthenticated) {
      loadWalletData();
    }
  }, [isAuthenticated]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [
        walletResponse,
        transactionsResponse,
        notificationsResponse,
        unreadResponse,
      ] = await Promise.all([
        apiClient.getWallet(),
        apiClient.getTransactions(),
        apiClient.getNotifications(),
        apiClient.getUnreadCount(),
      ]);

      if (walletResponse.success) {
        setWalletData(walletResponse.data);
      }

      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data.data || []);
      }

      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data.data || []);
      }

      if (unreadResponse.success) {
        setUnreadCount(unreadResponse.data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleFundFormChange = (e) => {
    const { name, value } = e.target;
    setFundForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAirtimeFormChange = (e) => {
    const { name, value } = e.target;
    setAirtimeForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDataFormChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prev) => {
      const newForm = { ...prev, [name]: value };

      // Load data plans when network changes
      if (name === "network") {
        loadDataPlans(value);
        newForm.data_plan = ""; // Reset data plan selection
        newForm.amount = ""; // Reset amount
      }

      // Auto-populate amount when data plan is selected
      if (name === "data_plan" && value) {
        const selectedPlan = dataPlans.find(
          (plan) => `${plan.name} - ₦${plan.price}` === value
        );
        if (selectedPlan) {
          newForm.amount = selectedPlan.price.toString();
        }
      }

      return newForm;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleWithdrawFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bank_details.")) {
      const field = name.split(".")[1];
      setWithdrawForm((prev) => ({
        ...prev,
        bank_details: {
          ...prev.bank_details,
          [field]: value,
        },
      }));
    } else {
      setWithdrawForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Fund account
  const handleFundAccount = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Initialize Paystack payment directly
      const response = await apiClient.initializePaystackPayment({
        amount: fundForm.amount,
        email: user?.email,
      });

      if (response.success) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        setErrors({
          general: response.message || "Failed to initialize payment",
        });
      }
    } catch (error) {
      setErrors({ general: error.message || "Failed to initialize payment" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Buy airtime
  const handleBuyAirtime = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiClient.buyAirtime(airtimeForm);

      if (response.success) {
        setSuccessMessage("Airtime purchased successfully!");
        setShowAirtimeModal(false);
        setAirtimeForm({
          phone_number: "",
          network: "mtn",
          amount: "",
        });
        loadWalletData(); // Refresh wallet data
      } else {
        setErrors(response.errors || { general: response.message });
      }
    } catch (error) {
      setErrors({ general: error.message || "Failed to buy airtime" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Buy data
  const handleBuyData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiClient.buyData(dataForm);

      if (response.success) {
        setSuccessMessage("Data purchased successfully!");
        setShowDataModal(false);
        setDataForm({
          phone_number: "",
          network: "mtn",
          data_plan: "",
          amount: "",
        });
        loadWalletData(); // Refresh wallet data
      } else {
        setErrors(response.errors || { general: response.message });
      }
    } catch (error) {
      setErrors({ general: error.message || "Failed to buy data" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiClient.withdraw(withdrawForm);

      if (response.success) {
        setSuccessMessage(response.message);
        setWithdrawForm({
          amount: "",
          bank_details: {
            account_number: "",
            bank_name: "",
            account_name: "",
          },
        });
        setShowWithdrawModal(false);
        // Reload wallet data
        loadWalletData();
      } else {
        setErrors({
          general: response.message || "Withdrawal failed",
          ...response.errors,
        });
      }
    } catch (error) {
      setErrors({ general: error.message || "Withdrawal failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load data plans from API
  const loadDataPlans = async (network = "mtn") => {
    try {
      setLoadingDataPlans(true);
      const response = await apiClient.getDataPlans(network);

      if (response.success) {
        setDataPlans(response.data.plans);
      } else {
        console.error("Failed to load data plans:", response.message);
        setDataPlans([]);
      }
    } catch (error) {
      console.error("Error loading data plans:", error);
      setDataPlans([]);
    } finally {
      setLoadingDataPlans(false);
    }
  };

  // Load data plans when component mounts or network changes
  useEffect(() => {
    if (showDataModal) {
      loadDataPlans(dataForm.network);
    }
  }, [showDataModal, dataForm.network]);

  // Close modals
  const closeModals = () => {
    setShowFundModal(false);
    setShowAirtimeModal(false);
    setShowDataModal(false);
    setShowWithdrawModal(false);
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <Navbar
        variant="dashboard"
        showNotifications={true}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
        currentPath="/dashboard/wallet"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wallet
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your funds and transactions
          </p>
        </div>

        {/* Balance Cards - One Horizontal Line */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Available Balance */}
            <div className="flex-1 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-white">
                  Available Balance
                </span>
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                ₦{walletData?.available_balance?.toLocaleString() || "0"}
              </h2>
              <p className="text-xs text-white">Ready to spend or withdraw</p>
            </div>

            {/* Pending Balance */}
            <div className="flex-1 bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                  Pending Balance
                </span>
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-1">
                ₦{walletData?.pending_balance?.toLocaleString() || "0"}
              </h2>
              <p className="text-xs text-amber-700">
                Awaiting verification or processing
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              style={{ color: "#488bbf" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setShowFundModal(true)}
              className="flex flex-col items-center justify-center p-4 border-2 border-green-300 bg-white rounded-xl hover:border-green-400 hover:bg-green-50 transition group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-semibold text-gray-800 text-sm">
                Fund Account
              </p>
            </button>

            <button
              onClick={() => setShowAirtimeModal(true)}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 bg-white rounded-xl hover:border-[#488bbf] hover:bg-blue-50 transition group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-800 text-sm">Buy Airtime</p>
            </button>

            <button
              onClick={() => setShowDataModal(true)}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 bg-white rounded-xl hover:border-[#488bbf] hover:bg-blue-50 transition group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition"
                style={{ backgroundColor: "#488bbf" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-semibold text-gray-800 text-sm">Buy Data</p>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={!walletData?.can_withdraw}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition group ${
                walletData?.can_withdraw
                  ? "border-gray-200 hover:border-[#488bbf] hover:bg-blue-50"
                  : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition ${
                  walletData?.can_withdraw ? "group-hover:scale-110" : ""
                }`}
                style={{
                  backgroundColor: walletData?.can_withdraw
                    ? "#488bbf"
                    : "#9ca3af",
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {walletData?.can_withdraw ? "Withdraw" : "Min ₦2,500"}
              </p>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-linear-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-emerald-700">
                Total Earned
              </p>
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-emerald-900">
              ₦{walletData?.total_earned?.toLocaleString() || "0"}
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "#referrals")}
            className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition group cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-blue-700">
                Quick Referral
              </p>
              <svg
                className="w-5 h-5 text-blue-600 group-hover:scale-110 transition"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-900 mb-1">
              Invite Friends
            </p>
            <p className="text-xs text-blue-700">Earn ₦500 per referral →</p>
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                style={{ color: "#488bbf" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Transaction History
            </h3>
            <button
              className="text-sm font-medium"
              style={{ color: "#488bbf" }}
            >
              View All
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-emerald-100"
                          : "bg-orange-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <svg
                          className="w-6 h-6 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "credit"
                          ? "text-emerald-600"
                          : "text-orange-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₦
                      {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-2 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Fund Account Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Fund Your Account</h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFundAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={fundForm.amount}
                  onChange={handleFundFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  placeholder="Enter amount (minimum ₦100)"
                  min="100"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-blue-800">
                    You'll be redirected to Paystack to complete your payment
                    securely
                  </p>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#488bbf" }}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Pay with Paystack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buy Airtime Modal */}
      {showAirtimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Buy Airtime</h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBuyAirtime} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={airtimeForm.phone_number}
                  onChange={handleAirtimeFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  placeholder="Enter phone number (e.g., 08012345678)"
                  required
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <select
                  name="network"
                  value={airtimeForm.network}
                  onChange={handleAirtimeFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                >
                  <option value="mtn">MTN</option>
                  <option value="airtel">Airtel</option>
                  <option value="globacom">Globacom (GLO)</option>
                  <option value="etisalat">9mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={airtimeForm.amount}
                  onChange={handleAirtimeFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  placeholder="Enter amount (₦50 - ₦10,000)"
                  min="50"
                  max="10000"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#488bbf" }}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Buy Airtime"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buy Data Modal */}
      {showDataModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Buy Data</h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBuyData} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={dataForm.phone_number}
                  onChange={handleDataFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  placeholder="Enter phone number (e.g., 08012345678)"
                  required
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <select
                  name="network"
                  value={dataForm.network}
                  onChange={handleDataFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                >
                  <option value="mtn">MTN</option>
                  <option value="airtel">Airtel</option>
                  <option value="glo">Globacom (GLO)</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Plan
                </label>
                <select
                  name="data_plan"
                  value={dataForm.data_plan}
                  onChange={handleDataFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  required
                  disabled={loadingDataPlans}
                >
                  <option value="">
                    {loadingDataPlans
                      ? "Loading plans..."
                      : "Select a data plan"}
                  </option>
                  {dataPlans.map((plan) => (
                    <option
                      key={plan.id}
                      value={`${plan.name} - ₦${plan.price}`}
                    >
                      {plan.name} - ₦{plan.price}
                    </option>
                  ))}
                </select>
                {errors.data_plan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.data_plan}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={dataForm.amount}
                  onChange={handleDataFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  placeholder="Enter amount"
                  min="50"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#488bbf" }}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Buy Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Withdraw Funds
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Withdrawal Information
                  </h4>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Minimum withdrawal: ₦2,500</li>
                    <li>• Processing time: 24 hours</li>
                    <li>
                      • Available balance: ₦
                      {walletData?.balance?.toLocaleString() || "0"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={withdrawForm.amount}
                  onChange={handleWithdrawFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                  placeholder="Enter amount (minimum ₦2,500)"
                  min="2500"
                  step="100"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Bank Details
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <select
                      name="bank_details.bank_name"
                      value={withdrawForm.bank_details.bank_name}
                      onChange={handleWithdrawFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                      required
                    >
                      <option value="">Select your bank</option>
                      <option value="Access Bank">Access Bank</option>
                      <option value="Citibank">Citibank</option>
                      <option value="Diamond Bank">Diamond Bank</option>
                      <option value="Ecobank">Ecobank</option>
                      <option value="Fidelity Bank">Fidelity Bank</option>
                      <option value="First Bank">First Bank</option>
                      <option value="First City Monument Bank">
                        First City Monument Bank
                      </option>
                      <option value="Guaranty Trust Bank">
                        Guaranty Trust Bank
                      </option>
                      <option value="Heritage Bank">Heritage Bank</option>
                      <option value="Keystone Bank">Keystone Bank</option>
                      <option value="Kuda Bank">Kuda Bank</option>
                      <option value="Opay">Opay</option>
                      <option value="PalmPay">PalmPay</option>
                      <option value="Polaris Bank">Polaris Bank</option>
                      <option value="Providus Bank">Providus Bank</option>
                      <option value="Stanbic IBTC Bank">
                        Stanbic IBTC Bank
                      </option>
                      <option value="Standard Chartered Bank">
                        Standard Chartered Bank
                      </option>
                      <option value="Sterling Bank">Sterling Bank</option>
                      <option value="Union Bank">Union Bank</option>
                      <option value="United Bank for Africa">
                        United Bank for Africa
                      </option>
                      <option value="Unity Bank">Unity Bank</option>
                      <option value="VFD Microfinance Bank">
                        VFD Microfinance Bank
                      </option>
                      <option value="Wema Bank">Wema Bank</option>
                      <option value="Zenith Bank">Zenith Bank</option>
                    </select>
                    {errors["bank_details.bank_name"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["bank_details.bank_name"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bank_details.account_number"
                      value={withdrawForm.bank_details.account_number}
                      onChange={handleWithdrawFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                      placeholder="Enter account number"
                      maxLength="10"
                      required
                    />
                    {errors["bank_details.account_number"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["bank_details.account_number"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      name="bank_details.account_name"
                      value={withdrawForm.bank_details.account_name}
                      onChange={handleWithdrawFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-[#488bbf] focus:border-transparent"
                      placeholder="Enter account name"
                      required
                    />
                    {errors["bank_details.account_name"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors["bank_details.account_name"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !walletData?.can_withdraw}
                  style={{ backgroundColor: "#488bbf" }}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Withdraw Funds"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default function ProtectedWalletPage() {
  return (
    <AuthGuard requireAuth={true}>
      <WalletPage />
    </AuthGuard>
  );
}
