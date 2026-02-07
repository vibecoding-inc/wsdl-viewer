<script lang="ts">
	import FileUpload from '$lib/components/FileUpload.svelte';
	import WsdlViewer from '$lib/components/WsdlViewer.svelte';
	import { Button } from 'flowbite-svelte';
	import { wsdlStore, hasDocument, targetNamespace } from '$lib/stores/wsdl-store';
	import { onMount } from 'svelte';

	let showModal = $state(false);

	onMount(() => {
		const restored = wsdlStore.restoreFromStorage();
		if (!restored) {
			showModal = true;
		}
	});

	function handleLoadNew() {
		showModal = true;
	}

	function handleClear() {
		wsdlStore.clear();
		showModal = true;
	}
</script>

<div class="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
	<!-- Compact app toolbar -->
	<header class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center gap-3">
			<h1 class="text-lg font-semibold text-gray-900 dark:text-white">WSDL Viewer</h1>
			{#if $hasDocument && $targetNamespace}
				<code class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
					{$targetNamespace}
				</code>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if $hasDocument}
				<Button size="xs" color="alternative" onclick={handleClear}>Clear</Button>
			{/if}
			<Button size="xs" onclick={handleLoadNew}>Load WSDL</Button>
		</div>
	</header>

	<main class="flex-1 overflow-auto px-4 py-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-5xl">
			<WsdlViewer />
		</div>
	</main>

	<FileUpload bind:open={showModal} />
</div>
