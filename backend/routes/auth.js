import express from 'express';
import { login } from '../controllers/auth.js';
const router = express.Router();

router.post('/login', async (req, res) => {
	login(req, res);
});

router.post('/signup', async (req, res) => {
	signup(req, res);
});

export default router;
