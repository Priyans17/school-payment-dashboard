# School Payment Dashboard - Deployment Guide

## Overview
This is a complete School Payment and Dashboard Application built with Next.js (frontend) and Node.js/Express (backend). The application includes authentication, transaction history, payment creation, and transaction status checking.

## Features
- ✅ Authentication (Login and Signup)
- ✅ Dashboard with transaction history
- ✅ Search and filter functionality
- ✅ Export to CSV/Excel
- ✅ Create Payment page
- ✅ Check Transaction Status page
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Backend API integration

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional - uses in-memory storage if not available)

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

### Backend (.env)
```bash
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PG_KEY=your_pg_key_here
PAYMENT_API_URL=https://api.edviron.com
PAYMENT_API_KEY=your_payment_api_key_here
MONGODB_URI=mongodb://localhost:27017/school-payments
JWT_SECRET=your_jwt_secret_here
PORT=3002
```

## Local Development

### 1. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately
npm install
cd backend && npm install
```

### 2. Start Development Servers
```bash
# Start both frontend and backend
npm run start:all

# Or start separately
npm run dev          # Frontend (port 3000)
npm run backend:dev  # Backend (port 3002)
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002/api

## Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_SCHOOL_ID`: Your school ID
4. Deploy

### Backend (Render/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Set environment variables:
   - `SCHOOL_ID`
   - `PG_KEY`
   - `PAYMENT_API_URL`
   - `PAYMENT_API_KEY`
   - `MONGODB_URI` (if using MongoDB)
   - `JWT_SECRET`
   - `PORT`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/school/:schoolId` - Get transactions by school
- `GET /api/transaction-status/:customOrderId` - Check transaction status

### Payments
- `POST /api/payment/create-payment` - Create payment request
- `GET /api/payment/status/:collectRequestId` - Check payment status
- `POST /api/payment/auto-approve/:orderId` - Auto-approve payment
- `POST /api/payment/admin-approve/:orderId` - Admin approve payment

### Orders
- `POST /api/order/create-dummy-data` - Create dummy data
- `POST /api/order/create-raw-data` - Create raw data
- `GET /api/order/export` - Export data

## Database
The application supports both MongoDB and in-memory storage:
- If MongoDB is available, it will use MongoDB
- If MongoDB is not available, it will fall back to in-memory storage
- For production, it's recommended to use MongoDB

## Testing the Application

### 1. Create Account
- Go to http://localhost:3000/register
- Create a new account

### 2. Login
- Go to http://localhost:3000/login
- Login with your credentials

### 3. Dashboard
- View transaction history
- Use search and filters
- Export data

### 4. Create Payment
- Go to Create Payment page
- Fill in amount and callback URL
- Submit to create payment request

### 5. Check Status
- Go to Check Transaction Status page
- Enter collect request ID
- View transaction details

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured for your frontend URL
2. **API connection issues**: Check if backend is running on correct port
3. **Environment variables**: Ensure all required environment variables are set
4. **Database connection**: Check MongoDB connection string

### Logs
- Frontend logs: Check browser console
- Backend logs: Check terminal where backend is running

## Security Notes
- Change default JWT secret in production
- Use HTTPS in production
- Implement proper input validation
- Add rate limiting for API endpoints
- Use environment variables for sensitive data

## Support
For issues or questions, please check the logs and ensure all environment variables are properly set.
