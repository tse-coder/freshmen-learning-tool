import express from 'express';
import { getAllExams, getExamDataByCourseId } from '../../src/api/controllers/exams.js';
import { asyncHandler } from '../utils/errors.js';
import { validateQuery, courseIdQuerySchema } from '../utils/validation.js';
import { examLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply stricter rate limiting for exam endpoints
router.use(examLimiter);

// Route to fetch exam data by course ID
router.get('/', 
	validateQuery(courseIdQuerySchema),
	asyncHandler(async (req, res) => {
		const { courseId } = req.query;
		const data = await getExamDataByCourseId(courseId);
		res.json({ ok: true, data });
	})
);

// Route to get all exams
router.get('/all', 
	asyncHandler(async (req, res) => {
		const data = await getAllExams();
		res.json({ ok: true, data });
	})
);

export default router;
