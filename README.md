# School Payment Dashboard

A complete school payment management system with backend microservice and React-based dashboard, built for Edviron.

## 🚀 Features

### Backend (Node.js + MongoDB)
- **REST APIs** for handling orders, transactions, and payments
- **JWT Authentication** for secure access
- **Payment Gateway Integration** with `/create-payment` endpoint
- **Webhook Listener** at `/webhook` for updating payment statuses
- **Transaction Management** with pagination, sorting, and filtering
- **Database Support** with MongoDB (with in-memory fallback)
- **Comprehensive Error Handling** and validation

### Frontend (React + Next.js + Tailwind CSS)
- **Modern Dashboard** with real-time transaction data
- **Payment Creation** form with student information
- **Transaction Status Check** by order ID
- **School-specific Transactions** view
- **Advanced Filtering** and search capabilities
- **Responsive Design** with dark mode support
- **Export Functionality** for transaction data

## 📋 User Flow

1. **Login & Authentication** - Users log in with JWT authentication
2. **Create Payment** - School admins create payment requests for students
3. **Payment Processing** - Webhook integration updates payment statuses
4. **View Transactions** - Dashboard shows all transactions with filtering
5. **School Transactions** - View transactions by specific school
6. **Status Check** - Verify payment status using order ID

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

### Frontend
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- React Hot Toast for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (optional - falls back to in-memory storage)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-payment-backend
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run start:all
   ```

   Or start them individually:
   ```bash
   # Backend (port 3002)
   npm run backend:dev
   
   # Frontend (port 3000)
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3002/api

## 📁 Project Structure

```
school-payment-backend/
├── app/                          # Next.js app directory
│   ├── components/               # Reusable components
│   ├── contexts/                 # React contexts
│   ├── create-payment/           # Payment creation page
│   ├── dashboard/                # Main dashboard page
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── transaction-status/       # Status check page
│   └── transactions/school/      # School transactions page
├── backend/                      # Express.js backend
│   ├── models/                   # Database models
│   ├── routes/                   # API routes
│   ├── middleware/               # Custom middleware
│   └── server.js                 # Main server file
├── src/                          # Source code
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── services/                 # API services
│   └── schemas/                  # TypeScript schemas
└── components/                   # Shared UI components
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Payments
- `POST /api/payment/create-payment` - Create payment request
- `GET /api/payment/status/:id` - Check payment status
- `POST /api/payment/auto-approve/:id` - Auto-approve payment
- `POST /api/payment/admin-approve/:id` - Admin approve/reject payment

### Transactions
- `GET /api/transactions` - Get all transactions (paginated)
- `GET /api/transactions/school/:schoolId` - Get transactions by school
- `GET /api/transaction-status/:orderId` - Check transaction status

### Webhooks
- `POST /api/webhook` - Webhook endpoint for payment updates

## 🗄️ Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (admin/user)
}
```

### Order
```javascript
{
  school_id: String,
  trustee_id: String,
  student_info: {
    name: String,
    id: String,
    email: String
  },
  gateway_name: String,
  custom_order_id: String (unique),
  order_amount: Number,
  status: String,
  created_by: String
}
```

### OrderStatus
```javascript
{
  collect_id: ObjectId (ref: Order),
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  status: String,
  payment_time: Date
}
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# JWT Secret
JWT_SECRET=your-secret-key

# MongoDB URI (optional)
MONGODB_URI=mongodb://localhost:27017/school-payments

# School ID
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# API URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## 🎨 UI Features

- **Dark Mode** - Automatic dark theme
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live transaction data
- **Advanced Filtering** - Filter by status, date, payment method
- **Export Data** - CSV export functionality
- **Search** - Search by order ID, student name, or email
- **Pagination** - Efficient data loading
- **Sorting** - Sort by any column

## 🧪 Testing the Application

1. **Register a new user** at `/register`
2. **Login** with your credentials
3. **Create a payment** using the "Create Payment" button
4. **View transactions** on the dashboard
5. **Check transaction status** using the order ID
6. **View school-specific transactions** by selecting a school

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, AWS, or your preferred platform

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API URLs in environment variables

## 📝 API Documentation

### Create Payment Request
```javascript
POST /api/payment/create-payment
{
  "amount": 1000,
  "student_info": {
    "name": "John Doe",
    "id": "STU001",
    "email": "john@example.com"
  },
  "callback_url": "https://dev-vanilla.edviron.com/erp"
}
```

### Webhook Payload
```javascript
POST /api/webhook
{
  "order_info": {
    "order_id": "EDV123456789",
    "order_amount": 1000,
    "transaction_amount": 1000,
    "payment_mode": "UPI",
    "status": "success",
    "payment_time": "2024-01-01T12:00:00Z"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Edviron School Payment Management**