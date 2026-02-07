<script lang="ts">
	import {
		services,
		operations,
		types,
		messages,
		activeTab
	} from '$lib/stores/wsdl-store';
	import { scrollToElement } from '$lib/stores/wsdl-store';
</script>

<aside class="w-56 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
	<div class="p-3">
		{#if $activeTab === 0}
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Services</h3>
			{#if $services.length === 0}
				<p class="text-xs text-gray-400 dark:text-gray-500">No services</p>
			{:else}
				<ul class="space-y-0.5">
					{#each $services as service (service.name)}
						<li>
							<button
								type="button"
								class="w-full truncate rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => scrollToElement(`service-${service.name}`)}
								title={service.name}
							>
								{service.name}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		{:else if $activeTab === 1}
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Operations</h3>
			{#if $operations.length === 0}
				<p class="text-xs text-gray-400 dark:text-gray-500">No operations</p>
			{:else}
				<ul class="space-y-0.5">
					{#each $operations as op (op.operationName)}
						<li>
							<button
								type="button"
								class="w-full truncate rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => scrollToElement(`operation-${op.operationName}`)}
								title={op.operationName}
							>
								{op.operationName}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		{:else if $activeTab === 2}
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Types</h3>
			{#if $types.length === 0}
				<p class="text-xs text-gray-400 dark:text-gray-500">No types</p>
			{:else}
				<ul class="space-y-0.5">
					{#each $types as type (type.name + '-' + type.kind)}
						<li>
							<button
								type="button"
								class="w-full truncate rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => scrollToElement(`type-${type.name}`)}
								title={type.name}
							>
								{type.name}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		{:else if $activeTab === 3}
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Messages</h3>
			{#if $messages.length === 0}
				<p class="text-xs text-gray-400 dark:text-gray-500">No messages</p>
			{:else}
				<ul class="space-y-0.5">
					{#each $messages as message (message.name)}
						<li>
							<button
								type="button"
								class="w-full truncate rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
								onclick={() => scrollToElement(`message-${message.name}`)}
								title={message.name}
							>
								{message.name}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</div>
</aside>
