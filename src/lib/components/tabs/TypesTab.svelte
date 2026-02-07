<script lang="ts">
	import {
		types,
		hasDocument,
		typeReverseRefs
	} from '$lib/stores/wsdl-store';
	import { navigateTo } from '$lib/stores/wsdl-store';
	import { formatFieldPrefix, formatFieldSuffix, stripPrefix } from '$lib/utils';

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

	function getKindBadgeClasses(kind: string): string {
		switch (kind) {
			case 'complexType':
				return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30';
			case 'simpleType':
				return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500/30';
			case 'element':
				return 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-500/30';
			default:
				return 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-300 dark:ring-gray-500/30';
		}
	}

	function getRefBadgeClasses(kind: string, indirect: boolean): string {
		if (kind === 'operation') {
			return indirect
				? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
				: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50';
		}
		if (kind === 'message') {
			return indirect
				? 'border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/30'
				: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50';
		}
		// type
		return indirect
			? 'border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30'
			: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50';
	}
</script>

<div class="space-y-5">
	{#if $hasDocument && $types.length > 0}
		{#each $types as type (type.name + '-' + type.kind)}
			{@const typeRefList = $typeReverseRefs.get(type.name) || []}
			<div
				id="type-{type.name}"
				class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<!-- Type Header -->
				<div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
					<div class="flex items-center gap-2.5">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
							{type.name}
						</h3>
						<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset {getKindBadgeClasses(type.kind)}">
							{type.kind}
						</span>
					</div>
					{#if type.documentation}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{type.documentation}
						</p>
					{/if}
					{#if type.base}
						{@const baseName = stripPrefix(type.base)}
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Extends
							{#if isKnownType(baseName)}
								<button
									type="button"
									class="text-blue-600 hover:underline dark:text-blue-400"
									onclick={() => goToType(baseName)}
								>
									<code class="text-xs">{type.base}</code> →
								</button>
							{:else}
								<code class="text-xs">{type.base}</code>
							{/if}
						</p>
					{/if}
				</div>

				<div class="px-5 py-4 space-y-4">
					<!-- Restrictions / Enumeration -->
					{#if type.restrictions?.enumeration}
						<div>
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Allowed Values
							</h4>
							<div class="flex flex-wrap gap-1.5">
								{#each type.restrictions.enumeration as value (value)}
									<span class="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-500/30">
										{value}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Fields -->
					{#if type.fields.length > 0}
						<div>
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Fields
							</h4>
							<div class="overflow-x-auto rounded-md border border-gray-100 dark:border-gray-700">
								<table class="w-full text-sm">
									<thead>
										<tr class="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30">
											<th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
											<th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
											<th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Constraints</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-50 dark:divide-gray-700">
										{#each type.fields as field (field.name)}
											{@const fieldTypeName = stripPrefix(field.type)}
											<tr class="hover:bg-gray-50 dark:hover:bg-gray-900/20">
												<td class="px-3 py-2">
													<code class="text-xs font-medium text-gray-900 dark:text-gray-100">{formatFieldPrefix(field)}</code>
												</td>
												<td class="px-3 py-2">
													{#if isKnownType(fieldTypeName)}
														<button
															type="button"
															class="text-xs text-blue-600 hover:underline dark:text-blue-400"
															onclick={() => goToType(fieldTypeName)}
														>
															{field.type} →
														</button>
													{:else}
														<code class="text-xs text-gray-600 dark:text-gray-400">{field.type}</code>
													{/if}
												</td>
												<td class="px-3 py-2">
													{#if formatFieldSuffix(field)}
														<span class="text-xs text-gray-400 dark:text-gray-500">{formatFieldSuffix(field).trim()}</span>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}

					<!-- Referenced By -->
					{#if typeRefList.length > 0}
						<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Referenced By
							</h4>
							<div class="flex flex-wrap gap-1.5">
								{#each typeRefList as ref (`${ref.kind}-${ref.name}-${ref.detail}`)}
									{#if ref.kind === 'operation'}
										<button
											type="button"
											class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors {getRefBadgeClasses(ref.kind, ref.indirect ?? false)}"
											onclick={() => goToOperation(ref.name)}
											title="{ref.detail}{ref.indirect ? ' (indirect)' : ''}"
										>
											<span class="opacity-60">⚡</span>
											{ref.name}
											<span class="opacity-50">({ref.detail})</span>
											<span class="opacity-40">→</span>
										</button>
									{:else if ref.kind === 'message'}
										<button
											type="button"
											class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors {getRefBadgeClasses(ref.kind, ref.indirect ?? false)}"
											onclick={() => goToMessage(ref.name)}
											title="{ref.detail}{ref.indirect ? ' (indirect)' : ''}"
										>
											<span class="opacity-60">✉</span>
											{ref.name}
											<span class="opacity-50">({ref.detail})</span>
											<span class="opacity-40">→</span>
										</button>
									{:else if ref.kind === 'type'}
										<button
											type="button"
											class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors {getRefBadgeClasses(ref.kind, ref.indirect ?? false)}"
											onclick={() => goToType(ref.name)}
											title="{ref.detail}{ref.indirect ? ' (indirect)' : ''}"
										>
											<span class="opacity-60">🔷</span>
											{ref.name}
											<span class="opacity-50">({ref.detail})</span>
											<span class="opacity-40">→</span>
										</button>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
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
