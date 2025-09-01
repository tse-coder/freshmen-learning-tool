<!-- src/lib/components/OverlayModal.svelte -->
<script lang="ts">
	export let onClose: () => void;
    export let message: string = "Something went wrong"
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
	<div
		class="mx-4 w-full max-w-md transform rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 shadow-2xl backdrop-blur-md transition-all duration-200 flex-col items-center relative"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute right-4 top-4 rounded-full bg-white/5 p-1 px-2 text-gray-200 hover:bg-white/7"
			on:click={onClose}
			aria-label="Close"
		>
			&times;
		</button>
		<header class="mb-4 flex-col justify-between text-center">
				<h2 class="text-lg font-semibold text-white mb-5">Error</h2>
				<p class="mb-6 text-gray-300">{message}</p>
		</header>
	</div>
</div>
