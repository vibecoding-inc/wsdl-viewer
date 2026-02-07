<script lang="ts">
	import { Card, Badge } from 'flowbite-svelte';
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

<div class="space-y-4">
	{#if $hasDocument && $operations.length > 0}
		{#each $operations as operation (operation.operationName)}
			<Card size="xl" class="p-5">
				<div id="operation-{operation.operationName}">
					<div class="flex items-center gap-2">
						<h6 class="text-lg font-bold text-gray-900 dark:text-white">
							{operation.operationName}
						</h6>
						<Badge color="green">SOAP</Badge>
					</div>
					{#if operation.documentation}
						<p class="mt-1 text-sm italic text-gray-600 dark:text-gray-400">
							{operation.documentation}
						</p>
					{/if}
					<div class="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-400">
						<p>
							Service: <button
								type="button"
								class="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
								onclick={() => goToService(operation.serviceName)}
								><code class="text-xs">{operation.serviceName}</code></button
							>
						</p>
						<p>Port: <code class="text-xs">{operation.portName}</code></p>
						{#if operation.soapAction}
							<p>
								SOAP Action: <code class="text-xs">{operation.soapAction}</code>
							</p>
						{/if}
					</div>
					{#if operation.input || operation.output}
						<div class="mt-3 space-y-2">
							{#if operation.input}
								<div
									class="rounded border border-gray-200 p-2 dark:border-gray-600"
								>
									<span
										class="text-xs font-medium text-gray-500 dark:text-gray-400"
										>Input:</span
									>
									{#if isKnownMessage(operation.input.message)}
										<button
											type="button"
											class="ml-1 cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400"
											onclick={() => {
												goToMessage(operation.input!.message);
											}}>{operation.input.message} →</button
										>
									{:else}
										<code class="ml-1 text-xs">{operation.input.message}</code>
									{/if}
								</div>
							{/if}
							{#if operation.output}
								<div
									class="rounded border border-gray-200 p-2 dark:border-gray-600"
								>
									<span
										class="text-xs font-medium text-gray-500 dark:text-gray-400"
										>Output:</span
									>
									{#if isKnownMessage(operation.output.message)}
										<button
											type="button"
											class="ml-1 cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400"
											onclick={() => {
												goToMessage(operation.output!.message);
											}}>{operation.output.message} →</button
										>
									{:else}
										<code class="ml-1 text-xs">{operation.output.message}</code>
									{/if}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</Card>
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
