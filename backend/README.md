# myDelsu Quick Start Guide

## 🚀 Getting Started

### 1. Start the Backend

```bash
cd backend
php artisan serve
```

Backend will be available at: `http://localhost:8000`

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 3. Create Environment File

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🔑 Test Accounts

| Email            | Password    | Name           | Status          | Wallet  | Verification    |
| ---------------- | ----------- | -------------- | --------------- | ------- | --------------- |
| victor@test.com  | password123 | Victor Ijomah  | Current Student | ₦15,000 | ✅ Verified     |
| sarah@test.com   | password123 | Sarah Johnson  | Current Student | ₦8,500  | ✅ Verified     |
| michael@test.com | password123 | Michael Brown  | Aspirant        | ₦2,500  | ❌ Not Verified |
| grace@test.com   | password123 | Grace Williams | Alumni          | ₦22,000 | ✅ Verified     |
| david@test.com   | password123 | David Davis    | Current Student | ₦1,200  | ❌ Not Verified |

## 🧪 Test Scenarios

### 1. New User Registration

- Go to `/auth/register`
- Fill out the registration form
- Test referral code: `VIC001`
- Complete the registration process

### 2. User Login

- Go to `/auth/login`
- Use any test account above
- Test both email and phone number login

### 3. Dashboard Testing

- Login with `victor@test.com`
- Check wallet balance (₦15,000)
- View notifications
- Test daily reward claim

### 4. Wallet Testing

- Go to `/dashboard/wallet`
- View transaction history
- Test different transaction types
- Check wallet stats

### 5. Profile Testing

- Test with unverified user (`michael@test.com`)
- Check verification status
- Test profile completion percentage

## 📊 Test Data Overview

- **15 Users** with different statuses and verification levels
- **224 Transactions** with realistic descriptions and amounts
- **133 Notifications** with various types and read states
- **Referral System** with working referral codes
- **Wallet System** with different balance levels

## 🔧 API Testing

### Test API Endpoints

```bash
# Test login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email_or_phone":"victor@test.com","password":"password123"}'

# Test dashboard
curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test wallet
curl -X GET http://localhost:8000/api/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check if backend is running on port 8000
   - Verify CORS configuration in `config/cors.php`

2. **Database Issues**

   - Run `php artisan migrate:fresh --seed` to reset data
   - Check database connection in `.env`

3. **Frontend Issues**

   - Check if `.env.local` exists with correct API URL
   - Clear browser cache and localStorage

4. **API Errors**
   - Check Laravel logs in `storage/logs/laravel.log`
   - Verify all migrations are run

## 📱 Features to Test

### Authentication

- [ ] User registration
- [ ] User login (email/phone)
- [ ] Password validation
- [ ] Remember me functionality

### Dashboard

- [ ] Wallet balance display
- [ ] Notification system
- [ ] Daily reward claim
- [ ] User profile info

### Wallet

- [ ] Transaction history
- [ ] Balance display
- [ ] Transaction filtering
- [ ] Wallet stats

### Profile

- [ ] Profile completion
- [ ] Verification status
- [ ] Avatar upload
- [ ] Profile updates

### Referrals

- [ ] Referral code generation
- [ ] Referral tracking
- [ ] Referral rewards

## 🎯 Next Steps

1. **Test all features** with different user accounts
2. **Customize the UI** as needed
3. **Add additional features** based on requirements
4. **Deploy to production** when ready

## 📞 Support

If you encounter any issues:

1. Check the logs in `backend/storage/logs/`
2. Verify all environment variables are set
3. Ensure both frontend and backend are running
4. Check the API documentation in `backend/API_DOCUMENTATION.md`

Happy testing! 🎉
