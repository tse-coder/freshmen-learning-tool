import express from 'express'
import { getExamQuestions } from '../../src/api/controllers/questions.js';

const router = express.Router();

router.get('/',async(req,res)=>{
    const examId = req.query.examId;
    let questions;
    try {
        questions = await getExamQuestions(examId);
    } catch (error) {
        console.error("error fetching questions:",error)
        return res.status(500).json({err:error})
    }
    return res.json(questions);
})
export default router;