<script lang="ts">
	import { Card, Tabs, TabItem } from 'flowbite-svelte';
	import { onMount, onDestroy } from 'svelte';
	import {
		hasDocument,
		services,
		operations,
		types,
		messages,
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
		<div class="flex h-full items-center justify-center py-20 text-gray-400 dark:text-gray-500">
			<p class="text-lg">Load a WSDL document to begin analysis.</p>
		</div>
	{/if}

	{#if $hasDocument}
	<Card size="xl" class="w-full p-6">
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
	{/if}
</div>
