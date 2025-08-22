import express from 'express';
import { getVideosByCourseId } from '../controllers/videos.js';

const router = express.Router();

// GET all videos for a single courseId
// Example: /videos?courseId=abc123
router.get('/', async (req, res) => {
	const { courseId } = req.query;

	if (!courseId || typeof courseId !== 'string') {
		return res.status(400).json({ error: 'courseId is required' });
	}

	try {
		const data = await getVideosByCourseId(courseId);
		res.json(data);
	} catch (err) {
		console.error('Error in /videos route:', err);
		res.status(500).json({ error: 'Failed to fetch videos' });
	}
});

export default router;
