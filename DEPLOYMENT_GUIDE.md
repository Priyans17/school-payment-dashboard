# Deployment Guide

## Environment Variables Setup

### Backend (.env in backend/ directory)
```env
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/school-payments
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PORT=3002
```

### Frontend (.env.local in root directory)
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

## Production Deployment

### Backend Deployment (Heroku/AWS/DigitalOcean)
1. Set environment variables in your hosting platform
2. Update MONGODB_URI to your production MongoDB instance
3. Update CORS origins to include your frontend domain
4. Deploy the backend folder

### Frontend Deployment (Vercel/Netlify)
1. Set NEXT_PUBLIC_API_URL to your backend URL
2. Deploy the root directory

## Key Configuration Updates Made

1. **Payment Callback URL**: Updated to `https://dev-vanilla.edviron.com/erp`
2. **API Integration**: All frontend components properly connected to backend
3. **Authentication**: JWT-based auth with proper error handling
4. **Database**: MongoDB with in-memory fallback for development

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads real transaction data
- [ ] Payment creation redirects to Edviron ERP
- [ ] Transaction status check works
- [ ] School-specific transactions work
- [ ] Webhook endpoint is accessible
- [ ] All API endpoints respond correctly

## Production URLs to Update

1. Update CORS origins in `backend/server.js`
2. Update API base URL in `src/services/api.ts`
3. Update callback URL in payment creation if needed