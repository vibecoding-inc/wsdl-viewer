<script lang="ts">
	import {
		hasDocument,
		activeTab
	} from '$lib/stores/wsdl-store';
	import ServicesTab from './tabs/ServicesTab.svelte';
	import OperationsTab from './tabs/OperationsTab.svelte';
	import TypesTab from './tabs/TypesTab.svelte';
	import MessagesTab from './tabs/MessagesTab.svelte';
</script>

{#if $hasDocument}
	{#if $activeTab === 0}
		<ServicesTab />
	{:else if $activeTab === 1}
		<OperationsTab />
	{:else if $activeTab === 2}
		<TypesTab />
	{:else if $activeTab === 3}
		<MessagesTab />
	{/if}
{/if}
