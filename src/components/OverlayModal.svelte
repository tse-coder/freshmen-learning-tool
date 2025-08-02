<!-- src/lib/components/OverlayModal.svelte -->
<script lang="ts">
	export let message: string;
	export let onClose: () => void;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
	<div class="max-w-sm rounded-xl border border-white/10 bg-gray-900 p-8 text-center text-white">
		<h2 class="mb-4 text-xl font-bold">Coming Soon 🚧</h2>
		<p class="mb-6 text-gray-300">{message}</p>
		<button class="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500" on:click={onClose}>OK</button>
	</div>
</div>
