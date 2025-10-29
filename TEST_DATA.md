# Test Data Documentation

This document describes the test data created for the myDelsu application.

## Test Users

### Main Test Accounts

| Email | Password | Name | Status | Wallet Balance | Verification |
|-------|----------|------|--------|----------------|--------------|
| victor@test.com | password123 | Victor Ijomah | Current Student | ₦15,000 | ✅ Verified |
| sarah@test.com | password123 | Sarah Johnson | Current Student | ₦8,500 | ✅ Verified |
| michael@test.com | password123 | Michael Brown | Aspirant | ₦2,500 | ❌ Not Verified |
| grace@test.com | password123 | Grace Williams | Alumni | ₦22,000 | ✅ Verified |
| david@test.com | password123 | David Davis | Current Student | ₦1,200 | ⏳ Pending |

### Additional Test Users
- **User6-User15**: Random test users with various statuses and wallet balances
- **Total**: 15 test users created

## Test Data Features

### Users
- **Different Statuses**: Aspirant, Current Student, Alumni
- **Verification States**: Not Submitted, Pending, Approved, Rejected
- **Profile Completion**: 20% to 100%
- **Wallet Balances**: ₦500 to ₦50,000
- **Referral Codes**: Unique codes for each user
- **Referral Relationships**: Some users have referral numbers linking to other users

### Transactions
- **10-20 transactions per user** (150-300 total transactions)
- **Transaction Types**: Credit and Debit
- **Amounts**: ₦50 to ₦10,000
- **Statuses**: Completed, Pending, Failed
- **Payment Methods**: Bank Transfer, Card, Wallet, Referral Bonus, Admin Credit
- **Descriptions**: Realistic transaction descriptions for airtime, data, withdrawals, etc.
- **Time Range**: Last 30 days with random timestamps

### Notifications
- **5-15 notifications per user** (75-225 total notifications)
- **Types**: Info, Success, Warning, Error
- **Categories**: Welcome, Profile, Referrals, Wallet, Academic, System
- **Read Status**: Mix of read and unread notifications
- **Time Range**: Last 30 days with random timestamps

## Sample Transaction Descriptions

### Credit Transactions
- Account funding via bank transfer
- Referral bonus - User activated
- Daily reward claimed
- Past question upload reward
- Project upload reward
- Hostel upload reward
- Contest prize
- Admin credit

### Debit Transactions
- MTN Airtime - ₦500
- Airtel Airtime - ₦1000
- Glo Airtime - ₦750
- 9mobile Airtime - ₦300
- MTN Data - 2GB
- Airtel Data - 1.5GB
- Glo Data - 3GB
- 9mobile Data - 1GB
- Withdrawal to bank account
- Hostel booking payment
- Course material purchase

## Sample Notifications

### Welcome & Profile
- Welcome to myDelsu!
- Profile verification pending
- Profile approved!
- Complete your profile to get started

### Academic
- New past questions uploaded
- Exam timetable available
- Registration deadline approaching
- New course materials available

### Wallet & Rewards
- Referral bonus earned
- Daily reward available
- Wallet funded successfully
- Withdrawal processed
- Airtime/Data purchase successful

### System
- Contest winner announcement
- System maintenance notice

## How to Use Test Data

### 1. Run Seeders
```bash
cd backend
php artisan db:seed
```

### 2. Test Login
Use any of the main test accounts:
- **victor@test.com** / password123 (Fully verified user)
- **sarah@test.com** / password123 (Verified user with good balance)
- **michael@test.com** / password123 (Unverified aspirant)

### 3. Test Features
- **Dashboard**: View wallet balance, notifications, announcements
- **Wallet**: See transaction history, different transaction types
- **Profile**: Test verification status, profile completion
- **Referrals**: Test referral relationships and codes

### 4. Test Scenarios
- **New User**: Register and see welcome notifications
- **Verified User**: Full access to all features
- **Unverified User**: Limited access, verification prompts
- **Referral System**: Test referral codes and relationships

## Data Relationships

### Referral Chain
- **VIC001** (Victor) → **MIC003** (Michael)
- **SAR002** (Sarah) → **DAV005** (David)
- Additional random referral relationships

### Transaction Patterns
- New users typically have more credit transactions (signup bonuses)
- Active users have mixed credit/debit transactions
- Recent transactions are more likely to be pending

### Notification Patterns
- New users get welcome and profile completion notifications
- Verified users get academic and system notifications
- All users get wallet and reward notifications

## Customization

To modify test data:
1. Edit the respective seeder files
2. Run `php artisan db:seed --class=SeederName`
3. Or run `php artisan db:seed` to refresh all data

## Notes

- All test data uses realistic Nigerian phone numbers (+234)
- Wallet balances are in Nigerian Naira (₦)
- Timestamps are spread across the last 30 days
- Data is designed to test various user states and scenarios
- Referral codes follow a consistent pattern (3 letters + 3 digits)
