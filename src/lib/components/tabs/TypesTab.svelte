<script lang="ts">
	import { Card, Badge } from 'flowbite-svelte';
	import {
		types,
		hasDocument,
		typeReverseRefs
	} from '$lib/stores/wsdl-store';
	import { navigateTo } from '$lib/stores/wsdl-store';
	import { formatFieldPrefix, formatFieldSuffix, getTypeKindColor, stripPrefix } from '$lib/utils';

	function goToType(typeName: string) {
		navigateTo(2, `type-${typeName}`);
	}

	function goToMessage(messageName: string) {
		navigateTo(3, `message-${messageName}`);
	}

	function goToOperation(operationName: string) {
		navigateTo(1, `operation-${operationName}`);
	}

	function isKnownType(typeName: string): boolean {
		return $types.some((t) => t.name === typeName);
	}
</script>

<div class="space-y-4">
	{#if $hasDocument && $types.length > 0}
		{#each $types as type (type.name + '-' + type.kind)}
			{@const typeRefList = $typeReverseRefs.get(type.name) || []}
			<Card size="xl" class="p-5">
				<div id="type-{type.name}">
					<div class="mb-2 flex items-center gap-2">
						<h6 class="text-lg font-bold text-gray-900 dark:text-white">
							{type.name}
						</h6>
						<Badge color={getTypeKindColor(type.kind)}>{type.kind}</Badge>
					</div>
					{#if type.documentation}
						<p class="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
							{type.documentation}
						</p>
					{/if}
					{#if type.base}
						{@const baseName = stripPrefix(type.base)}
						<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
							Extends:
							{#if isKnownType(baseName)}
								<button
									type="button"
									class="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
									onclick={() => goToType(baseName)}
									><code class="text-xs">{type.base}</code> →</button
								>
							{:else}
								<code class="text-xs">{type.base}</code>
							{/if}
						</p>
					{/if}
					{#if type.restrictions?.enumeration}
						<div class="mb-2">
							<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
								Allowed values:
							</p>
							<div class="mt-1 flex flex-wrap gap-1">
								{#each type.restrictions.enumeration as value (value)}
									<Badge color="yellow">{value}</Badge>
								{/each}
							</div>
						</div>
					{/if}
					{#if type.fields.length > 0}
						<ul
							class="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400"
						>
							{#each type.fields as field (field.name)}
								{@const fieldTypeName = stripPrefix(field.type)}
								<li>
									<code class="text-xs">{formatFieldPrefix(field)}: </code>
									{#if isKnownType(fieldTypeName)}
										<button
											type="button"
											class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400"
											onclick={() => goToType(fieldTypeName)}
											>{field.type} →</button
										>
									{:else}
										<code class="text-xs">{field.type}</code>
									{/if}
									<code class="text-xs">{formatFieldSuffix(field)}</code>
								</li>
							{/each}
						</ul>
					{/if}
					{#if typeRefList.length > 0}
						<div
							class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600"
						>
							<p class="text-xs font-medium text-gray-500 dark:text-gray-400">
								Referenced by:
							</p>
							<div class="mt-1 flex flex-wrap gap-1">
								{#each typeRefList as ref (`${ref.kind}-${ref.name}-${ref.detail}`)}
									{#if ref.kind === 'operation'}
										<button
											type="button"
											class="cursor-pointer rounded border px-2 py-0.5 text-xs font-medium {ref.indirect
												? 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950'
												: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'}"
											onclick={() => goToOperation(ref.name)}
											title="{ref.detail}{ref.indirect
												? ' (indirect)'
												: ''}"
										>
											⚡ {ref.name} ({ref.detail}) →
										</button>
									{:else if ref.kind === 'message'}
										<button
											type="button"
											class="cursor-pointer rounded border px-2 py-0.5 text-xs font-medium {ref.indirect
												? 'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950'
												: 'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800'}"
											onclick={() => goToMessage(ref.name)}
											title="{ref.detail}{ref.indirect
												? ' (indirect)'
												: ''}"
										>
											✉ {ref.name} ({ref.detail}) →
										</button>
									{:else if ref.kind === 'type'}
										<button
											type="button"
											class="cursor-pointer rounded border px-2 py-0.5 text-xs font-medium {ref.indirect
												? 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950'
												: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'}"
											onclick={() => goToType(ref.name)}
											title="{ref.detail}{ref.indirect
												? ' (indirect)'
												: ''}"
										>
											🔷 {ref.name} ({ref.detail}) →
										</button>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</Card>
		{/each}
	{:else if $hasDocument}
		<p class="text-gray-500 dark:text-gray-400">
			No types defined in this WSDL document.
		</p>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">
			Type definitions will appear here once a WSDL is loaded.
		</p>
	{/if}
</div>
