<script lang="ts">
	import { Card, Tabs, TabItem, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { onMount, onDestroy } from 'svelte';
	import {
		hasDocument,
		services,
		operations,
		types,
		messages,
		targetNamespace,
		activeTab,
		restoreNavigationState,
		updateTabHash,
		parseHash,
		scrollToElement
	} from '$lib/stores/wsdl-store';
	import ServicesTab from './tabs/ServicesTab.svelte';
	import OperationsTab from './tabs/OperationsTab.svelte';
	import TypesTab from './tabs/TypesTab.svelte';
	import MessagesTab from './tabs/MessagesTab.svelte';

	function handlePopState(event: PopStateEvent) {
		restoreNavigationState(event.state);
	}

	function switchTab(tabIndex: number) {
		activeTab.set(tabIndex);
		updateTabHash(tabIndex);
	}

	onMount(() => {
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
</script>

<div class="w-full">
	{#if !$hasDocument}
		<Alert color="blue" class="mb-4">
			{#snippet icon()}
				<InfoCircleSolid class="h-5 w-5" />
			{/snippet}
			<span class="font-medium">No WSDL loaded</span>
			Please upload a WSDL file or paste WSDL content to view details.
		</Alert>
	{/if}

	<Card size="xl" class="w-full p-6">
		<div class="mb-4 flex items-center justify-between">
			<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				WSDL Document Viewer
			</h5>
			{#if $hasDocument && $targetNamespace}
				<code
					class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
				>
					{$targetNamespace}
				</code>
			{/if}
		</div>

		<Tabs>
			<TabItem
				open={$activeTab === 0}
				onclick={() => switchTab(0)}
				title="Services ({$services.length})"
			>
				<ServicesTab />
			</TabItem>

			<TabItem
				open={$activeTab === 1}
				onclick={() => switchTab(1)}
				title="Operations ({$operations.length})"
			>
				<OperationsTab />
			</TabItem>

			<TabItem
				open={$activeTab === 2}
				onclick={() => switchTab(2)}
				title="Types ({$types.length})"
			>
				<TypesTab />
			</TabItem>

			<TabItem
				open={$activeTab === 3}
				onclick={() => switchTab(3)}
				title="Messages ({$messages.length})"
			>
				<MessagesTab />
			</TabItem>
		</Tabs>
	</Card>
</div>
