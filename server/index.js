require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { initializeDatabase } = require('./config/database');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://taskflow-app.vercel.app', 'http://localhost:5173']
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #6366f1 }
  `,
    customSiteTitle: 'TaskFlow API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'TaskFlow API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to TaskFlow API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            auth: '/api/auth',
            tasks: '/api/tasks'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server after database initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 TaskFlow API Server                                  ║
║                                                           ║
║   Server running on:  http://localhost:${PORT}              ║
║   API Documentation:  http://localhost:${PORT}/api-docs     ║
║   Environment:        ${(process.env.NODE_ENV || 'development').padEnd(24)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
