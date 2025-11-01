import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courseRoutes from './routes/courses.js';
import resourceRoutes from './routes/resources.js';
import videoRoutes from './routes/videos.js';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import questionRoutes from './routes/questions.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';
import { handleError } from './utils/errors.js';
import { SERVER_CONFIG } from './utils/constants.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
	logger.error('Missing required environment variables:', missingEnvVars);
	process.exit(1);
}

const app = express();

// Security middleware
app.use(cors({
	origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
	credentials: true
}));

app.use(express.json({ limit: SERVER_CONFIG.MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ extended: true, limit: SERVER_CONFIG.MAX_REQUEST_SIZE }));

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ 
		status: 'ok', 
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development'
	});
});

// Routes
app.use('/resources', resourceRoutes);
app.use('/courses', courseRoutes);
app.use('/videos', videoRoutes);
app.use('/auth', authRoutes);
app.use('/exams', examRoutes);
app.use('/questions', questionRoutes);

// Global error handler
app.use((err, req, res, next) => {
	handleError(err, req, res);
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		ok: false,
		error: 'Route not found',
		code: 'NOT_FOUND'
	});
});

const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
