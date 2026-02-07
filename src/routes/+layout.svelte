<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/stores/theme-store';

	let { children } = $props();

	// Initialize theme and Flowbite when component mounts
	onMount(async () => {
		initTheme();

		if (typeof window !== 'undefined') {
			const flowbite = await import('flowbite');
			flowbite.initFlowbite();
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
