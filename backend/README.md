# IRMS Backend - Refactored

A clean, maintainable, and scalable backend for the IRMS (Interview and Recruitment Management System) built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Clean Architecture**: Separation of concerns with services, controllers, and models
- **Comprehensive Validation**: Input validation using Joi
- **Error Handling**: Centralized error handling with proper logging
- **Authentication**: JWT-based authentication with role-based access control
- **Email Integration**: Automated email notifications
- **Calendar Integration**: Google Calendar integration for scheduling
- **File Upload**: CSV upload functionality
- **Analytics**: Comprehensive dashboard analytics
- **Audit Logging**: Track all changes to candidate data

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   ├── db.js              # Database connection
│   ├── calendarConfig.js  # Google Calendar configuration
│   └── emailConfig.js     # Email configuration
├── controllers/           # Request handlers
│   ├── candidate.controller.js
│   ├── auth.controller.js
│   ├── analyticsController.js
│   └── ...
├── middlewares/          # Express middlewares
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── upload.js
│   └── ...
├── models/              # Mongoose models
│   ├── candidate.model.js
│   ├── auth.model.js
│   └── ...
├── routes/              # API routes
│   ├── candidate.routes.js
│   ├── auth.routes.js
│   ├── adminDashboard.routes.js
│   └── ...
├── services/            # Business logic
│   ├── candidateService.js
│   ├── analyticsService.js
│   ├── calendarService.js
│   └── ...
├── utils/               # Utility functions
│   ├── validation.js
│   ├── emailService.js
│   ├── generateUniqueId.js
│   └── ...
└── app.js              # Main application file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bd_candidates_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/irms
   JWT_SECRET=your_jwt_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Candidates

#### Create Candidate
```http
POST /api/candidates/add-candidate
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "1234567890",
  "category": "placement",
  "course": "software_development",
  "joiningDate": "2024-01-15",
  "addresses": {
    "permanent": "123 Main St",
    "current": "456 Oak Ave"
  },
  "contacts": {
    "father": {
      "name": "John Smith",
      "phone": "0987654321"
    }
  }
}
```

#### Get All Candidates
```http
GET /api/candidates/get-all-candidates?page=1&limit=10&status=active&category=placement
Authorization: Bearer <token>
```

#### Update Candidate
```http
PUT /api/candidates/update-candidate/SID001
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active",
  "training": {
    "stage": "poc",
    "stageUpdateDate": "2024-01-20"
  }
}
```

#### Add Interview
```http
POST /api/candidates/SID001/interviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "domain": "Full Stack Development",
  "interviewDateTime": "2024-01-25T10:00:00Z",
  "companyName": "Tech Corp",
  "interviewLevel": "Technical",
  "hrName": "HR Manager",
  "hrEmail": "hr@techcorp.com"
}
```

### Analytics

#### Dashboard Summary
```http
GET /api/analytics/dashboard-summary
Authorization: Bearer <token>
```

#### Daily Analytics
```http
GET /api/analytics/daily?days=7
Authorization: Bearer <token>
```

#### Category Statistics
```http
GET /api/analytics/categories
Authorization: Bearer <token>
```

## 🔧 Key Improvements

### 1. **Clean Architecture**
- **Separation of Concerns**: Business logic moved to services
- **Single Responsibility**: Each module has a specific purpose
- **Dependency Injection**: Services are easily testable and maintainable

### 2. **Improved Data Model**
- **Organized Schema**: Related fields grouped into subdocuments
- **Better Indexing**: Optimized database queries
- **Validation**: Comprehensive input validation

### 3. **Enhanced Error Handling**
- **Centralized Error Management**: Consistent error responses
- **Proper Logging**: Winston logger for production debugging
- **Custom Error Classes**: Specific error types for different scenarios

### 4. **Service Layer**
- **CandidateService**: Handles all candidate operations
- **AnalyticsService**: Manages dashboard and analytics
- **CalendarService**: Google Calendar integration
- **EmailService**: Email notifications

### 5. **Validation**
- **Joi Validation**: Comprehensive input validation
- **Custom Validators**: Specific validation for each entity
- **Error Messages**: User-friendly validation errors

## 🚀 Performance Optimizations

1. **Database Indexing**: Optimized queries with proper indexes
2. **Pagination**: Efficient data retrieval for large datasets
3. **Caching**: Redis integration for frequently accessed data
4. **Compression**: Response compression for better performance

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Role-Based Access**: Different permissions for different roles
3. **Input Validation**: Prevents injection attacks
4. **Rate Limiting**: Prevents abuse
5. **Helmet**: Security headers

## 📊 Monitoring & Logging

1. **Winston Logger**: Structured logging
2. **Error Tracking**: Comprehensive error logging
3. **Audit Trail**: Track all data changes
4. **Performance Monitoring**: Request/response timing

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Docker
```bash
# Build image
docker build -t irms-backend .

# Run container
docker run -p 3000:3000 irms-backend
```

### Environment Variables
Make sure to set all required environment variables in production:
- `NODE_ENV=production`
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@v-accel.com or create an issue in the repository. 