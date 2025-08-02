import type { LoadEvent } from '@sveltejs/kit';

export interface Question {
	question: string;
	answers: { text: string; correct: boolean }[];
}
export function load({ params }: LoadEvent) {
	const questions: Question[] = [
		{
			question: 'What is the largest continent in the world?',
			answers: [
				{ text: 'Australia', correct: false },
				{ text: 'Asia', correct: true },
				{ text: 'Africa', correct: false },
				{ text: 'North America', correct: false }
			]
		},
		{
			question: 'What is the smalest continent in the world?',
			answers: [
				{ text: 'Australia', correct: true },
				{ text: 'Asia', correct: false },
				{ text: 'Africa', correct: false },
				{ text: 'North America', correct: false }
			]
		},
		{
			question: 'What is the largest animal in the world?',
			answers: [
				{ text: 'Elephant', correct: false },
				{ text: 'Rabbit', correct: false },
				{ text: 'Shark', correct: false },
				{ text: 'Blue Whale', correct: true }
			]
		},
		{
			question: 'Which one of the following is fruit?',
			answers: [
				{ text: 'Cabage', correct: false },
				{ text: 'potato', correct: false },
				{ text: 'Apple', correct: true },
				{ text: 'Milk', correct: false }
			]
		}
	];
	return { questions };
}
