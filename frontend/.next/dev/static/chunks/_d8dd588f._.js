(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || "http://localhost:8000/api";
class ApiClient {
    constructor(){
        this.baseURL = API_BASE_URL;
        this.token = null;
        // Get token from localStorage if available
        if ("TURBOPACK compile-time truthy", 1) {
            this.token = localStorage.getItem("auth_token");
        }
    }
    setToken(token) {
        this.token = token;
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem("auth_token", token);
        }
    }
    removeToken() {
        this.token = null;
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem("auth_token");
        }
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                ...options.headers
            },
            ...options
        };
        // Only set Content-Type to application/json if not already set and body is not FormData
        if (!config.headers["Content-Type"] && !(options.body instanceof FormData)) {
            config.headers["Content-Type"] = "application/json";
        }
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }
        try {
            const response = await fetch(url, config);
            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                // If not JSON, check if it's an HTML error page
                if (contentType && contentType.includes("text/html")) {
                    throw new Error(`Server returned HTML instead of JSON. This usually means the backend server is not running or there's a routing issue. URL: ${url}`);
                }
                throw new Error(`Expected JSON response but got ${contentType || "unknown content type"}`);
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
    // Generic HTTP methods
    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "GET"
        });
    }
    async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: data ? data instanceof FormData ? data : JSON.stringify(data) : undefined
        });
    }
    async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "PUT",
            body: data ? data instanceof FormData ? data : JSON.stringify(data) : undefined
        });
    }
    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: "DELETE"
        });
    }
    // Auth endpoints
    async register(userData) {
        return this.request("/register", {
            method: "POST",
            body: JSON.stringify(userData)
        });
    }
    async login(credentials) {
        // Transform email to email_or_phone for backend compatibility
        const loginData = {
            ...credentials,
            email_or_phone: credentials.email || credentials.email_or_phone
        };
        // Remove the email field if it exists since we're using email_or_phone
        if (loginData.email) {
            delete loginData.email;
        }
        const response = await this.request("/login", {
            method: "POST",
            body: JSON.stringify(loginData)
        });
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        return response;
    }
    async logout() {
        const response = await this.request("/logout", {
            method: "POST"
        });
        this.removeToken();
        return response;
    }
    async getUser() {
        return this.request("/user");
    }
    // User profile endpoints
    async getProfile() {
        return this.request("/profile");
    }
    async updateProfile(profileData) {
        return this.request("/profile", {
            method: "PUT",
            body: JSON.stringify(profileData)
        });
    }
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);
        return this.request("/profile/upload-avatar", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    async verifyProfile(verificationData) {
        const formData = new FormData();
        formData.append("student_id_image", verificationData.student_id_image);
        if (verificationData.additional_documents) {
            verificationData.additional_documents.forEach((doc, index)=>{
                formData.append(`additional_documents[${index}]`, doc);
            });
        }
        return this.request("/profile/verify", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    // Referral endpoints
    async getReferrals() {
        return this.request("/referrals");
    }
    async getReferralStats() {
        return this.request("/referrals/stats");
    }
    async generateReferralLink() {
        return this.request("/referrals/generate-link", {
            method: "POST"
        });
    }
    async getReferrerInfo(referralCode) {
        return this.request(`/referrals/info/${referralCode}`);
    }
    // Dashboard endpoints
    async getDashboard() {
        return this.request("/dashboard");
    }
    async getDashboardStats() {
        return this.request("/dashboard/stats");
    }
    async getAnnouncements() {
        return this.request("/dashboard/announcements");
    }
    // Wallet endpoints
    async getWallet() {
        return this.request("/wallet");
    }
    async getTransactions() {
        return this.request("/wallet/transactions");
    }
    async fundWallet(fundData) {
        return this.request("/wallet/fund", {
            method: "POST",
            body: JSON.stringify(fundData)
        });
    }
    async withdrawFunds(withdrawData) {
        return this.request("/wallet/withdraw", {
            method: "POST",
            body: JSON.stringify(withdrawData)
        });
    }
    async buyAirtime(airtimeData) {
        return this.request("/wallet/buy-airtime", {
            method: "POST",
            body: JSON.stringify(airtimeData)
        });
    }
    async buyData(dataData) {
        return this.request("/wallet/buy-data", {
            method: "POST",
            body: JSON.stringify(dataData)
        });
    }
    async claimDailyReward() {
        return this.request("/daily-rewards/claim", {
            method: "POST"
        });
    }
    async getDailyRewardStatus() {
        return this.request("/daily-rewards/status");
    }
    async getDailyRewardHistory(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/daily-rewards/history${queryString ? `?${queryString}` : ""}`);
    }
    async getDailyRewardStreakStats() {
        return this.request("/daily-rewards/streak-stats");
    }
    // Data plans
    async getDataPlans(network = "mtn") {
        return this.request(`/data-plans?network=${network}`);
    }
    // Paystack payment
    async initializePaystackPayment(paymentData) {
        return this.request("/paystack/initialize", {
            method: "POST",
            body: JSON.stringify(paymentData)
        });
    }
    // Withdrawal
    async withdraw(withdrawalData) {
        return this.request("/wallet/withdraw", {
            method: "POST",
            body: JSON.stringify(withdrawalData)
        });
    }
    // Notification endpoints
    async getNotifications() {
        return this.request("/notifications");
    }
    async getUnreadCount() {
        return this.request("/notifications/unread-count");
    }
    async markAsRead(notificationId) {
        return this.request(`/notifications/${notificationId}/mark-read`, {
            method: "POST"
        });
    }
    async markAllAsRead() {
        return this.request("/notifications/mark-all-read", {
            method: "POST"
        });
    }
    // Upload endpoints
    async uploadQuestion(questionData) {
        const formData = new FormData();
        Object.keys(questionData).forEach((key)=>{
            if (key === "file") {
                formData.append("file", questionData[key]);
            } else {
                formData.append(key, questionData[key]);
            }
        });
        return this.request("/upload/question", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    async uploadProject(projectData) {
        const formData = new FormData();
        Object.keys(projectData).forEach((key)=>{
            if (key === "file") {
                formData.append("file", projectData[key]);
            } else {
                formData.append(key, projectData[key]);
            }
        });
        return this.request("/upload/project", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    async uploadHostel(hostelData) {
        const formData = new FormData();
        Object.keys(hostelData).forEach((key)=>{
            if (key === "images") {
                hostelData[key].forEach((image, index)=>{
                    formData.append(`images[${index}]`, image);
                });
            } else if (key === "amenities") {
                hostelData[key].forEach((amenity, index)=>{
                    formData.append(`amenities[${index}]`, amenity);
                });
            } else {
                formData.append(key, hostelData[key]);
            }
        });
        return this.request("/upload/hostel", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    // Past Questions endpoints
    async getPastQuestions() {
        return this.request("/past-questions");
    }
    // Courses endpoints
    async getCourses() {
        return this.request("/courses");
    }
    // GPA Calculator endpoints
    async getGpaCalculations() {
        return this.request("/gpa-calculations");
    }
    async calculateGpa(gpaData) {
        return this.request("/gpa-calculations", {
            method: "POST",
            body: JSON.stringify(gpaData)
        });
    }
    async getGpaCalculation(id) {
        return this.request(`/gpa-calculations/${id}`);
    }
    async updateGpaCalculation(id, gpaData) {
        return this.request(`/gpa-calculations/${id}`, {
            method: "PUT",
            body: JSON.stringify(gpaData)
        });
    }
    async deleteGpaCalculation(id) {
        return this.request(`/gpa-calculations/${id}`, {
            method: "DELETE"
        });
    }
    async getGpaStatistics() {
        return this.request("/gpa-calculations/stats/statistics");
    }
    // Marketplace endpoints
    async getMarketplace() {
        return this.request("/marketplace");
    }
    async getMarketplaceCategories() {
        return this.request("/marketplace/categories");
    }
    async getMyMarketplaceItems() {
        return this.request("/marketplace/my-items");
    }
    async getUserSubscription() {
        return this.request("/user/subscription");
    }
    async uploadProduct(productData) {
        const formData = new FormData();
        Object.keys(productData).forEach((key)=>{
            if (key === "images") {
                productData[key].forEach((image, index)=>{
                    formData.append(`images[${index}]`, image);
                });
            } else {
                formData.append(key, productData[key]);
            }
        });
        return this.request("/marketplace/upload", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    async getMarketplaceItem(id) {
        return this.request(`/marketplace/${id}`);
    }
    async createMarketplaceItem(itemData) {
        const formData = new FormData();
        Object.keys(itemData).forEach((key)=>{
            if (key === "images") {
                itemData[key].forEach((image, index)=>{
                    formData.append(`images[${index}]`, image);
                });
            } else {
                formData.append(key, itemData[key]);
            }
        });
        return this.request("/marketplace", {
            method: "POST",
            headers: {
            },
            body: formData
        });
    }
    async updateMarketplaceItem(id, itemData) {
        return this.request(`/marketplace/${id}`, {
            method: "PUT",
            body: JSON.stringify(itemData)
        });
    }
    async deleteMarketplaceItem(id) {
        return this.request(`/marketplace/${id}`, {
            method: "DELETE"
        });
    }
    async contactMarketplaceSeller(id, contactData) {
        return this.request(`/marketplace/${id}/contact`, {
            method: "POST",
            body: JSON.stringify(contactData)
        });
    }
    // Announcement endpoints
    async getAnnouncements(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/announcements${queryString ? `?${queryString}` : ""}`);
    }
    async getRecentAnnouncements(limit = 5) {
        return this.request(`/announcements/recent?limit=${limit}`);
    }
    async getAnnouncement(id) {
        return this.request(`/announcements/${id}`);
    }
    async createAnnouncement(announcementData) {
        return this.request("/announcements", {
            method: "POST",
            body: JSON.stringify(announcementData)
        });
    }
    async updateAnnouncement(id, announcementData) {
        return this.request(`/announcements/${id}`, {
            method: "PUT",
            body: JSON.stringify(announcementData)
        });
    }
    async deleteAnnouncement(id) {
        return this.request(`/announcements/${id}`, {
            method: "DELETE"
        });
    }
    async getAnnouncementStats() {
        return this.request("/announcements/stats");
    }
    // User uploads endpoints
    async getUserUploads(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/user/uploads${queryString ? `?${queryString}` : ""}`);
    }
    // Settings endpoints
    async updateNotificationPreferences(preferences) {
        return this.request("/settings/notifications", {
            method: "PUT",
            body: JSON.stringify(preferences)
        });
    }
    async updatePrivacySettings(settings) {
        return this.request("/settings/privacy", {
            method: "PUT",
            body: JSON.stringify(settings)
        });
    }
    async updateThemeSettings(settings) {
        return this.request("/settings/theme", {
            method: "PUT",
            body: JSON.stringify(settings)
        });
    }
    async deactivateAccount() {
        return this.request("/settings/deactivate-account", {
            method: "POST"
        });
    }
    async deleteAccount() {
        return this.request("/settings/delete-account", {
            method: "DELETE"
        });
    }
}
// Create a singleton instance
const apiClient = new ApiClient();
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/AuthContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const useAuth = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const AuthProvider = ({ children })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Check if user is already logged in
            checkAuthStatus();
        }
    }["AuthProvider.useEffect"], []);
    const checkAuthStatus = async ()=>{
        try {
            const token = localStorage.getItem("auth_token");
            if (token) {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getUser();
                if (response.success) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // Clear invalid token
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].removeToken();
        } finally{
            setLoading(false);
        }
    };
    const login = async (credentials)=>{
        try {
            setLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].login(credentials);
            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    message: response.message
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        } finally{
            setLoading(false);
        }
    };
    const register = async (userData)=>{
        try {
            setLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].register(userData);
            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].setToken(response.data.token);
                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    message: response.message,
                    errors: response.errors
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        } finally{
            setLoading(false);
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally{
            setUser(null);
            setIsAuthenticated(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].removeToken();
        }
    };
    const updateUser = (userData)=>{
        setUser((prevUser)=>({
                ...prevUser,
                ...userData
            }));
    };
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        checkAuthStatus
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AuthContext.js",
        lineNumber: 114,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthProvider, "xBgiRagNfQVCfEr2dT2PptfN+TE=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_d8dd588f._.js.map