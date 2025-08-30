<script lang="ts">
	export let message: string = 'Something went wrong';
	export let actionLabel: string | null = null;
	export let onAction: (() => void) | null = null;
</script>

<div class="rounded-md border border-red-500/20 bg-red-900/30 p-3 text-sm text-red-200">
	<div class="flex items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<svg class="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.518 9.8A1.75 1.75 0 0116.518 16H3.482a1.75 1.75 0 01-1.742-2.101l5.517-9.8zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-7a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75s.75-.336.75-.75v-4.5A.75.75 0 0010 6z"
					clip-rule="evenodd"
				/>
			</svg>
			<div>{message}</div>
		</div>
		{#if actionLabel && onAction}
			<button class="rounded bg-red-600 px-3 py-1 text-sm font-semibold" on:click={onAction}
				>{actionLabel}</button
			>
		{/if}
	</div>
</div>
