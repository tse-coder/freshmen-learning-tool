import express from 'express';
import { login, signup } from '../../src/api/controllers/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

// Apply strictest rate limiting for auth endpoints
router.use(authLimiter);

router.post('/login', asyncHandler(async (req, res) => {
	await login(req, res);
}));

router.post('/signup', asyncHandler(async (req, res) => {
	await signup(req, res);
}));

export default router;
