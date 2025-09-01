<script lang="ts">
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../lib/stores/uiStore';

	onMount(() => setPageTitle('Sign Up'));
</script>

<div>
	<!-- Description -->
	<div class="mb-12 text-center">
		<h3 class="mb-2 text-xl font-semibold">Why Join Fresh Hub?</h3>
		<p class="text-gray-400">
			Gain instant access to essential learning tools tailored for Ethiopian university freshmen.
		</p>
	</div>

	<!-- Pricing Plans -->
	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Free Plan -->
		<div class="hover:scale-1.2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
			<h4 class="mb-2 text-xl font-bold">Free</h4>
			<p class="mb-4 text-4xl font-extrabold">0 ETB</p>
			<ul class="space-y-2 text-gray-300">
				<li>✓ Access to 2 modules</li>
				<li>✓ Limited quizzes</li>
				<li>✓ Community support</li>
			</ul>
		</div>
		<!-- Standard Plan -->
		<div
			class="hover:scale-1.2 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-lg"
		>
			<h4 class="mb-2 text-xl font-bold">Standard</h4>
			<p class="mb-4 text-4xl font-extrabold">100 ETB</p>
			<ul class="space-y-2 text-white">
				<li>✓ All modules access</li>
				<li>✓ Full quizzes + answers</li>
				<li>✓ Basic video content</li>
			</ul>
		</div>
		<!-- Premium Plan -->
		<div class="hover:scale-1.2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
			<h4 class="mb-2 text-xl font-bold">Premium</h4>
			<p class="mb-4 text-4xl font-extrabold">300 ETB</p>
			<ul class="space-y-2 text-gray-300">
				<li>✓ Everything in Standard</li>
				<li>✓ Offline videos</li>
				<li>✓ Exclusive notes + mentorship</li>
			</ul>
		</div>
	</div>
</div>
// Removed: Telegram only
