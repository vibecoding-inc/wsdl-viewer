<script lang="ts">
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

<div class="space-y-5">
	{#if $hasDocument && $messages.length > 0}
		{#each $messages as message (message.name)}
			{@const msgRefList = $messageReverseRefs.get(message.name) || []}
			<div
				id="message-{message.name}"
				class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<!-- Message Header -->
				<div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{message.name}
					</h3>
					{#if message.documentation}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{message.documentation}
						</p>
					{/if}
				</div>

				<div class="px-5 py-4 space-y-4">
					<!-- Parts -->
					{#if message.parts.length > 0}
						<div>
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Parts
							</h4>
							<div class="overflow-x-auto rounded-md border border-gray-100 dark:border-gray-700">
								<table class="w-full text-sm">
									<thead>
										<tr class="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30">
											<th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
											<th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type / Element</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-50 dark:divide-gray-700">
										{#each message.parts as part (part.name)}
											<tr class="hover:bg-gray-50 dark:hover:bg-gray-900/20">
												<td class="px-3 py-2">
													<code class="text-xs font-medium text-gray-900 dark:text-gray-100">{part.name}</code>
												</td>
												<td class="px-3 py-2">
													{#if part.element}
														{@const elementName = stripPrefix(part.element)}
														<div class="flex items-center gap-2">
															{#if isKnownType(elementName)}
																<button
																	type="button"
																	class="text-xs text-blue-600 hover:underline dark:text-blue-400"
																	onclick={() => goToType(elementName)}
																>{part.element} →</button>
															{:else}
																<code class="text-xs text-gray-600 dark:text-gray-400">{part.element}</code>
															{/if}
															<span class="inline-flex items-center rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 ring-1 ring-purple-600/20 ring-inset dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-500/30">
																element
															</span>
														</div>
													{:else if part.type}
														{@const typeName = stripPrefix(part.type)}
														{#if isKnownType(typeName)}
															<button
																type="button"
																class="text-xs text-blue-600 hover:underline dark:text-blue-400"
																onclick={() => goToType(typeName)}
															>{part.type} →</button>
														{:else}
															<code class="text-xs text-gray-600 dark:text-gray-400">{part.type}</code>
														{/if}
													{:else}
														<code class="text-xs text-gray-400 dark:text-gray-500">any</code>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{:else}
						<p class="text-sm text-gray-400 dark:text-gray-500">No parts defined</p>
					{/if}

					<!-- Referenced By -->
					{#if msgRefList.length > 0}
						<div class="border-t border-gray-100 pt-4 dark:border-gray-700">
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Referenced By
							</h4>
							<div class="flex flex-wrap gap-1.5">
								{#each msgRefList as ref (ref.operationName + '-' + ref.role)}
									<button
										type="button"
										class="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
										onclick={() => goToOperation(ref.operationName)}
										title={ref.role}
									>
										<span class="opacity-60">⚡</span>
										{ref.operationName}
										<span class="opacity-50">({ref.role})</span>
										<span class="opacity-40">→</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
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
