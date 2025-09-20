# Deployment Guide - School Payment Dashboard

## Quick Start

### 1. Environment Setup

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development
```bash
npm run dev
```

## Production Deployment

### Frontend (Vercel - Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   NEXT_PUBLIC_SCHOOL_ID=65b0e6293e9f76a9694d84b4
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Frontend (Netlify)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add your environment variables

### Backend (Railway - Recommended)

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Deploy from GitHub repo

2. **Environment Variables**
   ```
   SCHOOL_ID=65b0e6293e9f76a9694d84b4
   PG_KEY=your_pg_key_here
   PAYMENT_API_URL=your_payment_api_url_here
   PAYMENT_API_KEY=your_payment_api_key_here
   JWT_SECRET=your_jwt_secret_here
   MONGODB_URI=your_mongodb_connection_string_here
   ```

3. **Deploy**
   - Railway will automatically detect Node.js
   - Deploy with `npm start`

### Backend (Heroku)

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set SCHOOL_ID=65b0e6293e9f76a9694d84b4
   heroku config:set PG_KEY=your_pg_key_here
   heroku config:set PAYMENT_API_URL=your_payment_api_url_here
   heroku config:set PAYMENT_API_KEY=your_payment_api_key_here
   heroku config:set JWT_SECRET=your_jwt_secret_here
   heroku config:set MONGODB_URI=your_mongodb_connection_string_here
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3002/api
      - NEXT_PUBLIC_SCHOOL_ID=65b0e6293e9f76a9694d84b4
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3002:3002"
    environment:
      - SCHOOL_ID=65b0e6293e9f76a9694d84b4
      - PG_KEY=your_pg_key_here
      - PAYMENT_API_URL=your_payment_api_url_here
      - PAYMENT_API_KEY=your_payment_api_key_here
      - JWT_SECRET=your_jwt_secret_here
      - MONGODB_URI=your_mongodb_connection_string_here
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Environment Variables Reference

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yourapp.com/api` |
| `NEXT_PUBLIC_SCHOOL_ID` | School identifier | `65b0e6293e9f76a9694d84b4` |

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `SCHOOL_ID` | School identifier | `65b0e6293e9f76a9694d84b4` |
| `PG_KEY` | Payment gateway key | `your_pg_key_here` |
| `PAYMENT_API_URL` | Payment API endpoint | `https://api.payment.com` |
| `PAYMENT_API_KEY` | Payment API key | `your_payment_api_key_here` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_here` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/school_payments` |

## Build Commands

### Development
```bash
# Frontend only
npm run dev

# Backend only
npm run backend:dev

# Both frontend and backend
npm run start:all
```

### Production
```bash
# Build frontend
npm run build

# Start production
npm run start

# Backend production
cd backend && npm start
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall
   - Verify all environment variables

2. **API Connection Issues**
   - Verify backend is running
   - Check CORS configuration
   - Ensure correct API URL

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret configuration
   - Verify token expiration

4. **Database Connection**
   - Verify MongoDB URI
   - Check database permissions
   - Ensure network connectivity

### Debug Commands

```bash
# Check environment variables
npm run env

# Test API connection
curl http://localhost:3002/api/health

# Check build output
npm run build --verbose
```

## Performance Optimization

### Frontend
- Enable Next.js Image Optimization
- Use dynamic imports for large components
- Implement proper caching headers

### Backend
- Add Redis for session storage
- Implement database indexing
- Use connection pooling

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secrets are strong
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] HTTPS enabled in production
- [ ] Database access restricted
- [ ] API rate limiting enabled

## Monitoring

### Health Checks
- Frontend: `GET /api/health`
- Backend: `GET /api/health`

### Logging
- Frontend: Console logs in development
- Backend: Structured logging with Winston

## Support

For deployment issues:
1. Check the logs in your hosting platform
2. Verify all environment variables
3. Test locally first
4. Check network connectivity

---

**Last Updated**: December 2024
**Version**: Final v6.0
