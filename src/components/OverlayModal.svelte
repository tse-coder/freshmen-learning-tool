<!-- src/lib/components/OverlayModal.svelte -->
<script lang="ts">
	export let message: string;
	export let onClose: () => void;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
	<div
		class="mx-4 w-full max-w-md transform rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 shadow-2xl backdrop-blur-md transition-all duration-200"
		role="dialog"
		aria-modal="true"
	>
		<header class="mb-4 flex items-start justify-between">
			<div>
				<h2 class="text-lg font-semibold text-white">Coming Soon</h2>
				<p class="mb-6 text-gray-300">{message}</p>
			</div>
			<button
				class="ml-4 rounded-full bg-white/5 p-2 text-gray-200 hover:bg-white/7"
				on:click={onClose}
				aria-label="Close"
			>
				&times;
			</button>
		</header>

		<div class="mt-2 flex justify-center">
			<button
				class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
				on:click={onClose}
			>
				OK
			</button>
		</div>
	</div>
</div>
