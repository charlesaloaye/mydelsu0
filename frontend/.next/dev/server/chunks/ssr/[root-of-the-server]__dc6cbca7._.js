module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api") || "http://localhost:8000/api";
class ApiClient {
    constructor(){
        this.baseURL = API_BASE_URL;
        this.token = null;
        // Get token from localStorage if available
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    setToken(token) {
        this.token = token;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    removeToken() {
        this.token = null;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
}),
"[project]/contexts/AuthContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])();
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if user is already logged in
        checkAuthStatus();
    }, []);
    const checkAuthStatus = async ()=>{
        try {
            const token = localStorage.getItem("auth_token");
            if (token) {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getUser();
                if (response.success) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // Clear invalid token
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].removeToken();
        } finally{
            setLoading(false);
        }
    };
    const login = async (credentials)=>{
        try {
            setLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].login(credentials);
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].register(userData);
            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].setToken(response.data.token);
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally{
            setUser(null);
            setIsAuthenticated(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].removeToken();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AuthContext.js",
        lineNumber: 114,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dc6cbca7._.js.map