<script lang="ts">
	import { Card, Tabs, TabItem, Badge, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { 
		hasDocument, 
		services, 
		operations, 
		types, 
		messages,
		activeTab,
		navigateTo
	} from '$lib/stores/wsdl-store';
	import type { WsdlTypeField } from '$lib/wsdl-parser';

	// Helper to format field name with modifiers (without type)
	function formatFieldPrefix(field: WsdlTypeField): string {
		let result = field.name;
		if (field.isAttribute) {
			result = `@${result}`;
		}
		return result;
	}

	// Helper to format field suffix (optional, array)
	function formatFieldSuffix(field: WsdlTypeField): string {
		let result = '';
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

	// Check if a type name refers to a known type in the document
	function isKnownType(typeName: string): boolean {
		return $types.some(t => t.name === typeName);
	}

	// Check if a message name refers to a known message
	function isKnownMessage(messageName: string): boolean {
		return $messages.some(m => m.name === messageName);
	}

	// Get operations belonging to a service
	function getServiceOperations(serviceName: string) {
		return $operations.filter(op => op.serviceName === serviceName);
	}

	// Navigate to a type definition
	function goToType(typeName: string) {
		navigateTo(2, `type-${typeName}`);
	}

	// Navigate to a message definition
	function goToMessage(messageName: string) {
		navigateTo(3, `message-${messageName}`);
	}

	// Navigate to an operation
	function goToOperation(operationName: string) {
		navigateTo(1, `operation-${operationName}`);
	}

	// Navigate to a service
	function goToService(serviceName: string) {
		navigateTo(0, `service-${serviceName}`);
	}

	// Strip namespace prefix from a type name
	function stripPrefix(name: string): string {
		const idx = name.indexOf(':');
		return idx >= 0 ? name.substring(idx + 1) : name;
	}
</script>

<div class="w-full">
	{#if !$hasDocument}
		<Alert color="blue" class="mb-4">
			<InfoCircleSolid slot="icon" class="h-5 w-5" />
			<span class="font-medium">No WSDL loaded</span>
			Click "Load WSDL" to get started.
		</Alert>
	{/if}

	<Card size="xl" class="w-full">
		<Tabs>
			<TabItem open={$activeTab === 0} onclick={() => activeTab.set(0)} title="Services ({$services.length})">
				<div class="space-y-4">
					{#if $hasDocument && $services.length > 0}
						{#each $services as service}
							{@const serviceOps = getServiceOperations(service.name)}
							<Card size="xl">
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

								{#if serviceOps.length > 0}
									<div class="mt-3">
										<p class="text-sm font-medium text-gray-700 dark:text-gray-300">Operations:</p>
										<div class="mt-1 flex flex-wrap gap-1">
											{#each serviceOps as op}
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
			</TabItem>

			<TabItem open={$activeTab === 1} onclick={() => activeTab.set(1)} title="Operations ({$operations.length})">
				<div class="space-y-4">
					{#if $hasDocument && $operations.length > 0}
						{#each $operations as operation}
							<Card size="xl">
								<div id="operation-{operation.operationName}">
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
									<p>Service: <button type="button" class="cursor-pointer text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToService(operation.serviceName)}><code class="text-xs">{operation.serviceName}</code></button></p>
									<p>Port: <code class="text-xs">{operation.portName}</code></p>
									{#if operation.soapAction}
										<p>SOAP Action: <code class="text-xs">{operation.soapAction}</code></p>
									{/if}
								</div>
								{#if operation.input || operation.output}
									<div class="mt-3 space-y-2">
										{#if operation.input}
											<div class="rounded border border-gray-200 p-2 dark:border-gray-600">
												<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Input:</span>
												{#if isKnownMessage(operation.input.message)}
													<button type="button" class="ml-1 cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToMessage(operation.input.message)}>{operation.input.message} →</button>
												{:else}
													<code class="ml-1 text-xs">{operation.input.message}</code>
												{/if}
											</div>
										{/if}
										{#if operation.output}
											<div class="rounded border border-gray-200 p-2 dark:border-gray-600">
												<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Output:</span>
												{#if isKnownMessage(operation.output.message)}
													<button type="button" class="ml-1 cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToMessage(operation.output.message)}>{operation.output.message} →</button>
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
			</TabItem>

			<TabItem open={$activeTab === 2} onclick={() => activeTab.set(2)} title="Types ({$types.length})">
				<div class="space-y-4">
					{#if $hasDocument && $types.length > 0}
						{#each $types as type}
							<Card size="xl">
								<div id="type-{type.name}">
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
										Extends: {#if isKnownType(stripPrefix(type.base))}<button type="button" class="cursor-pointer text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToType(stripPrefix(type.base))}><code class="text-xs">{type.base}</code> →</button>{:else}<code class="text-xs">{type.base}</code>{/if}
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
											<li>
												<code class="text-xs">{formatFieldPrefix(field)}: </code>{#if isKnownType(stripPrefix(field.type))}<button type="button" class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToType(stripPrefix(field.type))}>{field.type} →</button>{:else}<code class="text-xs">{field.type}</code>{/if}<code class="text-xs">{formatFieldSuffix(field)}</code>
											</li>
										{/each}
									</ul>
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
			</TabItem>

			<TabItem open={$activeTab === 3} onclick={() => activeTab.set(3)} title="Messages ({$messages.length})">
				<div class="space-y-4">
					{#if $hasDocument && $messages.length > 0}
						{#each $messages as message}
							<Card size="xl">
								<div id="message-{message.name}">
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
													{part.name}: 
												</code>
												{#if part.element}
													{#if isKnownType(stripPrefix(part.element))}
														<button type="button" class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToType(stripPrefix(part.element))}>{part.element} →</button>
													{:else}
														<code class="text-xs">{part.element}</code>
													{/if}
													<Badge color="purple" class="ml-1">element</Badge>
												{:else if part.type}
													{#if isKnownType(stripPrefix(part.type))}
														<button type="button" class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-blue-400" onclick={() => goToType(stripPrefix(part.type))}>{part.type} →</button>
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
			</TabItem>
		</Tabs>
	</Card>
</div>
