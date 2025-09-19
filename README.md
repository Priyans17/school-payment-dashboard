# School Payment and Dashboard Backend

A comprehensive NestJS backend application for managing school payments and transactions with MongoDB integration.

## Features

- **JWT Authentication** - Secure user authentication and authorization
- **Payment Gateway Integration** - Integration with Edviron payment API
- **Webhook Processing** - Real-time payment status updates
- **Transaction Management** - Complete transaction lifecycle management
- **MongoDB Integration** - Robust data persistence with Mongoose
- **API Documentation** - Comprehensive REST API endpoints

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd school-payment-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/school-payments?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Payment Gateway Configuration
PAYMENT_API_URL=https://dev-vanilla.edviron.com/erp
PAYMENT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0
PG_KEY=edvtest01
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# Application Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
\`\`\`

4. Start the development server:
\`\`\`bash
npm run start:dev
\`\`\`

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Payment Management
- `POST /payment/create-payment` - Create a new payment request
- `GET /payment/status/:collectRequestId` - Check payment status

### Transaction Management
- `GET /transactions` - Get all transactions (with pagination)
- `GET /transactions/school/:schoolId` - Get transactions by school
- `GET /transaction-status/:customOrderId` - Get transaction status

### Webhook
- `POST /webhook` - Process payment webhooks

### Utility
- `POST /order/create-dummy-data` - Create dummy data for testing

## API Usage Examples

### Register User
\`\`\`bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
\`\`\`

### Create Payment
\`\`\`bash
curl -X POST http://localhost:3001/payment/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000,
    "student_info": {
      "name": "Student Name",
      "id": "STU001",
      "email": "student@example.com"
    },
    "callback_url": "https://yourapp.com/payment-success"
  }'
\`\`\`

### Get All Transactions
\`\`\`bash
curl -X GET "http://localhost:3001/transactions?page=1&limit=10&sort=createdAt&order=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

## Database Schemas

### User Schema
- email (string, unique)
- password (string, hashed)
- name (string)
- role (string, default: 'user')

### Order Schema
- school_id (ObjectId)
- trustee_id (ObjectId)
- student_info (object with name, id, email)
- gateway_name (string)
- custom_order_id (string)
- amount (number)
- status (string)

### Order Status Schema
- collect_id (ObjectId, reference to Order)
- order_amount (number)
- transaction_amount (number)
- payment_mode (string)
- payment_details (string)
- bank_reference (string)
- payment_message (string)
- status (string)
- error_message (string)
- payment_time (Date)
- gateway (string)

### Webhook Log Schema
- event_type (string)
- payload (object)
- status_code (number)
- order_id (string)
- processing_status (string)
- error_message (string)
- source_ip (string)

## Testing with Postman

Import the following collection for testing:

\`\`\`json
{
  "info": {
    "name": "School Payment API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"John Doe\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
\`\`\`

## Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
\`\`\`bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
\`\`\`

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with class-validator
- CORS configuration
- Environment variable protection

## Error Handling

The API implements comprehensive error handling with:
- Validation errors for invalid input
- Authentication errors for unauthorized access
- Database errors for connection issues
- Payment gateway errors for API failures

## Logging

The application includes structured logging for:
- Webhook processing events
- Payment API interactions
- Database operations
- Error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
