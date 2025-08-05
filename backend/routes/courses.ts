import express from 'express';
import { getCourses } from '../controllers/courses.ts';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const courses = await getCourses();
		res.json(courses);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch courses' });
	}
});

export default router;
