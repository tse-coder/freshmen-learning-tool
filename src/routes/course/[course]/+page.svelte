<script lang="ts">
	// @ts-nocheck
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../../lib/stores/uiStore';

	export let data: PageData;
	const { course, resources, exams } = data as any;
	console.log(course);
	// --- Normalize resources ---
	type NormalizedResource = {
		id: string;
		title: string;
		type: string; // 'module' | 'shortNote' | 'video'
		url?: string;
		thumbnail?: string;
	};
	type NormalizedExam = {
		id: string;
		title: string;
		description?: string;
		duration?: number; // in minutes
		type: string; // 'midExam' | 'finalExam'
	};

	function canonicalType(t: any) {
		if (!t) return '';
		const s = String(t).toLowerCase();
		if (s.startsWith('module')) return 'module';
		if (s.startsWith('short') || s.includes('note')) return 'shortNote';
		if (s.startsWith('video')) return 'video';
		if (s === 'final') return 'finalExam';
		if (s === 'mid') return 'midExam';
		return s;
	}

	const normalizedResources: NormalizedResource[] = (resources || []).map((r: any) => ({
		id: r.id ?? r._id ?? `${r.course_Id ?? 'r'}-${Math.random().toString(36).slice(2, 8)}`,
		title: r.title ?? r.name ?? 'Untitled',
		type: canonicalType(r.type ?? r.resource_type ?? r.name),
		url: r.url ?? r.link ?? '',
		thumbnail: r.thumbnail ?? r.thumb ?? ''
	}));

	const normalizedExams: NormalizedExam[] = (exams || []).map((e: any) => ({
		id: e.id ?? e._id ?? `${course.id ?? 'e'}-${Math.random().toString(36).slice(2, 8)}`,
		title: e.title ?? e.name ?? 'Untitled Exam',
		type: canonicalType(e.type ?? 'final'), // normalize to final or mid
		description: e.description ?? '',
		duration: e.duration ?? 30 // default to 30 minutes
	}));

	// --- Section toggle state ---
	let openSections: Record<string, boolean> = {
		module: false,
		finalExam: false,
		midExam: false,
		shortNote: false,
		video: false
	};

	onMount(() => setPageTitle(course.name.replace(/-/g, ' ')));

	function toggleSection(section: string) {
		openSections[section] = !openSections[section];
		openSections = { ...openSections };
	}

	function formatSectionName(section: string) {
		const map: Record<string, string> = {
			finalExam: 'Final Exams',
			midExam: 'Mid Exams',
			module: 'Modules',
			shortNote: 'Short Notes',
			video: 'Videos'
		};
		return map[section] ?? section.charAt(0).toUpperCase() + section.slice(1);
	}

	function getResourcesByType(type: string) {
		if (type === 'finalExam' || type === 'midExam')
			return normalizedExams.filter((e) => e.type === type).slice(0, 4);
		return normalizedResources.filter((r) => r.type === type).slice(0, 4);
	}

	function handleResourceClick(section: string, resource: NormalizedResource | NormalizedExam) {
		if ((section === 'module' || section === 'shortNote') && 'url' in resource && resource.url) {
			if (window.Telegram && window.Telegram.WebApp) {
				// Try to force external opening
				window.open(resource.url, '_blank', 'noopener,noreferrer');
			} else {
				// Fallback for normal browsers
				window.open(resource.url, '_blank', 'noopener,noreferrer');
			}
		} else if (section === 'video') {
			window.location.href = `${course.id}/video-player/${resource.id}`;
		} else if (section === 'finalExam' || section === 'midExam') {
			window.location.href = `/course/${course.id}/exam/${resource.id}`;
		} else {
			window.location.href = `${course.id}/${section}/${resource.id}`;
		}
	}

	function getMoreLink(section: string) {
		if (section === 'midExam') {
			return `/course/${course.id}/exams?tab=mid`;
		}
		if (section === 'finalExam') {
			return `/course/${course.id}/exams?tab=final`;
		}
		return `/course/${course.id}/${section}`;
	}
</script>

<div
	class="min-h-screen bg-gradient-to-b from-gray-200 to-blue-100 p-6 text-gray-900 md:p-10 dark:from-gray-900 dark:to-black dark:text-white"
>
	{#each ['module', 'midExam', 'finalExam', 'shortNote', 'video'] as section}
		<div class="mb-8">
			<!-- Section Toggle -->
			<button
				on:click={() => toggleSection(section)}
				class="flex w-full items-center justify-between rounded-2xl border border-gray-400/40 bg-white/70 p-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
			>
				<span>{formatSectionName(section)}</span>
				<svg
					class="h-6 w-6 transform transition-transform duration-300 {openSections[section]
						? 'rotate-180'
						: ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{#if openSections[section]}
				{#if getResourcesByType(section).length > 0}
					<div
						transition:fade={{ duration: 300 }}
						class="mt-4 rounded-2xl border border-gray-400/40 bg-white/70 p-4 pb-3 backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
					>
						<div class="scrollbar-custom flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
							{#each getResourcesByType(section) as resource}
								<div
									role="button"
									tabindex="0"
									on:click={() => handleResourceClick(section, resource)}
									on:keypress={(e) => {
										if (e.key === 'Enter' || e.key === ' ') handleResourceClick(section, resource);
									}}
									class="w-60 shrink-0 cursor-pointer snap-start rounded-2xl border border-gray-400/40 bg-white/80 p-4 backdrop-blur-lg transition duration-300 hover:shadow-2xl focus:outline focus:outline-2 focus:outline-blue-500 dark:border-white/10 dark:bg-white/10"
								>
									{#if section === 'video' && 'thumbnail' in resource && resource.thumbnail}
										<div class="relative h-36 w-full overflow-hidden rounded-t-md">
											<img
												src={resource.thumbnail}
												alt={resource.title}
												class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										</div>
									{/if}
									<h3 class="truncate text-base font-semibold text-gray-800 dark:text-white">
										{resource.title}
									</h3>
									{#if section === 'finalExam' || section === 'midExam'}
										<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
											Duration: {resource.duration} min
										</p>
									{:else}
										<p class="text-sm text-gray-600 capitalize dark:text-gray-300">
											{resource.type}
										</p>
									{/if}
								</div>
							{/each}
						</div>
						<a
							href={getMoreLink(section)}
							class="mt-4 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
						>
							More {formatSectionName(section)} →
						</a>
					</div>
				{:else}
					<p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
						No {formatSectionName(section)} available.
					</p>
				{/if}
			{/if}
		</div>
	{/each}
</div>
