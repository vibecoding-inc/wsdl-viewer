<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { FolderOpenOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import WsdlViewer from '$lib/components/WsdlViewer.svelte';
	import WsdlSidebar from '$lib/components/WsdlSidebar.svelte';
	import {
		wsdlStore,
		hasDocument,
		targetNamespace,
		activeTab,
		services,
		operations,
		types,
		messages,
		updateTabHash,
		restoreNavigationState,
		parseHash,
		scrollToElement
	} from '$lib/stores/wsdl-store';

	let showModal = $state(false);

	const tabs = [
		{ label: 'Services', icon: '🖧' },
		{ label: 'Operations', icon: '⚡' },
		{ label: 'Types', icon: '🔷' },
		{ label: 'Messages', icon: '✉' }
	];

	function tabCount(index: number): number {
		switch (index) {
			case 0: return $services.length;
			case 1: return $operations.length;
			case 2: return $types.length;
			case 3: return $messages.length;
			default: return 0;
		}
	}

	function handlePopState(event: PopStateEvent) {
		restoreNavigationState(event.state);
	}

	onMount(() => {
		const restored = wsdlStore.restoreFromLocalStorage();
		if (!restored) {
			showModal = true;
		}

		window.addEventListener('popstate', handlePopState);

		const parsed = parseHash(window.location.hash);
		if (parsed) {
			activeTab.set(parsed.tabIndex);
			if (parsed.elementId) {
				scrollToElement(parsed.elementId, false);
			}
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('popstate', handlePopState);
		}
	});

	function handleLoadNew() {
		showModal = true;
	}

	function handleClear() {
		wsdlStore.clear();
		showModal = true;
	}

	function switchTab(index: number) {
		activeTab.set(index);
		updateTabHash(index);
	}
</script>

<div class="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
	<!-- App Header -->
	<header class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
		<div class="flex items-center justify-between px-4 py-2">
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
		</div>

		<!-- Tab Bar -->
		{#if $hasDocument}
			<nav class="flex border-t border-gray-100 px-4 dark:border-gray-700">
				{#each tabs as tab, i}
					<button
						type="button"
						class="flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors
							{$activeTab === i
								? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300'}"
						onclick={() => switchTab(i)}
					>
						<span class="text-xs">{tab.icon}</span>
						{tab.label}
						<span class="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
							{tabCount(i)}
						</span>
					</button>
				{/each}
			</nav>
		{/if}
	</header>

	{#if $hasDocument}
		<!-- App Body: Sidebar + Content -->
		<div class="flex min-h-0 flex-1">
			<!-- Sidebar -->
			<WsdlSidebar />

			<!-- Main Content -->
			<main class="min-h-0 flex-1 overflow-auto p-4">
				<WsdlViewer />
			</main>
		</div>
	{:else}
		<main class="flex min-h-0 flex-1 items-center justify-center">
			<div class="text-center text-gray-400 dark:text-gray-500">
				<p class="text-lg">Load a WSDL document to begin analysis.</p>
				<p class="mt-2 text-sm">Use the "Load WSDL" button above to get started.</p>
			</div>
		</main>
	{/if}

	<!-- Load WSDL Modal -->
	<FileUpload bind:open={showModal} />
</div>
