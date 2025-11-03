<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { Clock, LogOut } from 'lucide-svelte';

	export let timeLeft: number;
	const dispatch = createEventDispatcher();
	let interval: any;

	function formatTime(s: number) {
		const m = Math.floor(s / 60).toString().padStart(2, '0');
		const sec = (s % 60).toString().padStart(2, '0');
		return `${m}:${sec}`;
	}

	onMount(() => {
		interval = setInterval(() => {
			if (timeLeft > 0) timeLeft -= 1;
			else {
				clearInterval(interval);
				dispatch('quit');
			}
		}, 1000);
	});

	onDestroy(() => clearInterval(interval));
</script>

<div class="flex justify-between items-center">
	<div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
		<Clock class="w-4 h-4" />
		<span>Time Left: {formatTime(timeLeft)}</span>
	</div>
	<button
		on:click={() => dispatch('quit')}
		class="flex items-center gap-2 px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
	>
		<LogOut class="w-4 h-4" />
		Quit
	</button>
</div>
