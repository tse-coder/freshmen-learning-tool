import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import courseRoutes from './routes/courses.ts';
import moduleRoutes from './routes/modules.ts';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
