import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import candidateRoutes from './routes/candidate.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adminDashboardRoutes from './routes/adminDashboard.routes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import participantRoutes from './routes/participantRoutes.js';
dotenv.config();

const app = express();

connectDB();

// Security Middleware - Disable some headers in development
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    strictTransportSecurity: false
  }));
}
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
}));

console.log(process.env.FRONTEND_URL);


// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// }));

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Logging
app.use(morgan('dev'));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/logs', auditLogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', adminDashboardRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/participants', participantRoutes);


// Error Handling 
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;