<script lang="ts">
	import {
		services,
		operations,
		hasDocument
	} from '$lib/stores/wsdl-store';
	import { navigateTo } from '$lib/stores/wsdl-store';

	function goToOperation(operationName: string) {
		navigateTo(1, `operation-${operationName}`);
	}

	function getServiceOperations(serviceName: string) {
		return $operations.filter((op) => op.serviceName === serviceName);
	}
</script>

<div class="space-y-5">
	{#if $hasDocument && $services.length > 0}
		{#each $services as service (service.name)}
			{@const serviceOps = getServiceOperations(service.name)}
			<div
				id="service-{service.name}"
				class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
			>
				<!-- Service Header -->
				<div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{service.name}
					</h3>
					{#if service.documentation}
						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{service.documentation}
						</p>
					{/if}
				</div>

				<div class="px-5 py-4 space-y-4">
					<!-- Ports -->
					{#if service.ports.length > 0}
						<div>
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Ports
							</h4>
							<div class="space-y-2">
								{#each service.ports as port (port.name)}
									<div class="rounded-md border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-750 dark:bg-gray-900/30">
										<div class="flex items-center gap-2">
											<span class="font-medium text-gray-900 dark:text-white">{port.name}</span>
											<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20 ring-inset dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30">
												{port.protocol}
											</span>
										</div>
										<dl class="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
											{#if port.address}
												<dt class="text-gray-400 dark:text-gray-500">Endpoint</dt>
												<dd>
													<code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
														{port.address}
													</code>
												</dd>
											{/if}
											<dt class="text-gray-400 dark:text-gray-500">Binding</dt>
											<dd>
												<code class="text-xs text-gray-600 dark:text-gray-400">{port.binding}</code>
											</dd>
										</dl>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Operations -->
					{#if serviceOps.length > 0}
						<div>
							<h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
								Operations ({serviceOps.length})
							</h4>
							<div class="flex flex-wrap gap-1.5">
								{#each serviceOps as op (op.operationName)}
									<button
										type="button"
										class="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
										onclick={() => goToOperation(op.operationName)}
									>
										{op.operationName}
										<span class="text-green-400 dark:text-green-500">→</span>
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
			No services defined in this WSDL document.
		</p>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">
			Service information will appear here once a WSDL is loaded.
		</p>
	{/if}
</div>
