<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import OverlayModal from '../../../components/OverlayModal.svelte';
	import AuthOverlay from '../../../components/AuthOverlay.svelte';
	import { isAuthenticated } from '../../../lib/stores/auth';
	import PlanOverlay from '../../../components/PlanOverlay.svelte';
	import PaymentOptions from '../../../components/PaymentOptions.svelte';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../../lib/stores/uiStore';
	import type { Resource } from '../../../types/types';

	export let data: PageData;

	const { course, resources } = data as any;

	// Normalize resources to a consistent shape so sample data and API responses match

	type NormalizedResource = {
		id: string;
		title: string;
		type: string; // canonical type: 'module' | 'shortNote' | 'video' | 'quizzes' | 'exams' | etc
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

	const normalizedResources: (NormalizedResource & { sample?: boolean })[] = (resources || []).map(
		(r: any) => {
			const id = r.id ?? r._id ?? `${r.course_Id ?? 'r'}-${Math.random().toString(36).slice(2, 8)}`;
			const isSample =
				String(id).startsWith('resourse') || String(r.course_Id ?? '').includes('course');
			return {
				id,
				title: r.title ?? r.name ?? 'Untitled',
				type: canonicalType(r.type ?? r.resource_type ?? r.name),
				url: r.url ?? r.link ?? '',
				thumbnail: r.thumbnail ?? r.thumb ?? '',
				sample: isSample
			};
		}
	);

	onMount(() => setPageTitle(course.name.replace(/-/g, ' ')));

	// keys must match the section names used when rendering
	let openSections: { [key: string]: boolean } = {
		module: false,
		exams: false,
		quizzes: false,
		shortNote: false,
		video: false
	};

	let showOverlay = false;
	let showAuthOverlay = false;
	let pendingSection: string | null = null;
	let showPlanOverlay = false;
	let showPaymentOptions = false;
	let pendingResourceId: string | null = null;
	let pendingResourceSection: string | null = null;

	function toggleSection(section: string) {
		if (section === 'quizzes' || section === 'exams') {
			// require auth
			let authed = false;
			const unsub = isAuthenticated.subscribe((v) => (authed = v));
			unsub();
			if (!authed) {
				pendingSection = section;
				showAuthOverlay = true;
				return;
			}
			showOverlay = true;
			return;
		}
		openSections[section] = !openSections[section];
		openSections = { ...openSections };
	}

	function closeOverlay() {
		showOverlay = false;
	}

	function handleAuthSuccess() {
		// after successful auth, open the pending protected section
		if (pendingSection) {
			showOverlay = true;
			pendingSection = null;
		}
		// if there was a pending resource (clicked before auth), navigate to it now
		if (pendingResourceId && pendingResourceSection) {
			window.location.href = getResourceLink(pendingResourceSection, pendingResourceId);
			pendingResourceId = null;
			pendingResourceSection = null;
		}
		showAuthOverlay = false;
	}

	function getResourceLink(section: string, resourceId: string): string {
		if (section === 'video') {
			return `${course.id}/video-player/${resourceId}`;
		} else if (section === 'module' || section === 'shortNote') {
			return `${course.id}/pdf-reader/${resourceId}`;
			// return resources.find((r: Resource) => r.id === resourceId)?.url;
		} else {
			return `/course/${course.id}/${section}`;
		}
	}

	function formatSectionName(section: string): string {
		// map internal keys to display names
		const map: Record<string, string> = {
			module: 'Modules',
			shortNote: 'Short Notes',
			video: 'Videos',
			quizzes: 'Quizzes',
			exams: 'Exams'
		};
		return map[section] ?? section.charAt(0).toUpperCase() + section.slice(1);
	}

	function handleResourceClick(section: string, id: string) {
		// Require authentication for any clicked resource/video
		let authed = false;
		const unsub = isAuthenticated.subscribe((v) => (authed = v));
		unsub();
		if (!authed) {
			pendingResourceId = id;
			pendingResourceSection = section;
			showPlanOverlay = true;
			return;
		}
		// if authed, proceed to resource
		window.location.href = getResourceLink(section, id);
	}

	function getResourcesByType(type: string) {
		const wanted = canonicalType(type);
		return normalizedResources.filter((r) => {
			const rt = canonicalType(r.type || r.title || '');
			if (!wanted) return false;
			// match canonical types (module, shortNote, video, quizzes, exams)
			return rt === wanted;
		});
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6 text-white md:p-10">
	<h1 class="mb-10 text-center text-4xl font-bold capitalize">{course.name.replace(/-/g, ' ')}</h1>

	{#each ['module', 'exams', 'quizzes', 'shortNote', 'video'] as section}
		<div class="mb-8">
			<!-- Section Toggle Button -->
			<button
				on:click={() => toggleSection(section)}
				class="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-lg font-semibold text-gray-200 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
			>
				<span>{formatSectionName(section)}</span>

				{#if section === 'quizzes' || section === 'exams'}
					<span class="text-xl">🔒</span>
				{:else}
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
				{/if}
			</button>

			{#if openSections[section]}
				{#if getResourcesByType(section).length > 0}
					<div
						transition:fade={{ duration: 300 }}
						class="mt-4 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent p-4 pb-3 backdrop-blur-md"
					>
						<div class="scrollbar-custom flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
							{#each getResourcesByType(section) as resource}
								<div
									role="button"
									tabindex="0"
									on:click={() => handleResourceClick(section, resource.id)}
									on:keypress={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											handleResourceClick(section, resource.id);
										}
									}}
									class="w-60 shrink-0 cursor-pointer snap-start rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-lg transition duration-300 hover:shadow-2xl focus:outline focus:outline-2 focus:outline-blue-500"
								>
									{#if section === 'video'}
										<img
											src={resource.thumbnail}
											alt={resource.title}
											loading="lazy"
											class="mb-2 h-32 w-full scale-105 rounded-sm object-cover transition-transform duration-300 hover:scale-107"
										/>
									{/if}
									<h3 class="truncate text-base font-semibold text-white">{resource.title}</h3>
									<p class="text-sm text-gray-400 capitalize">{resource.type}</p>
								</div>
							{/each}
						</div>

						<a
							href={`/course/${course.id}/${section}`}
							class="mt-4 block text-sm font-medium text-blue-400 hover:underline"
						>
							More {formatSectionName(section)} →
						</a>
					</div>
				{:else}
					<p class="mt-2 text-sm text-gray-400">
						No {formatSectionName(section)} available.
					</p>
				{/if}
			{/if}
		</div>
	{/each}
</div>

{#if showOverlay}
	<OverlayModal
		onClose={closeOverlay}
		message="This section is under development and will be available soon."
	/>
{/if}

{#if showAuthOverlay}
	<AuthOverlay
		show={showAuthOverlay}
		mode="login"
		on:close={() => (showAuthOverlay = false)}
		on:success={() => handleAuthSuccess()}
	/>
{/if}

{#if showPlanOverlay}
	<PlanOverlay
		show={showPlanOverlay}
		on:close={() => (showPlanOverlay = false)}
		on:choose={(e: CustomEvent) => {
			const plan = e.detail.plan;
			showPlanOverlay = false;
			if (plan === 'free') {
				// show login/signup overlay to set username/password
				showAuthOverlay = true;
			} else {
				// paid plan -> show payment options
				showPaymentOptions = true;
			}
		}}
	/>
{/if}

{#if showPaymentOptions}
	<PaymentOptions
		show={showPaymentOptions}
		on:close={() => (showPaymentOptions = false)}
		on:paid={(e: CustomEvent) => {
				// mark user as authed after payment for demo; navigate to resource
				import('../../../lib/stores/auth').then((m) => m.loginDemo({ username: 'paid_user' }));
				showPaymentOptions = false;
				if (pendingResourceId && pendingResourceSection) {
					window.location.href = getResourceLink(pendingResourceSection, pendingResourceId);
					pendingResourceId = null;
					pendingResourceSection = null;
				}
		}}
	/>
{/if}
