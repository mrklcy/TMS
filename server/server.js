const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// OWASP A05: Disable X-Powered-By header to prevent technology stack fingerprinting
app.disable('x-powered-by');

// OWASP A05: Set Security HTTP Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://api.dicebear.com"],
      connectSrc: ["'self'", "https://*.mongodb.net"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// OWASP A03: Sanitize data against NoSQL Query Injections ($gt, $ne, $where)
app.use(mongoSanitize({
  replaceWith: '_'
}));

// OWASP A08: Prevent HTTP Parameter Pollution
app.use(hpp());

// CORS configuration - Allow local dev and production origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware with Payload Size Limitation (OWASP A04: DoS Prevention)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// OWASP A04: Rate Limiting against Brute-Force & Denial of Service (DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 300, // Max 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 15, // Max 15 auth attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes.' }
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Connect to MongoDB Atlas Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// OWASP A09: Health check & Security Audit Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'TaskFlow Pro OWASP Top 10 Hardened Backend',
    security: {
      helmetHeaders: 'active',
      noSqlSanitize: 'active',
      rateLimiting: 'active',
      hppProtection: 'active',
      jwtAuth: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler (OWASP A05: Hide internal stack traces from clients)
app.use((err, req, res, next) => {
  console.error('Security/App Error Handler:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔒 TaskFlow Pro OWASP-Hardened Backend running on port ${PORT}`);
});
