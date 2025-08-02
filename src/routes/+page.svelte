<script lang="ts">
	import { goto } from '$app/navigation';
	const quote =
		'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.';
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6 text-white"
>
	<h1 class="mb-10 text-center text-5xl font-extrabold">Fresh Hub</h1>

	<!-- Quote Component -->
	<div class="relative mb-10 w-full max-w-2xl text-xl italic">
		<div
			class="relative rounded-r-xl border-l-4 border-blue-500 bg-white/5 py-4 pr-4 pl-5 text-gray-300 shadow-md backdrop-blur-lg"
		>
			“{quote}”
			<svg
				class="absolute top-2 right-4 h-6 w-6 text-blue-400 opacity-30"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M9.75 9.75h-3v7.5h7.5V14.25h-4.5v-4.5Zm8.25 0h-3v7.5h7.5V14.25h-4.5v-4.5Z" />
			</svg>
		</div>
	</div>

	<p class="mb-12 max-w-xl text-center text-lg text-gray-400">
		Fresh Hub is your all-in-one platform to access course modules, quizzes, exams, and video
		content—tailored for Ethiopian university freshmen.
	</p>

	<!-- Buttons -->
	<div class="flex space-x-6">
		<button
			class="relative cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:from-blue-700 hover:to-indigo-700"
			on:click={() => goto('./signin')}
		>
			Log In
		</button>
		<button
			class="relative cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
			on:click={() => goto('./signup')}
		>
			Sign Up
		</button>
	</div>
</div>

<style>
</style>
