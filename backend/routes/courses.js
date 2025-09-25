import express from 'express';
import { getCourses } from '../../src/api/controllers/courses.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const courses = await getCourses();
		res.json(courses);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
