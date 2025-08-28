<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let show = false;

    function payCBE() {
        // placeholder deep link - real integration will replace this
        window.open('cbe://', '_blank');
        dispatch('paid', { method: 'CBE' });
    }

    function payTelebirr() {
        window.open('telebirr://', '_blank');
        dispatch('paid', { method: 'Telebirr' });
    }

    function close() {
        dispatch('close');
    }
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div class="mx-4 w-full max-w-lg transform rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 shadow-2xl">
			<button class="absolute top-4 right-4 text-gray-300" on:click={close} aria-label="Close">&times;</button>
			<header class="mb-4">
				<h3 class="text-lg font-semibold text-white">Choose Payment Method</h3>
				<p class="mt-1 text-sm text-gray-400">Select your preferred mobile payment to complete the purchase.</p>
			</header>

			<div class="grid gap-4 md:grid-cols-2">
				<!-- Telebirr Card -->
				<button on:click={payTelebirr} class="flex items-center gap-4 rounded-2xl border border-white/6 bg-gray-900/40 p-4 text-left hover:scale-[1.01] focus:outline-none">
					<img src="/assets/telebirr.svg" alt="Telebirr" class="h-10 w-10" />
					<div>
						<div class="text-sm font-semibold text-white">Telebirr</div>
						<div class="text-xs text-gray-300">Fast mobile payments</div>
					</div>
					<div class="ml-auto text-sm font-bold text-white">Pay</div>
				</button>

				<!-- CBE Card -->
				<button on:click={payCBE} class="flex items-center gap-4 rounded-2xl border border-white/6 bg-gray-900/40 p-4 text-left hover:scale-[1.01] focus:outline-none">
					<img src="/assets/cbe.svg" alt="CBE" class="h-10 w-10" />
					<div>
						<div class="text-sm font-semibold text-white">CBE Mobile</div>
						<div class="text-xs text-gray-300">Bank transfer via CBE</div>
					</div>
					<div class="ml-auto text-sm font-bold text-white">Pay</div>
				</button>
			</div>
		</div>
	</div>
{/if}
