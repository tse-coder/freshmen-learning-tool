<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../../lib/stores/uiStore';

	export let data: PageData;
	const { course, resources } = data as any;

	// --- Normalize resources ---
	type NormalizedResource = {
		id: string;
		title: string;
		type: string; // 'module' | 'shortNote' | 'video' | 'quizzes' | 'exams'
		url?: string;
		thumbnail?: string;
	};

	function canonicalType(t: any) {
		if (!t) return '';
		const s = String(t).toLowerCase();
		if (s.startsWith('module')) return 'module';
		if (s.startsWith('short') || s.includes('note')) return 'shortNote';
		if (s.startsWith('video')) return 'video';
		if (s.startsWith('quiz') || s.startsWith('quizzes')) return 'quizzes';
		if (s.startsWith('exam') || s.startsWith('exams')) return 'exams';
		return s;
	}

	const normalizedResources: NormalizedResource[] = (resources || []).map((r: any) => ({
		id: r.id ?? r._id ?? `${r.course_Id ?? 'r'}-${Math.random().toString(36).slice(2, 8)}`,
		title: r.title ?? r.name ?? 'Untitled',
		type: canonicalType(r.type ?? r.resource_type ?? r.name),
		url: r.url ?? r.link ?? '',
		thumbnail: r.thumbnail ?? r.thumb ?? ''
	}));

	// --- Section toggle state ---
	let openSections: Record<string, boolean> = {
		module: false,
		exams: false,
		quizzes: false,
		shortNote: false,
		video: false
	};

	onMount(() => setPageTitle(course.name.replace(/-/g, ' ')));

	function toggleSection(section: string) {
		openSections[section] = !openSections[section];
		openSections = { ...openSections };
	}

	// --- Navigation ---
	function getResourceLink(section: string, resourceId: string) {
		if (section === 'video') return `${course.id}/video-player/${resourceId}`;
		if (section === 'module' || section === 'shortNote') return `${course.id}/pdf-reader/${resourceId}`;
		return `/course/${course.id}/${section}`;
	}

	function handleResourceClick(section: string, resource: NormalizedResource) {
		if ((section === 'module' || section === 'shortNote') && resource.url && window.Telegram?.WebApp) {
			// Open PDF directly inside Telegram mini app
			window.Telegram.WebApp.openLink(resource.url);
		} else if (section === 'video') {
			window.location.href = getResourceLink(section, resource.id);
		} else {
			// Fallback for other sections
			window.location.href = getResourceLink(section, resource.id);
		}
	}


	function formatSectionName(section: string) {
		const map: Record<string, string> = {
			module: 'Modules',
			shortNote: 'Short Notes',
			video: 'Videos',
			quizzes: 'Quizzes',
			exams: 'Exams'
		};
		return map[section] ?? section.charAt(0).toUpperCase() + section.slice(1);
	}

	function getResourcesByType(type: string) {
		const wanted = canonicalType(type);
		return normalizedResources.filter((r) => canonicalType(r.type || r.title || '') === wanted).slice(0, 6);
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-200 to-blue-100 dark:from-gray-900 dark:to-black p-6 text-gray-900 dark:text-white md:p-10">

	{#each ['module', 'exams', 'quizzes', 'shortNote', 'video'] as section}
		<div class="mb-8">
			<!-- Section Toggle -->
			<button
				on:click={() => toggleSection(section)}
				class="flex w-full items-center justify-between rounded-2xl border border-gray-400/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/90 dark:hover:bg-white/10"
			>
				<span>{formatSectionName(section)}</span>
				<svg
					class="h-6 w-6 transform transition-transform duration-300 {openSections[section] ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if openSections[section]}
				{#if getResourcesByType(section).length > 0}
					<div
						transition:fade={{ duration: 300 }}
						class="mt-4 rounded-2xl border border-gray-400/40 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 pb-3 backdrop-blur-lg"
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
									class="w-60 shrink-0 cursor-pointer snap-start rounded-2xl border border-gray-400/40 dark:border-white/10 bg-white/80 dark:bg-white/10 p-4 backdrop-blur-lg transition duration-300 hover:shadow-2xl focus:outline focus:outline-2 focus:outline-blue-500"
								>
									{#if section === 'video'}
										<img
											src={resource.thumbnail}
											alt={resource.title}
											loading="lazy"
											class="mb-2 h-32 w-full scale-105 rounded-lg object-cover transition-transform duration-300 hover:scale-107"
										/>
									{/if}
									<h3 class="truncate text-base font-semibold text-gray-800 dark:text-white">{resource.title}</h3>
									<p class="text-sm text-gray-600 dark:text-gray-300 capitalize">{resource.type}</p>
								</div>
							{/each}
						</div>
						<a
							href={`/course/${course.id}/${section}`}
							class="mt-4 block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
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
