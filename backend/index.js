import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courseRoutes from './routes/courses.js';
import resourceRoutes from './routes/resources.js';
import videoRoutes from './routes/videos.js';
import bot from './controllers/bot.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/resources', resourceRoutes);
app.use('/courses', courseRoutes);
app.use('/videos', videoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
