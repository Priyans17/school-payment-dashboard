<<<<<<< HEAD

=======
# School Payment Dashboard

A comprehensive school payment management system built with Next.js and Node.js. This application provides a complete solution for managing school payments, transactions, and student fee collection.

## 🚀 Features

### Authentication
- **Login & Signup**: Secure user authentication with JWT tokens
- **Form Validation**: Client-side validation with error handling
- **Success/Error States**: Clear feedback for user actions
- **Responsive Design**: Works on desktop, tablet, and mobile

### Dashboard (Transaction History)
- **Search Functionality**: Search by Order ID
- **Advanced Filters**: Filter by Date, Status, and Payment Method
- **Export Capability**: Download data as CSV or Excel
- **Transaction Table**: Complete transaction details with all required columns:
  - Sr. No, Institute Name, Date & Time
  - Order ID, Edviron Order ID (with copy functionality)
  - Order Amount, Transaction Amount, Payment Method
  - Status (Success=Green, Pending=Yellow, Failed=Red)
  - Student Name, Student ID, Phone Number
  - Vendor Amount, Gateway, Capture Status
- **Sorting**: Sort by Date, Status, and Transaction Amount
- **Pagination**: Configurable rows per page (10, 25, 50)
- **Responsive Design**: Mobile-friendly card layout

### Create Payment Page
- **School ID**: Pre-filled from environment variables
- **Amount Input**: Numeric input in INR
- **Callback URL**: Configurable with default test URL
- **Backend Integration**: Calls `/erp/create-collect-request` API
- **JWT Signing**: Automatic JWT generation using PG key
- **Response Display**: Shows Collect Request URL
- **Copy Functionality**: Copy payment links with one click
- **Success/Error Handling**: Clear feedback messages

### Check Transaction Status Page
- **Collect Request ID**: Input for transaction lookup
- **School ID**: Pre-filled from environment variables
- **Status Check**: Calls `/erp/collect-request/{id}` API
- **JWT Signing**: Automatic JWT generation
- **Status Display**: Clear status indicators with colors
- **Transaction Details**: Complete transaction information
- **Error Handling**: Proper error states and messages

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **React Hook Form**: Form handling
- **Axios**: HTTP client
- **React Hot Toast**: Notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database (with in-memory fallback)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional - uses in-memory storage if not available)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd school-payment-backend

# Install all dependencies
npm run install:all

# Start development servers
npm run start:all
```

### Manual Installation
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Start backend server
npm run backend:dev

# Start frontend server (in another terminal)
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SCHOOL_ID=65b0e6293e9f76a9694d84b4
```

Create a `.env` file in the backend directory:
```bash
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PG_KEY=your_pg_key_here
PAYMENT_API_URL=https://api.edviron.com
PAYMENT_API_KEY=your_payment_api_key_here
MONGODB_URI=mongodb://localhost:27017/school-payments
JWT_SECRET=your_jwt_secret_here
PORT=3002
```

## 🚀 Usage

### 1. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002/api

### 2. Create Account
- Navigate to `/register`
- Fill in your details
- Account will be created and you'll be logged in

### 3. Login
- Navigate to `/login`
- Use your credentials to log in

### 4. Dashboard
- View transaction history
- Use search and filters
- Export data as needed

### 5. Create Payment
- Navigate to `/create-payment`
- Enter amount and callback URL
- Submit to create payment request

### 6. Check Status
- Navigate to `/transaction-status`
- Enter collect request ID
- View transaction details

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout
- **Mobile**: Card-based layout for better usability

## 🎨 Design Features

- **Card-based Layout**: Clean, modern design
- **Dark Mode Support**: Toggle between light and dark themes
- **Consistent Typography**: Professional font hierarchy
- **Color-coded Status**: Visual status indicators
- **Hover Effects**: Interactive elements
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Client and server-side validation
- **Environment Variables**: Sensitive data protection

## 📊 API Endpoints

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

### Orders
- `POST /api/order/create-dummy-data` - Create dummy data
- `GET /api/order/export` - Export data

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Heroku)
1. Create web service
2. Connect GitHub repository
3. Set build/start commands
4. Configure environment variables
5. Deploy

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🧪 Testing

### Manual Testing
1. Create account and login
2. Navigate through all pages
3. Test search and filters
4. Create payment requests
5. Check transaction status
6. Test export functionality
7. Verify responsive design

### Test Data
- Use "Create Dummy Data" button on dashboard
- Or create raw data through the form

## 🐛 Troubleshooting

### Common Issues
1. **CORS errors**: Check backend CORS configuration
2. **API connection**: Verify backend is running on port 3002
3. **Environment variables**: Ensure all required variables are set
4. **Database**: Check MongoDB connection or use in-memory storage

### Logs
- Frontend: Browser console
- Backend: Terminal output

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs
3. Ensure environment variables are set correctly
4. Create an issue in the repository

---

**Built with ❤️ for school payment management**
>>>>>>> 70fad72 (Final)
