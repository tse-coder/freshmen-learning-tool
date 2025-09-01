<script lang="ts">
    export let small: boolean = false;
    export let message: string;
</script>

<div>

</div>
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
	<div
		class="mx-4 w-full max-w-md transform rounded-2xl p-6 shadow-2xl backdrop-blur-md transition-all duration-200 flex-col items-center"
		role="dialog"
		aria-modal="true"
	>
    <!-- border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 -->
        <div class="flex justify-center mb-10">
            <svg class={small ? 'h-6 w-6 animate-spin' : 'h-20 w-20 animate-spin'} viewBox="0 0 24 24">
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#33f"
                    stroke-width="4"
                    fill="none"
                ></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
        </div>
        <p class="mb-6 text-gray-300 text-center my-5 text-lg font-bold">{message}</p>
	</div>
</div>