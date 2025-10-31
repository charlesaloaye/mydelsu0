# myDelsu Frontend

A Next.js frontend application for the myDelsu platform - your gateway to DELSU resources and academic success.

## Features

- **Authentication**: Login and registration with JWT tokens
- **Dashboard**: Overview of user stats, wallet balance, and announcements
- **Wallet Management**: View balance, transactions, fund account, withdraw, buy airtime/data
- **Profile Management**: Update profile, upload avatar, verification
- **Referral System**: Track referrals and earn rewards
- **Notifications**: Real-time notifications system
- **File Uploads**: Upload past questions, projects, and hostel information

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Backend Setup

Make sure the Laravel backend is running:

```bash
cd ../backend
php artisan serve
```

The API will be available at `http://localhost:8000/api`.

## API Integration

The frontend is fully integrated with the Laravel API backend:

- **Authentication**: JWT token-based authentication
- **Real-time Data**: All data is fetched from the API
- **Error Handling**: Comprehensive error handling for API calls
- **Loading States**: Loading indicators for better UX

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Dashboard pages
│   │   ├── wallet/        # Wallet management
│   │   ├── upload-*/      # Upload pages
│   │   └── settings/      # Settings page
│   └── layout.jsx         # Root layout
├── contexts/              # React contexts
│   └── AuthContext.js     # Authentication context
├── lib/                   # Utility libraries
│   └── api.js            # API client
└── public/               # Static assets
```

## Key Components

### AuthContext

- Manages user authentication state
- Handles login/logout functionality
- Provides user data throughout the app

### API Client

- Centralized API communication
- Automatic token management
- Error handling and response formatting

### Pages

- **Login**: User authentication with email/phone
- **Register**: User registration with referral support
- **Dashboard**: Main dashboard with stats and quick actions
- **Wallet**: Wallet management and transactions
- **Upload Pages**: File upload for different content types

## Development

### Adding New API Endpoints

1. Add the endpoint method to `lib/api.js`
2. Use the method in your component
3. Handle loading states and errors appropriately

### Adding New Pages

1. Create the page component in the appropriate directory
2. Use the `useAuth` hook for authentication
3. Use the `apiClient` for API calls
4. Follow the existing patterns for error handling and loading states

## Deployment

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy to your preferred platform
3. Set environment variables in your deployment platform

### Backend (Laravel)

1. Configure your production database
2. Run migrations: `php artisan migrate`
3. Set up your web server (Apache/Nginx)
4. Configure environment variables

## API Documentation

See the backend `API_DOCUMENTATION.md` for complete API reference.

## Support

For issues or questions, please check the API documentation or contact the development team.
