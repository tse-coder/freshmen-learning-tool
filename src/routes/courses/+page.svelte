<script lang="ts">
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { setPageTitle } from '../../lib/stores/uiStore';
import Loader from '../../components/Loader.svelte';
import ErrorBanner from '../../components/ErrorBanner.svelte';
import { ensureAllCourseResources } from '../../lib/stores/cacheContext';
import Lottie from '../../components/Lottie.svelte';
export let data;
const courses = data.fetchedCourses;

onMount(() => setPageTitle('Courses'));



let loadingCourseId: string | null = null;
let courseError: Record<string, string | null> = {};

function getLottieFile(courseName: string): string {
	// Normalize course name to match lottie file
	const map: Record<string, string> = {
		'Applied Maths I': 'Maths',
		'Maths (natural)': 'Maths',
		'Maths (social)': 'Maths',
		'Antropology': 'Antropology',
		'Biology': 'Biology',
		'Chemistry': 'Chemistry',
		'Civics': 'Civics',
		'Economics': 'Economics',
		'Emerging Tech': 'Emerging',
		'English': 'English',
		'Entrepreneurship': 'Entrepreneurship',
		'Geography': 'Geography',
		'Global Trends': 'Global',
		'History': 'History',
		'Inclusiveness': 'Inclusiveness',
		'Logic': 'Logic',
		'Physical Fitness': 'PhysicalFitness',
		'Physics': 'Physics',
		'Psychology': 'Psychology',
	};
	// fallback: remove spaces and parens
	const key = map[courseName] || courseName.replace(/\s|\(|\)/g, '');
	return `/lottie/${key}.json`;
}

async function viewResources(courseId: string) {
	loadingCourseId = courseId;
	courseError[courseId] = null;
	try {
		await ensureAllCourseResources(courseId);
		goto(`/course/${courseId}`);
	} catch (err) {
		console.error('Failed to prefetch resources for course', courseId, err);
		courseError[courseId] = String((err as any)?.message ?? err ?? 'Failed to load');
	} finally {
		loadingCourseId = null;
	}
}
</script>

<div class="min-h-screen bg-main p-6 prose prose-slate max-w-none">

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each courses as course}
			<div
				class="glass-card p-6 transition-transform duration-300 hover:scale-105 flex items-center justify-between relative"
			>
				<div class="text-center">
					<h2 class="mb-2 text-sm font-serif italic font-semibold tracking-tight text-heading dark:text-slate-100">{course.name}</h2>
					<ul class="list-none p-0 m-0 space-y-1 text-xs text-muted dark:text-slate-300 leading-snug">
						<li>
							<span class="inline-block text-primary dark:text-primary font-semibold mr-1">Modules:</span>
							<span class="text-black dark:text-slate-300 font-light">{course.modules}</span>
						</li>
						<li>
							<span class="inline-block text-primary dark:text-primary font-semibold mr-1">Notes:</span>
							<span class="text-black dark:text-slate-300 font-light">{course.notes}</span>
						</li>
						<li>
							<span class="inline-block text-primary dark:text-primary font-semibold mr-1">Videos:</span>
							<span class="text-black dark:text-slate-300 font-light">{course.videos}</span>
						</li>
					</ul>
				</div>
				   <Lottie
					   path={getLottieFile(course.name)}
					   autoplay={true}
					   loop={true}
					   rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
					   className="w-24 h-24 mb-2"
				   />
				{#if courseError[course.id]}
					<div class="mt-4">
						<ErrorBanner message={courseError[course.id] ?? 'Failed to load'} actionLabel="Retry" onAction={() => viewResources(course.id)} />
					</div>
				{:else}
					<div class="mt-4">
						<button
							class="flex items-center justify-center gap-2 btn-primary py-2 transition duration-300 disabled:opacity-60 absolute bottom-0 right-0 z-0 course-card-button px-10"
							on:click={() => viewResources(course.id)}
							disabled={loadingCourseId === course.id}
						>
							{#if loadingCourseId === course.id}
								<Loader small={true} message="Loading" />
							{:else}
								View Resources
							{/if}
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
