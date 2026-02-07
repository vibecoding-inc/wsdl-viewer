<script lang="ts">
	import { Card, Badge } from 'flowbite-svelte';
	import {
		messages,
		types,
		hasDocument,
		messageReverseRefs
	} from '$lib/stores/wsdl-store';
	import { navigateTo } from '$lib/stores/wsdl-store';
	import { stripPrefix } from '$lib/utils';

	function goToType(typeName: string) {
		navigateTo(2, `type-${typeName}`);
	}

	function goToOperation(operationName: string) {
		navigateTo(1, `operation-${operationName}`);
	}

	function isKnownType(typeName: string): boolean {
		return $types.some((t) => t.name === typeName);
	}
</script>

<div class="space-y-4">
	{#if $hasDocument && $messages.length > 0}
		{#each $messages as message (message.name)}
			{@const msgRefList = $messageReverseRefs.get(message.name) || []}
			<Card size="xl" class="p-5">
				<div id="message-{message.name}">
					<h6 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
						{message.name}
					</h6>
					{#if message.documentation}
						<p class="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
							{message.documentation}
						</p>
					{/if}
					{#if message.parts.length > 0}
						<ul
							class="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400"
						>
							{#each message.parts as part (part.name)}
								<li>
									<code class="text-xs">
										{part.name}:
									</code>
									{#if part.element}
										{@const elementName = stripPrefix(part.element)}
										{#if isKnownType(elementName)}
											<button
												type="button"
												class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400"
												onclick={() => goToType(elementName)}
												>{part.element} →</button
											>
										{:else}
											<code class="text-xs">{part.element}</code>
										{/if}
										<Badge color="purple" class="ml-1">element</Badge>
									{:else if part.type}
										{@const typeName = stripPrefix(part.type)}
										{#if isKnownType(typeName)}
											<button
												type="button"
												class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400"
												onclick={() => goToType(typeName)}
												>{part.type} →</button
											>
										{:else}
											<code class="text-xs">{part.type}</code>
										{/if}
									{:else}
										<code class="text-xs">any</code>
									{/if}
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-sm text-gray-500">No parts defined</p>
					{/if}
					{#if msgRefList.length > 0}
						<div
							class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600"
						>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400">
								Referenced by:
							</p>
							<div class="mt-1 flex flex-wrap gap-1">
								{#each msgRefList as ref (ref.operationName + '-' + ref.role)}
									<button
										type="button"
										class="cursor-pointer rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
										onclick={() => goToOperation(ref.operationName)}
										title={ref.role}
									>
										⚡ {ref.operationName} ({ref.role}) →
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</Card>
		{/each}
	{:else if $hasDocument}
		<p class="text-gray-500 dark:text-gray-400">
			No messages defined in this WSDL document.
		</p>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">
			Message definitions will appear here once a WSDL is loaded.
		</p>
	{/if}
</div>
