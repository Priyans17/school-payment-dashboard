# Deployment Guide

This guide covers deploying both the backend and frontend of the School Payment Dashboard application.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (for production database)
- Railway account (for backend deployment)
- Vercel account (for frontend deployment)
- GitHub account (for CI/CD)

## Backend Deployment (Railway)

### 1. Setup Railway Project

1. Go to [Railway](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Select the backend service

### 2. Environment Variables

Set the following environment variables in Railway dashboard:

\`\`\`env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-payments?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
PAYMENT_API_URL=https://dev-vanilla.edviron.com/erp
PAYMENT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0
PG_KEY=edvtest01
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PORT=3001
FRONTEND_URL=https://your-frontend-domain.vercel.app
WEBHOOK_SECRET=your-webhook-secret-key
\`\`\`

### 3. Deploy

Railway will automatically deploy when you push to the main branch.

## Frontend Deployment (Vercel)

### 1. Setup Vercel Project

1. Go to [Vercel](https://vercel.com) and create a new project
2. Import your GitHub repository
3. Set the root directory to `frontend` if using monorepo structure

### 2. Environment Variables

Set the following environment variables in Vercel dashboard:

\`\`\`env
VITE_API_URL=https://your-backend-domain.railway.app
\`\`\`

### 3. Build Settings

Vercel will automatically detect the Vite configuration. If needed, set:

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Alternative Deployment Options

### Backend Alternatives

#### Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
\`\`\`bash
git push heroku main
\`\`\`

#### AWS EC2
1. Launch an EC2 instance
2. Install Node.js and PM2
3. Clone repository and install dependencies
4. Start with PM2:
\`\`\`bash
pm2 start dist/main.js --name school-payment-api
\`\`\`

#### DigitalOcean App Platform
1. Create a new app in DigitalOcean
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

### Frontend Alternatives

#### Netlify
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables

#### AWS S3 + CloudFront
1. Build the application: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

## Database Setup (MongoDB Atlas)

### 1. Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Choose a region close to your deployment

### 2. Database User
1. Create a database user with read/write permissions
2. Note the username and password

### 3. Network Access
1. Add your deployment IP addresses to the whitelist
2. For development, you can use `0.0.0.0/0` (not recommended for production)

### 4. Connection String
1. Get the connection string from Atlas
2. Replace `<username>`, `<password>`, and `<dbname>` with your values
3. Use this as your `MONGODB_URI` environment variable

## SSL/HTTPS Setup

### Backend (Railway)
Railway automatically provides HTTPS for all deployments.

### Frontend (Vercel)
Vercel automatically provides HTTPS for all deployments.

### Custom Domain
1. Add your custom domain in the platform dashboard
2. Update DNS records as instructed
3. SSL certificates are automatically provisioned

## Monitoring and Logging

### Backend Monitoring
- Railway provides built-in metrics and logs
- Access logs via Railway dashboard
- Set up alerts for errors and downtime

### Frontend Monitoring
- Vercel provides analytics and performance metrics
- Monitor Core Web Vitals and user experience
- Set up error tracking with services like Sentry

## CI/CD Pipeline

The included GitHub Actions workflow automatically:
1. Runs tests on pull requests
2. Builds the application
3. Deploys to production on main branch pushes

### Setup GitHub Secrets
Add these secrets to your GitHub repository:

\`\`\`
RAILWAY_TOKEN=your-railway-token
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-vercel-org-id
PROJECT_ID=your-vercel-project-id
\`\`\`

## Health Checks

### Backend Health Check
The API includes a health check endpoint:
\`\`\`
GET /health
\`\`\`

### Frontend Health Check
Vercel automatically monitors your frontend deployment.

## Backup Strategy

### Database Backup
1. MongoDB Atlas provides automatic backups
2. Configure backup retention policy
3. Test restore procedures regularly

### Code Backup
1. GitHub serves as primary code backup
2. Consider additional backup strategies for critical data

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your frontend domain
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: Validate all user inputs
6. **JWT Security**: Use strong JWT secrets and appropriate expiration times

## Troubleshooting

### Common Issues

#### Backend Won't Start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check application logs for specific errors

#### Frontend Can't Connect to Backend
- Verify VITE_API_URL is set correctly
- Check CORS configuration in backend
- Ensure backend is deployed and accessible

#### Payment API Issues
- Verify payment API credentials
- Check webhook endpoint is accessible
- Test with payment API documentation

### Debugging Steps
1. Check application logs
2. Verify environment variables
3. Test API endpoints individually
4. Check network connectivity
5. Review error messages and stack traces

## Performance Optimization

### Backend
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Frontend
- Enable code splitting
- Optimize images and assets
- Implement lazy loading
- Use CDN for static assets

## Scaling Considerations

### Backend Scaling
- Use horizontal scaling with load balancers
- Implement database read replicas
- Consider microservices architecture
- Use caching layers (Redis)

### Frontend Scaling
- Vercel automatically handles scaling
- Use CDN for global distribution
- Optimize bundle sizes
- Implement service workers for caching
