import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabaseClient } from '../../config/supabase/client.js';
import { coursesArray } from './data/courses.js';

dotenv.config();

// Init Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const baseDir = path.resolve(process.cwd(), './pdf');
console.log('🏫 Base directory for courses:', baseDir);

/**
 * Extract questions directly from PDF using Gemini
 */
async function extractQuestionsWithGemini(pdfPath: string) {
	console.log(`📄 Sending PDF to Gemini: ${pdfPath}`);

	const pdfBytes = fs.readFileSync(pdfPath);

	const prompt = `You are an AI that extracts exam questions from a PDF.

Requirements:
1. Only extract valid questions:
   - Multiple choice (with options and the correct answer)
   - Short-answer questions (with expected answer)
   - True/False questions should be treated as MCQ with options ["True","False"]
   - Ignore diagrams, images, tables
2. Estimate a reasonable duration (integer minutes) for the exam.
3. Return strictly valid JSON in this format:

{
  "duration": 60,
  "questions": [
    {
      "question": "Question text",
      "type": "mcq" | "short",
      "options": ["A. Option 1","B. Option 2","C. Option 3","D. Option 4"] | null (for short answer),
      "answer": "the correct answer from the options array or text answer if short answer quetion"
    }
  ]
}  the fields should be valid strings`;

	try {
		const result = await model.generateContent([
			{ text: prompt },
			{ inlineData: { data: pdfBytes.toString('base64'), mimeType: 'application/pdf' } }
		]);

		let raw = result.response.text();
		raw = raw
			.replace(/```json\s*/g, '')
			.replace(/```/g, '')
			.trim();

		const json = JSON.parse(raw);
		return json;
	} catch (err: any) {
		console.error('❌ Gemini extraction failed:', err.message);
		return { duration: 60, questions: [] };
	}
}

/**
 * Process a single exam PDF
 */
async function processExam(course: { id: string; name: string }, pdfPath: string) {
	const supabase = getSupabaseClient();
	console.log(`\n📂 Processing: ${course.name} | exam | ${path.basename(pdfPath)}`);

	// Detect mid/final type
	const parentDir = path.basename(path.dirname(pdfPath)).toLowerCase();
	const examType = parentDir.includes('mid')
		? 'mid'
		: parentDir.includes('final')
			? 'final'
			: 'unknown';
	console.log(`📌 Detected exam type: ${examType}`);

	// Check if exam already exists (matching course, title and type)
	const payload = {
		course_id: course.id,
		title: path.basename(pdfPath, '.pdf'),
		type: examType,
		duration: 60, // Placeholder for now
		description: `Exam extracted from ${path.basename(pdfPath)}`
	};

	try {
		const { data: existing, error: fetchErr } = await supabase
			.from('exams')
			.select()
			.match({ course_id: payload.course_id, title: payload.title, type: payload.type })
			.limit(1);

		if (fetchErr) {
			console.error('❌ Failed to check existing exam:', fetchErr);
			return;
		}

		if (existing && existing.length > 0) {
			console.log(
				`ℹ️ Exam already exists, skipping: ${payload.title} (${payload.type}) for course ${course.name}`
			);
			return;
		}
	} catch (err) {
		console.error('❌ Unexpected error while checking existing exam:', err);
		return;
	}

	const { duration, questions } = await extractQuestionsWithGemini(pdfPath);

	console.log(`⏱ Estimated duration: ${duration} min`);
	console.log(`🤖 Extracted ${questions.length} questions`);

	if (!questions.length) {
		console.warn('⚠️ No questions extracted, skipping:', pdfPath);
		return;
	}

	// Insert exam record into the database
	try {
		const { data: exam, error } = await supabase.from('exams').insert([payload]).select().single();

		if (error) {
			console.error('❌ Failed to insert exam:', error);
			return;
		}
		console.log(`✅ Inserted exam: ${exam.title} (${exam.id})`);

		// Insert questions
		const records = questions.map((q: any) => {
			let qType = q.type?.toLowerCase();

			if (qType === 'mcq' || qType === 'true/false') {
				qType = 'multiple_choice';
			} else if (qType === 'short') {
				qType = 'fill_in_blank';
			} else {
				// fallback to multiple_choice
				qType = 'multiple_choice';
			}

			return {
				exam_id: exam.id,
				question: String(q.question),
				type: qType,
				options: q.options || null,
				answer: String(q.answer).trim()
			};
		});

		const { error: qError } = await supabase.from('exam_questions').insert(records);
		if (qError) {
			console.error('❌ Failed to insert questions:', qError);
		} else {
			console.log(`✅ Inserted ${records.length} questions for ${course.name} ${examType} exam`);
		}
	} catch (err) {
		console.error('❌ Unexpected error while inserting exam or questions:', err);
	}
}

/**
 * Main runner
 */
async function main() {
	for (const course of coursesArray) {
		const examsDir = path.join(baseDir, course.name, 'exams');

		for (const examSub of ['mid', 'final']) {
			const dir = path.join(examsDir, examSub);
			if (!fs.existsSync(dir)) {
				console.log(`⚠️ No ${examSub} exams for ${course.name}`);
				continue;
			}

			const files = fs.readdirSync(dir).filter((f) => f.endsWith('.pdf'));
			console.log(`📂 Found ${files.length} ${examSub} exam(s) in ${dir}`);

			for (const file of files) {
				const pdfPath = path.join(dir, file);
				await processExam(course, pdfPath);
			}
		}
	}
}

main().catch(console.error);
