<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Initialize Flowbite when component mounts
	onMount(async () => {
		if (typeof window !== 'undefined') {
			const flowbite = await import('flowbite');
			flowbite.initFlowbite();
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
