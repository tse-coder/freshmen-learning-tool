import express from 'express';
import { getAllExams, getExamDataByCourseId } from '../../src/api/controllers/exams.js';
const router = express.Router();

// Route to fetch exam data by ID
router.get('/', async (req, res) => {
  try {
    const data = await getExamDataByCourseId(req.query.courseId);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching exam data: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// route to get all exams
router.get('/all', async (req, res) => {
    try {
        const data = await getAllExams();
        res.json(data);
    } catch (error) {
        console.error(`Error fetching all exams: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export default router;
