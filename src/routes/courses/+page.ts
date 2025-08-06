import { fetchCourses } from '../../api/fetcher';

export const load = async () => {
	const courses = await fetchCourses();
	return {
		courses
	};
};
