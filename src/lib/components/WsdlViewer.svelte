<script lang="ts">
	import { Card, Tabs, TabItem, Badge, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { 
		hasDocument, 
		services, 
		operations, 
		types, 
		messages,
		targetNamespace 
	} from '$lib/stores/wsdl-store';
	import type { WsdlTypeField } from '$lib/wsdl-parser';

	// Helper to format field info
	function formatField(field: WsdlTypeField): string {
		let result = `${field.name}: ${field.type}`;
		if (field.isAttribute) {
			result = `@${result}`;
		}
		if (field.isOptional) {
			result += ' (optional)';
		}
		if (field.maxOccurs === 'unbounded' || Number(field.maxOccurs) > 1) {
			result += '[]';
		}
		return result;
	}
	
	// Helper to get badge color based on type kind
	function getTypeKindColor(kind: string): 'blue' | 'green' | 'purple' {
		switch (kind) {
			case 'complexType': return 'blue';
			case 'simpleType': return 'green';
			case 'element': return 'purple';
			default: return 'blue';
		}
	}
</script>

<div class="w-full">
	{#if !$hasDocument}
		<Alert color="blue" class="mb-4">
			<InfoCircleSolid slot="icon" class="h-5 w-5" />
			<span class="font-medium">No WSDL loaded</span>
			Please upload a WSDL file or paste WSDL content to view details.
		</Alert>
	{/if}

	<Card class="max-w-full">
		<div class="mb-4 flex items-center justify-between">
			<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				WSDL Document Viewer
			</h5>
			{#if $hasDocument && $targetNamespace}
				<code class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
					{$targetNamespace}
				</code>
			{/if}
		</div>

		<Tabs>
			<TabItem open title="Services ({$services.length})">
				<div class="space-y-4">
					{#if $hasDocument && $services.length > 0}
						{#each $services as service}
							<Card>
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
										{#each service.ports as port}
											<div class="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
												<div class="flex items-center gap-2">
													<span class="font-medium text-gray-900 dark:text-white">{port.name}</span>
													<Badge color="blue">{port.protocol}</Badge>
												</div>
												{#if port.address}
													<p class="mt-1 text-sm text-gray-700 dark:text-gray-400">
														Endpoint: <code class="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-700">{port.address}</code>
													</p>
												{/if}
												<p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
													Binding: <code class="text-xs">{port.binding}</code>
												</p>
											</div>
										{/each}
									</div>
								{/if}
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
			</TabItem>

			<TabItem title="Operations ({$operations.length})">
				<div class="space-y-4">
					{#if $hasDocument && $operations.length > 0}
						{#each $operations as operation}
							<Card>
								<div class="flex items-center gap-2">
									<h6 class="text-lg font-bold text-gray-900 dark:text-white">{operation.operationName}</h6>
									<Badge color="green">SOAP</Badge>
								</div>
								{#if operation.documentation}
									<p class="mt-1 text-sm italic text-gray-600 dark:text-gray-400">
										{operation.documentation}
									</p>
								{/if}
								<div class="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-400">
									<p>Service: <code class="text-xs">{operation.serviceName}</code></p>
									<p>Port: <code class="text-xs">{operation.portName}</code></p>
									{#if operation.soapAction}
										<p>SOAP Action: <code class="text-xs">{operation.soapAction}</code></p>
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
			</TabItem>

			<TabItem title="Types ({$types.length})">
				<div class="space-y-4">
					{#if $hasDocument && $types.length > 0}
						{#each $types as type}
							<Card>
								<div class="mb-2 flex items-center gap-2">
									<h6 class="text-lg font-bold text-gray-900 dark:text-white">{type.name}</h6>
									<Badge color={getTypeKindColor(type.kind)}>{type.kind}</Badge>
								</div>
								{#if type.documentation}
									<p class="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
										{type.documentation}
									</p>
								{/if}
								{#if type.base}
									<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
										Extends: <code class="text-xs">{type.base}</code>
									</p>
								{/if}
								{#if type.restrictions?.enumeration}
									<div class="mb-2">
										<p class="text-sm font-medium text-gray-700 dark:text-gray-300">Allowed values:</p>
										<div class="mt-1 flex flex-wrap gap-1">
											{#each type.restrictions.enumeration as value}
												<Badge color="yellow">{value}</Badge>
											{/each}
										</div>
									</div>
								{/if}
								{#if type.fields.length > 0}
									<ul class="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400">
										{#each type.fields as field}
											<li><code class="text-xs">{formatField(field)}</code></li>
										{/each}
									</ul>
								{/if}
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
			</TabItem>

			<TabItem title="Messages ({$messages.length})">
				<div class="space-y-4">
					{#if $hasDocument && $messages.length > 0}
						{#each $messages as message}
							<Card>
								<h6 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">{message.name}</h6>
								{#if message.documentation}
									<p class="mb-2 text-sm italic text-gray-600 dark:text-gray-400">
										{message.documentation}
									</p>
								{/if}
								{#if message.parts.length > 0}
									<ul class="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400">
										{#each message.parts as part}
											<li>
												<code class="text-xs">
													{part.name}: {part.type || part.element || 'any'}
													{#if part.element}
														<Badge color="purple" class="ml-1">element</Badge>
													{/if}
												</code>
											</li>
										{/each}
									</ul>
								{:else}
									<p class="text-sm text-gray-500">No parts defined</p>
								{/if}
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
			</TabItem>
		</Tabs>
	</Card>
</div>
