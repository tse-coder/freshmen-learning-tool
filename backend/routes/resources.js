import express from 'express';
import {
	getAllResourcesByCourseId,
	getResourcesByCourseIdandType
} from '../controllers/resources.js';

const router = express.Router();

// get request with param name "courseId" and "type"
router.get('/', async (req, res) => {
	let data;
	try {
		if (!req.query.type) {
			data = await getAllResourcesByCourseId(req.query.courseId);
		} else {
			data = await getResourcesByCourseIdandType(req.query.courseId, req.query.type);
		}
		res.json(data);
	} catch (err) {
		console.error('Error in /resources route:', err);
		res.status(500).json({ error: 'Failed to fetch resources' });
	}
});

export default router;
