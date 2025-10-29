const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;

    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // Only set Content-Type to application/json if not already set and body is not FormData
    if (
      !config.headers["Content-Type"] &&
      !(options.body instanceof FormData)
    ) {
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
          throw new Error(
            `Server returned HTML instead of JSON. This usually means the backend server is not running or there's a routing issue. URL: ${url}`
          );
        }
        throw new Error(
          `Expected JSON response but got ${
            contentType || "unknown content type"
          }`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Generic HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  // Auth endpoints

  async register(userData) {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    // Transform email to email_or_phone for backend compatibility
    const loginData = {
      ...credentials,
      email_or_phone: credentials.email || credentials.email_or_phone,
    };

    // Remove the email field if it exists since we're using email_or_phone
    if (loginData.email) {
      delete loginData.email;
    }

    const response = await this.request("/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request("/logout", {
      method: "POST",
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
      body: JSON.stringify(profileData),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.request("/profile/upload-avatar", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }

  async verifyProfile(verificationData) {
    const formData = new FormData();
    formData.append("student_id_image", verificationData.student_id_image);

    if (verificationData.additional_documents) {
      verificationData.additional_documents.forEach((doc, index) => {
        formData.append(`additional_documents[${index}]`, doc);
      });
    }

    return this.request("/profile/verify", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
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
      method: "POST",
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
      body: JSON.stringify(fundData),
    });
  }

  async withdrawFunds(withdrawData) {
    return this.request("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(withdrawData),
    });
  }

  async buyAirtime(airtimeData) {
    return this.request("/wallet/buy-airtime", {
      method: "POST",
      body: JSON.stringify(airtimeData),
    });
  }

  async buyData(dataData) {
    return this.request("/wallet/buy-data", {
      method: "POST",
      body: JSON.stringify(dataData),
    });
  }

  async claimDailyReward() {
    return this.request("/daily-rewards/claim", {
      method: "POST",
    });
  }

  async getDailyRewardStatus() {
    return this.request("/daily-rewards/status");
  }

  async getDailyRewardHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/daily-rewards/history${queryString ? `?${queryString}` : ""}`
    );
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
      body: JSON.stringify(paymentData),
    });
  }

  // Withdrawal
  async withdraw(withdrawalData) {
    return this.request("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(withdrawalData),
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
      method: "POST",
    });
  }

  async markAllAsRead() {
    return this.request("/notifications/mark-all-read", {
      method: "POST",
    });
  }

  // Upload endpoints
  async uploadQuestion(questionData) {
    const formData = new FormData();
    Object.keys(questionData).forEach((key) => {
      if (key === "file") {
        formData.append("file", questionData[key]);
      } else {
        formData.append(key, questionData[key]);
      }
    });

    return this.request("/upload/question", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }

  async uploadProject(projectData) {
    const formData = new FormData();
    Object.keys(projectData).forEach((key) => {
      if (key === "file") {
        formData.append("file", projectData[key]);
      } else {
        formData.append(key, projectData[key]);
      }
    });

    return this.request("/upload/project", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }

  async uploadHostel(hostelData) {
    const formData = new FormData();
    Object.keys(hostelData).forEach((key) => {
      if (key === "images") {
        hostelData[key].forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else if (key === "amenities") {
        hostelData[key].forEach((amenity, index) => {
          formData.append(`amenities[${index}]`, amenity);
        });
      } else {
        formData.append(key, hostelData[key]);
      }
    });

    return this.request("/upload/hostel", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
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
      body: JSON.stringify(gpaData),
    });
  }

  async getGpaCalculation(id) {
    return this.request(`/gpa-calculations/${id}`);
  }

  async updateGpaCalculation(id, gpaData) {
    return this.request(`/gpa-calculations/${id}`, {
      method: "PUT",
      body: JSON.stringify(gpaData),
    });
  }

  async deleteGpaCalculation(id) {
    return this.request(`/gpa-calculations/${id}`, {
      method: "DELETE",
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
    Object.keys(productData).forEach((key) => {
      if (key === "images") {
        productData[key].forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    return this.request("/marketplace/upload", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }

  async getMarketplaceItem(id) {
    return this.request(`/marketplace/${id}`);
  }

  async createMarketplaceItem(itemData) {
    const formData = new FormData();
    Object.keys(itemData).forEach((key) => {
      if (key === "images") {
        itemData[key].forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else {
        formData.append(key, itemData[key]);
      }
    });

    return this.request("/marketplace", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }

  async updateMarketplaceItem(id, itemData) {
    return this.request(`/marketplace/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  }

  async deleteMarketplaceItem(id) {
    return this.request(`/marketplace/${id}`, {
      method: "DELETE",
    });
  }

  async contactMarketplaceSeller(id, contactData) {
    return this.request(`/marketplace/${id}/contact`, {
      method: "POST",
      body: JSON.stringify(contactData),
    });
  }

  // Announcement endpoints
  async getAnnouncements(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/announcements${queryString ? `?${queryString}` : ""}`
    );
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
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(id, announcementData) {
    return this.request(`/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id) {
    return this.request(`/announcements/${id}`, {
      method: "DELETE",
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
      body: JSON.stringify(preferences),
    });
  }

  async updatePrivacySettings(settings) {
    return this.request("/settings/privacy", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async updateThemeSettings(settings) {
    return this.request("/settings/theme", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async deactivateAccount() {
    return this.request("/settings/deactivate-account", {
      method: "POST",
    });
  }

  async deleteAccount() {
    return this.request("/settings/delete-account", {
      method: "DELETE",
    });
  }

  // Course Summaries endpoints
  async getCourseSummaries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/course-summaries${queryString ? `?${queryString}` : ""}`
    );
  }

  async getCourseSummary(id) {
    return this.request(`/course-summaries/${id}`);
  }

  async uploadCourseSummary(formData) {
    return this.request("/course-summaries", {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type, let the browser set it with boundary for FormData
      },
    });
  }

  async updateCourseSummary(id, formData) {
    return this.request(`/course-summaries/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        // Don't set Content-Type, let the browser set it with boundary for FormData
      },
    });
  }

  async deleteCourseSummary(id) {
    return this.request(`/course-summaries/${id}`, {
      method: "DELETE",
    });
  }

  async downloadCourseSummary(id) {
    return this.request(`/course-summaries/${id}/download`, {
      method: "GET",
    });
  }

  async getCourseSummaryStats() {
    return this.request("/course-summaries/stats");
  }

  async searchCourseSummaries(query, filters = {}) {
    return this.request("/course-summaries/search", {
      method: "POST",
      body: JSON.stringify({ query, filters }),
    });
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;
