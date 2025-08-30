<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../lib/stores/uiStore';
	import Loader from '../../components/Loader.svelte';
	import ErrorBanner from '../../components/ErrorBanner.svelte';
	import { ensureAllCourseResources } from '../../lib/stores/cacheContext';
	export let data;
	const courses = data.fetchedCourses;

	onMount(() => setPageTitle('Courses'));

	let loadingCourseId: string | null = null;
	let courseError: Record<string, string | null> = {};

	async function viewResources(courseId: string) {
		// immediate feedback
		loadingCourseId = courseId;
		courseError[courseId] = null;
		try {
			// prefetch resources & videos (cacheContext will short-circuit if already present)
			await ensureAllCourseResources(courseId);
			// navigate when ready
			goto(`/course/${courseId}`);
		} catch (err) {
			console.error('Failed to prefetch resources for course', courseId, err);
			courseError[courseId] = String((err as any)?.message ?? err ?? 'Failed to load');
		} finally {
			loadingCourseId = null;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 text-white">

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each courses as course}
			<div
				class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105"
			>
				<h2 class="mb-2 text-xl font-semibold">{course.name}</h2>
				<ul class="space-y-1 text-sm text-gray-300">
					<li><span class="font-medium text-blue-400">Modules:</span> {course.modules}</li>
					<li><span class="font-medium text-blue-400">Notes:</span> {course.notes}</li>
					<li><span class="font-medium text-blue-400">Videos:</span> {course.videos}</li>
				</ul>
				{#if courseError[course.id]}
					<div class="mt-4">
						<ErrorBanner message={courseError[course.id] ?? 'Failed to load'} actionLabel="Retry" onAction={() => viewResources(course.id)} />
					</div>
				{:else}
					<div class="mt-4">
						<button
							class="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2 font-semibold text-white transition duration-300 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
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
