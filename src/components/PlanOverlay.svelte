<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let show = false;

	let selectedPlan: 'free' | 'paid' | null = null;

	function choose(plan: 'free' | 'paid') {
		selectedPlan = plan;
		dispatch('choose', { plan });
	}

	function close() {
		dispatch('close');
	}
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div
			class="mx-4 w-full max-w-lg transform rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 shadow-2xl"
		>
			<button class="absolute top-4 right-4 text-gray-300" on:click={close} aria-label="Close"
				>&times;</button
			>
			<h3 class="mb-6 text-lg font-semibold text-white">Choose a plan</h3>

			<div class="grid gap-4 md:grid-cols-2">
				<!-- Free card -->
				<button
					on:click={() => choose('free')}
					class="flex flex-col items-start gap-2 rounded-2xl border border-white/6 bg-gray-900/40 p-4 text-left hover:scale-[1.01] focus:outline-none"
				>
					<div class="flex w-full items-center justify-between">
						<div>
							<h4 class="text-base font-semibold text-white">Free</h4>
							<p class="mt-1 text-sm text-gray-300">
								Set username & password to unlock free resources
							</p>
						</div>
						<span class="text-xl font-bold text-white">0 ETB</span>
					</div>
				</button>

				<!-- Paid card -->
				<button
					on:click={() => choose('paid')}
					class="flex flex-col items-start gap-2 rounded-2xl border border-white/6 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-left text-white hover:scale-[1.01] focus:outline-none"
				>
					<div class="flex w-full items-center justify-between">
						<div>
							<h4 class="text-base font-semibold">Standard</h4>
							<p class="mt-1 text-sm text-white/90">Full access to modules, quizzes, and videos</p>
						</div>
						<span class="text-xl font-bold">100 ETB</span>
					</div>
				</button>
			</div>
		</div>
	</div>
{/if}
<!-- Removed: Telegram only -->
