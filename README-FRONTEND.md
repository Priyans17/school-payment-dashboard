# School Payment Dashboard - Frontend

A modern React-based dashboard for managing school payments and transactions.

## Features

- **Authentication** - Secure login and registration
- **Transaction Management** - View and filter transactions
- **School-wise Filtering** - Filter transactions by school
- **Status Checking** - Check individual transaction status
- **Payment Creation** - Create new payment requests
- **Responsive Design** - Works on all device sizes
- **Real-time Updates** - Live transaction status updates

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Date-fns** - Date formatting utilities

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend API running (see backend README)

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd school-payment-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure environment variables:
\`\`\`env
VITE_API_URL=http://localhost:3001
\`\`\`

5. Start development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── TransactionTable.tsx  # Transaction table component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── TransactionsBySchool.tsx  # School transactions
│   ├── TransactionStatus.tsx     # Status checker
│   └── CreatePayment.tsx         # Payment creation
├── services/           # API services
│   └── api.ts         # API client and endpoints
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Automatic token refresh

### Dashboard
- Transaction overview with statistics
- Recent transactions table
- Quick actions and navigation

### Transaction Table
- Paginated transaction list
- Sortable columns
- Status filtering
- Search functionality
- Export capabilities
- Hover effects for better UX

### School Transactions
- Filter transactions by school
- School selection interface
- School-specific analytics

### Transaction Status
- Check status by order ID
- Detailed transaction information
- Student information display
- Copy-to-clipboard functionality

### Payment Creation
- Create new payment requests
- Student information form
- Payment URL generation
- Integration with payment gateway

## API Integration

The frontend integrates with the backend API through the following services:

### Authentication API
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Transaction API
- `GET /transactions` - Get all transactions
- `GET /transactions/school/:id` - Get school transactions
- `GET /transaction-status/:id` - Get transaction status

### Payment API
- `POST /payment/create-payment` - Create payment request
- `GET /payment/status/:id` - Check payment status

## Styling

The application uses Tailwind CSS for styling with:

- **Design System** - Consistent colors, spacing, and typography
- **Responsive Design** - Mobile-first approach
- **Component Variants** - Reusable component styles
- **Dark Mode Ready** - Prepared for dark mode implementation
- **Accessibility** - ARIA labels and keyboard navigation

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray Scale**: Various gray shades for text and backgrounds

## State Management

- **React Context** - Authentication state
- **Local State** - Component-specific state
- **URL State** - Filter and pagination state
- **Local Storage** - Token persistence

## Error Handling

- **API Errors** - Centralized error handling
- **Form Validation** - Client-side validation
- **Network Errors** - Retry mechanisms
- **User Feedback** - Toast notifications

## Performance Optimizations

- **Code Splitting** - Route-based code splitting
- **Lazy Loading** - Component lazy loading
- **Memoization** - React.memo for expensive components
- **Debouncing** - Search input debouncing
- **Caching** - API response caching

## Testing

The project is set up for testing with:

- **Unit Tests** - Component testing
- **Integration Tests** - API integration testing
- **E2E Tests** - End-to-end testing setup

Run tests:
\`\`\`bash
npm run test
\`\`\`

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting provider

## Environment Variables

\`\`\`env
# API Configuration
VITE_API_URL=http://localhost:3001

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
\`\`\`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`
