<script lang="ts">
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { setPageTitle } from '../../lib/stores/uiStore';
import Loader from '../../components/Loader.svelte';
import ErrorBanner from '../../components/ErrorBanner.svelte';
import { ensureAllCourseResources } from '../../lib/stores/cacheContext';
import Lottie from '../../components/Lottie.svelte';
	import SearchBar from '../../components/SearchBar.svelte';
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

let searchValue=""

</script>

<div class="min-h-screen 
  bg-gradient-to-br from-gray-50 via-white to-gray-100 
  dark:from-gray-900 dark:via-black dark:to-gray-800 
  p-6 text-gray-900 dark:text-white">
  <SearchBar place={"Search for courses..."} bind:value={searchValue}/>
  <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each courses.filter(course=>course.name.toLowerCase().includes(searchValue.toLowerCase())) as course}
      <div
        class="p-6 rounded-2xl border border-black/10 bg-white/70 
          dark:border-white/10 dark:bg-white/5 
          backdrop-blur-lg shadow-lg 
          transition-transform duration-300 hover:scale-105 
          flex items-center justify-between relative"
      >
        <div class="text-center">
          <h2 class="mb-2 text-sm font-serif italic font-semibold tracking-tight 
            text-gray-800 dark:text-gray-100">
            {course.name}
          </h2>
          <ul class="list-none p-0 m-0 space-y-1 text-xs leading-snug">
            <li>
              <span class="inline-block font-semibold text-blue-600 dark:text-blue-400 mr-1">
                Modules:
              </span>
              <span class="text-gray-700 dark:text-gray-300">{course.modules}</span>
            </li>
            <li>
              <span class="inline-block font-semibold text-blue-600 dark:text-blue-400 mr-1">
                Notes:
              </span>
              <span class="text-gray-700 dark:text-gray-300">{course.notes}</span>
            </li>
            <li>
              <span class="inline-block font-semibold text-blue-600 dark:text-blue-400 mr-1">
                Videos:
              </span>
              <span class="text-gray-700 dark:text-gray-300">{course.videos}</span>
            </li>
          </ul>
        </div>

        {#key getLottieFile(course.name)}
          <Lottie
            path={getLottieFile(course.name)}
            autoplay={true}
            loop={true}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            className="w-24 h-24 mb-2"
          />
        {/key}

        {#if courseError[course.id]}
          <div class="mt-4">
            <ErrorBanner 
              message={courseError[course.id] ?? 'Failed to load'} 
              actionLabel="Retry" 
              onAction={() => viewResources(course.id)} 
            />
          </div>
        {:else}
          <div class="mt-4">
            <button
              class="flex items-center justify-center gap-2 py-2 px-10 rounded-tl-xl rounded-br-lg
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                hover:from-blue-700 hover:to-indigo-700
                shadow-md transition duration-300 
                disabled:opacity-60 absolute bottom-0 right-0"
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

