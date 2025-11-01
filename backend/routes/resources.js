import express from 'express';
import {
	getAllResourcesByCourseId,
	getResourcesByCourseIdandType
} from '../../src/api/controllers/resources.js';
import { asyncHandler } from '../utils/errors.js';
import { validateQuery, courseIdSchema } from '../utils/validation.js';
import { z } from 'zod';

const router = express.Router();

const resourceQuerySchema = z.object({
	courseId: courseIdSchema,
	type: z.string().optional()
});

router.get('/', 
	validateQuery(resourceQuerySchema),
	asyncHandler(async (req, res) => {
		const { courseId, type } = req.query;
		
		let data;
		if (!type) {
			data = await getAllResourcesByCourseId(courseId);
		} else {
			data = await getResourcesByCourseIdandType(courseId, type);
		}
		
		res.json({ ok: true, data });
	})
);

export default router;
