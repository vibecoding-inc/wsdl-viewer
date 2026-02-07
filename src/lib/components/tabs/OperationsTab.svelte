<script lang="ts">
	import {
		operations,
		messages,
		hasDocument
	} from '$lib/stores/wsdl-store';
	import { navigateTo } from '$lib/stores/wsdl-store';

	function goToMessage(messageName: string) {
		navigateTo(3, `message-${messageName}`);
	}

	function goToService(serviceName: string) {
		navigateTo(0, `service-${serviceName}`);
	}

	function isKnownMessage(messageName: string): boolean {
		return $messages.some((m) => m.name === messageName);
	}
</script>

<div class="space-y-5">
	{#if $hasDocument && $operations.length > 0}
		{#each $operations as operation (operation.operationName)}
			<div
				id="operation-{operation.operationName}"
				class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<!-- Operation Header -->
				<div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
					<div class="flex items-center gap-2.5">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
							{operation.operationName}
						</h3>
						<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30">
							SOAP
						</span>
					</div>
					{#if operation.documentation}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{operation.documentation}
						</p>
					{/if}
				</div>

				<div class="px-5 py-4 space-y-4">
					<!-- Metadata -->
					<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
						<dt class="text-gray-400 dark:text-gray-500">Service</dt>
						<dd>
							<button
								type="button"
								class="text-blue-600 hover:underline dark:text-blue-400"
								onclick={() => goToService(operation.serviceName)}
							>
								<code class="text-xs">{operation.serviceName}</code>
							</button>
						</dd>
						<dt class="text-gray-400 dark:text-gray-500">Port</dt>
						<dd>
							<code class="text-xs text-gray-600 dark:text-gray-400">{operation.portName}</code>
						</dd>
						{#if operation.soapAction}
							<dt class="text-gray-400 dark:text-gray-500">SOAP Action</dt>
							<dd>
								<code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
									{operation.soapAction}
								</code>
							</dd>
						{/if}
					</dl>

					<!-- Input / Output Messages -->
					{#if operation.input || operation.output}
						<div>
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Messages
							</h4>
							<div class="space-y-2">
								{#if operation.input}
									<div class="flex items-start gap-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-900/30">
										<span class="mt-0.5 inline-flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
											IN
										</span>
										<div class="min-w-0 flex-1">
											{#if isKnownMessage(operation.input.message)}
												<button
													type="button"
													class="font-medium text-blue-600 hover:underline dark:text-blue-400 text-sm"
													onclick={() => {
														goToMessage(operation.input!.message);
													}}
												>
													{operation.input.message}
													<span class="text-blue-400 dark:text-blue-500">→</span>
												</button>
											{:else}
												<code class="text-sm text-gray-700 dark:text-gray-300">{operation.input.message}</code>
											{/if}
										</div>
									</div>
								{/if}
								{#if operation.output}
									<div class="flex items-start gap-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-900/30">
										<span class="mt-0.5 inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/50 dark:text-green-300">
											OUT
										</span>
										<div class="min-w-0 flex-1">
											{#if isKnownMessage(operation.output.message)}
												<button
													type="button"
													class="font-medium text-blue-600 hover:underline dark:text-blue-400 text-sm"
													onclick={() => {
														goToMessage(operation.output!.message);
													}}
												>
													{operation.output.message}
													<span class="text-blue-400 dark:text-blue-500">→</span>
												</button>
											{:else}
												<code class="text-sm text-gray-700 dark:text-gray-300">{operation.output.message}</code>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{:else if $hasDocument}
		<p class="text-gray-500 dark:text-gray-400">
			No operations defined in this WSDL document.
		</p>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">
			Operations will appear here once a WSDL is loaded.
		</p>
	{/if}
</div>
