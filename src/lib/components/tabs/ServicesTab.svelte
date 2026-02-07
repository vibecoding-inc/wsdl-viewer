<script lang="ts">
	import { Card, Badge } from 'flowbite-svelte';
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

<div class="space-y-4">
	{#if $hasDocument && $services.length > 0}
		{#each $services as service (service.name)}
			{@const serviceOps = getServiceOperations(service.name)}
			<Card size="xl" class="p-5">
				<div id="service-{service.name}">
					<h6 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
						{service.name}
					</h6>
					{#if service.documentation}
						<p class="mb-3 text-sm italic text-gray-600 dark:text-gray-400">
							{service.documentation}
						</p>
					{/if}

					{#if service.ports.length > 0}
						<div class="space-y-3">
							{#each service.ports as port (port.name)}
								<div class="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
									<div class="flex items-center gap-2">
										<span class="font-medium text-gray-900 dark:text-white"
											>{port.name}</span
										>
										<Badge color="blue">{port.protocol}</Badge>
									</div>
									{#if port.address}
										<p class="mt-1 text-sm text-gray-700 dark:text-gray-400">
											Endpoint: <code
												class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-700"
												>{port.address}</code
											>
										</p>
									{/if}
									<p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
										Binding: <code class="text-xs">{port.binding}</code>
									</p>
								</div>
							{/each}
						</div>
					{/if}

					{#if serviceOps.length > 0}
						<div class="mt-3">
							<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
								Operations:
							</p>
							<div class="mt-1 flex flex-wrap gap-1">
								{#each serviceOps as op (op.operationName)}
									<button
										type="button"
										class="cursor-pointer rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
										onclick={() => goToOperation(op.operationName)}
									>
										{op.operationName} →
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
			No services defined in this WSDL document.
		</p>
	{:else}
		<p class="text-gray-500 dark:text-gray-400">
			Service information will appear here once a WSDL is loaded.
		</p>
	{/if}
</div>
