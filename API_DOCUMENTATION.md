# myDelsu API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

## API Endpoints

### Authentication

#### Register User

```
POST /api/register
```

**Request Body:**

```json
{
  "user_status": "aspirant|current_student|alumni",
  "first_name": "string",
  "last_name": "string",
  "whatsapp": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string",
  "how_did_you_hear": "string",
  "referral_number": "string (optional)",
  "social_media": "string (optional)",
  "agree_to_terms": true
}
```

#### Login User

```
POST /api/login
```

**Request Body:**

```json
{
  "email_or_phone": "string",
  "password": "string",
  "remember_me": false
}
```

#### Get User Profile

```
GET /api/user
```

#### Logout

```
POST /api/logout
```

### User Management

#### Get Profile

```
GET /api/profile
```

#### Update Profile

```
PUT /api/profile
```

#### Upload Avatar

```
POST /api/profile/upload-avatar
```

#### Verify Profile

```
POST /api/profile/verify
```

#### Get Referrals

```
GET /api/referrals
```

#### Get Referral Stats

```
GET /api/referrals/stats
```

#### Generate Referral Link

```
POST /api/referrals/generate-link
```

### Dashboard

#### Get Dashboard Data

```
GET /api/dashboard
```

#### Get Dashboard Stats

```
GET /api/dashboard/stats
```

#### Get Announcements

```
GET /api/dashboard/announcements
```

### Wallet

#### Get Wallet Info

```
GET /api/wallet
```

#### Get Transactions

```
GET /api/wallet/transactions
```

#### Fund Wallet

```
POST /api/wallet/fund
```

#### Withdraw Funds

```
POST /api/wallet/withdraw
```

#### Buy Airtime

```
POST /api/wallet/buy-airtime
```

#### Buy Data

```
POST /api/wallet/buy-data
```

#### Claim Daily Reward

```
POST /api/wallet/claim-daily-reward
```

### Notifications

#### Get Notifications

```
GET /api/notifications
```

#### Get Unread Count

```
GET /api/notifications/unread-count
```

#### Mark as Read

```
POST /api/notifications/{id}/mark-read
```

#### Mark All as Read

```
POST /api/notifications/mark-all-read
```

### Uploads

#### Upload Past Question

```
POST /api/upload/question
```

#### Upload Project

```
POST /api/upload/project
```

#### Upload Hostel

```
POST /api/upload/hostel
```

## Response Format

All API responses follow this format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Validation errors (if applicable)
  }
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## CORS Configuration

The API is configured to accept requests from:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3001`

## Frontend Integration

To integrate with your Next.js frontend:

1. Set up an API client (axios/fetch)
2. Store the auth token in localStorage or cookies
3. Include the token in all protected requests
4. Handle errors appropriately

### Example Frontend Integration

```javascript
// API client setup
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example usage
const login = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    localStorage.setItem("auth_token", response.data.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```

## Database Schema

### Users Table

- `id` - Primary key
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - User's email (unique)
- `whatsapp` - User's WhatsApp number
- `user_status` - aspirant|current_student|alumni
- `referral_code` - Unique referral code
- `wallet_balance` - Current wallet balance
- `is_verified` - Account verification status
- `profile_complete` - Profile completion percentage
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Transactions Table

- `id` - Primary key
- `user_id` - Foreign key to users
- `type` - credit|debit
- `amount` - Transaction amount
- `description` - Transaction description
- `status` - pending|completed|failed
- `payment_method` - Payment method used
- `reference` - Transaction reference
- `created_at` - Transaction timestamp

### Notifications Table

- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Notification title
- `message` - Notification message
- `type` - info|success|warning|error
- `is_read` - Read status
- `data` - Additional data (JSON)
- `created_at` - Notification timestamp
