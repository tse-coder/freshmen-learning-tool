import express from 'express';
import { getModulesByCourseId } from '../controllers/modules.ts';

const router = express.Router();

router.get('/:courseId', async (req, res) => {
	try {
		const modules = await getModulesByCourseId(req.params.courseId);
		res.json(modules);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch modules' });
	}
});

export default router;
