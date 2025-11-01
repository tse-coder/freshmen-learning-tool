import express from 'express';
import { getExamQuestions } from '../../src/api/controllers/questions.js';
import { asyncHandler } from '../utils/errors.js';
import { validateQuery, examIdQuerySchema } from '../utils/validation.js';
import { examLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply stricter rate limiting for exam-related endpoints
router.use(examLimiter);

router.get('/', 
	validateQuery(examIdQuerySchema),
	asyncHandler(async (req, res) => {
		const { examId } = req.query;
		const questions = await getExamQuestions(examId);
		res.json({ ok: true, data: questions });
	})
);

export default router;