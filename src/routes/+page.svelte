<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { FolderOpenOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import WsdlViewer from '$lib/components/WsdlViewer.svelte';
	import { wsdlStore, hasDocument, targetNamespace } from '$lib/stores/wsdl-store';

	let showModal = $state(false);

	onMount(() => {
		const restored = wsdlStore.restoreFromLocalStorage();
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

<div class="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
	<!-- App Toolbar -->
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
			<Button size="sm" color="light" onclick={handleLoadNew}>
				<FolderOpenOutline class="me-1.5 h-4 w-4" />
				Load WSDL
			</Button>
			{#if $hasDocument}
				<Button size="sm" color="alternative" onclick={handleClear}>
					<TrashBinOutline class="me-1.5 h-4 w-4" />
					Clear
				</Button>
			{/if}
		</div>
	</header>

	<!-- Main Content -->
	<main class="min-h-0 flex-1 overflow-auto p-4">
		<WsdlViewer />
	</main>

	<!-- Load WSDL Modal -->
	<FileUpload bind:open={showModal} />
</div>
