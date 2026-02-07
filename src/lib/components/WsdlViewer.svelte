<script lang="ts">
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { 
		hasDocument, 
		services, 
		operations, 
		types, 
		messages,
		targetNamespace,
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
		<div class="mb-4 flex items-center gap-3 rounded-lg p-4" style="background-color: color-mix(in srgb, var(--theme-accent) 15%, var(--theme-base)); color: var(--theme-accent); border: 1px solid color-mix(in srgb, var(--theme-accent) 30%, var(--theme-base));">
			<InfoCircleSolid class="h-5 w-5 shrink-0" />
			<div>
				<span class="font-medium">No WSDL loaded</span>
				Please upload a WSDL file or paste WSDL content to view details.
			</div>
		</div>
	{/if}

	<div class="rounded-lg border p-6" style="background-color: var(--theme-surface0); border-color: var(--theme-surface1);">
		<div class="mb-4 flex items-center justify-between">
			<h5 class="text-2xl font-bold tracking-tight" style="color: var(--theme-text);">
				WSDL Document Viewer
			</h5>
			{#if $hasDocument && $targetNamespace}
				<code class="rounded px-2 py-1 text-xs" style="background-color: var(--theme-base); color: var(--theme-subtext);">
					{$targetNamespace}
				</code>
			{/if}
		</div>

		<!-- Custom tab bar -->
		<div class="mb-4 flex border-b" style="border-color: var(--theme-surface1);">
			{#each [
				{ idx: 0, label: `Services (${$services.length})` },
				{ idx: 1, label: `Operations (${$operations.length})` },
				{ idx: 2, label: `Types (${$types.length})` },
				{ idx: 3, label: `Messages (${$messages.length})` }
			] as tab}
				<button
					type="button"
					class="cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition-colors"
					style="color: {$activeTab === tab.idx ? 'var(--theme-accent)' : 'var(--theme-subtext)'}; border-color: {$activeTab === tab.idx ? 'var(--theme-accent)' : 'transparent'};"
					onclick={() => activeTab.set(tab.idx)}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Tab panels -->
		{#if $activeTab === 0}
			<div class="space-y-4">
				{#if $hasDocument && $services.length > 0}
					{#each $services as service}
						{@const serviceOps = getServiceOperations(service.name)}
						<div class="rounded-lg border p-5" style="background-color: var(--theme-base); border-color: var(--theme-surface1);">
							<div id="service-{service.name}">
							<h6 class="mb-2 text-xl font-bold" style="color: var(--theme-text);">
								{service.name}
							</h6>
							{#if service.documentation}
								<p class="mb-3 text-sm italic" style="color: var(--theme-subtext);">
									{service.documentation}
								</p>
							{/if}
							
							{#if service.ports.length > 0}
								<div class="space-y-3">
									{#each service.ports as port}
										<div class="rounded-lg border p-3" style="border-color: var(--theme-surface1);">
											<div class="flex items-center gap-2">
												<span class="font-medium" style="color: var(--theme-text);">{port.name}</span>
												<span class="rounded px-2 py-0.5 text-xs font-medium" style="background-color: color-mix(in srgb, var(--theme-accent) 20%, transparent); color: var(--theme-accent);">{port.protocol}</span>
											</div>
											{#if port.address}
												<p class="mt-1 text-sm" style="color: var(--theme-subtext);">
													Endpoint: <code class="rounded px-1 py-0.5 text-xs" style="background-color: var(--theme-surface0); color: var(--theme-subtext);">{port.address}</code>
												</p>
											{/if}
											<p class="mt-1 text-sm" style="color: var(--theme-surface2);">
												Binding: <code class="text-xs">{port.binding}</code>
											</p>
										</div>
									{/each}
								</div>
							{/if}

							{#if serviceOps.length > 0}
								<div class="mt-3">
									<p class="text-sm font-medium" style="color: var(--theme-subtext);">Operations:</p>
									<div class="mt-1 flex flex-wrap gap-1">
										{#each serviceOps as op}
											<button
												type="button"
												class="cursor-pointer rounded px-2 py-0.5 text-xs font-medium"
												style="background-color: color-mix(in srgb, var(--theme-green) 20%, transparent); color: var(--theme-green);"
												onclick={() => goToOperation(op.operationName)}
											>
												{op.operationName} →
											</button>
										{/each}
									</div>
								</div>
							{/if}
							</div>
						</div>
					{/each}
				{:else if $hasDocument}
					<p style="color: var(--theme-subtext);">
						No services defined in this WSDL document.
					</p>
				{:else}
					<p style="color: var(--theme-subtext);">
						Service information will appear here once a WSDL is loaded.
					</p>
				{/if}
			</div>
		{/if}

		{#if $activeTab === 1}
			<div class="space-y-4">
				{#if $hasDocument && $operations.length > 0}
					{#each $operations as operation}
						<div class="rounded-lg border p-5" style="background-color: var(--theme-base); border-color: var(--theme-surface1);">
							<div id="operation-{operation.operationName}">
							<div class="flex items-center gap-2">
								<h6 class="text-lg font-bold" style="color: var(--theme-text);">{operation.operationName}</h6>
								<span class="rounded px-2 py-0.5 text-xs font-medium" style="background-color: color-mix(in srgb, var(--theme-green) 20%, transparent); color: var(--theme-green);">SOAP</span>
							</div>
							{#if operation.documentation}
								<p class="mt-1 text-sm italic" style="color: var(--theme-subtext);">
									{operation.documentation}
								</p>
							{/if}
							<div class="mt-2 space-y-1 text-sm" style="color: var(--theme-subtext);">
								<p>Service: <button type="button" class="cursor-pointer hover:underline" style="color: var(--theme-link);" onclick={() => goToService(operation.serviceName)}><code class="text-xs">{operation.serviceName}</code></button></p>
								<p>Port: <code class="text-xs">{operation.portName}</code></p>
								{#if operation.soapAction}
									<p>SOAP Action: <code class="text-xs">{operation.soapAction}</code></p>
								{/if}
							</div>
							{#if operation.input || operation.output}
								<div class="mt-3 space-y-2">
									{#if operation.input}
										<div class="rounded border p-2" style="border-color: var(--theme-surface1);">
											<span class="text-xs font-medium" style="color: var(--theme-surface2);">Input:</span>
											{#if isKnownMessage(operation.input.message)}
												<button type="button" class="ml-1 cursor-pointer text-xs hover:underline" style="color: var(--theme-link);" onclick={() => goToMessage(operation.input.message)}>{operation.input.message} →</button>
											{:else}
												<code class="ml-1 text-xs" style="color: var(--theme-subtext);">{operation.input.message}</code>
											{/if}
										</div>
									{/if}
									{#if operation.output}
										<div class="rounded border p-2" style="border-color: var(--theme-surface1);">
											<span class="text-xs font-medium" style="color: var(--theme-surface2);">Output:</span>
											{#if isKnownMessage(operation.output.message)}
												<button type="button" class="ml-1 cursor-pointer text-xs hover:underline" style="color: var(--theme-link);" onclick={() => goToMessage(operation.output.message)}>{operation.output.message} →</button>
											{:else}
												<code class="ml-1 text-xs" style="color: var(--theme-subtext);">{operation.output.message}</code>
											{/if}
										</div>
									{/if}
								</div>
							{/if}
							</div>
						</div>
					{/each}
				{:else if $hasDocument}
					<p style="color: var(--theme-subtext);">
						No operations defined in this WSDL document.
					</p>
				{:else}
					<p style="color: var(--theme-subtext);">
						Operations will appear here once a WSDL is loaded.
					</p>
				{/if}
			</div>
		{/if}

		{#if $activeTab === 2}
			<div class="space-y-4">
				{#if $hasDocument && $types.length > 0}
					{#each $types as type}
						{@const kindColor = type.kind === 'complexType' ? 'var(--theme-accent)' : type.kind === 'simpleType' ? 'var(--theme-green)' : 'var(--theme-purple)'}
						<div class="rounded-lg border p-5" style="background-color: var(--theme-base); border-color: var(--theme-surface1);">
							<div id="type-{type.name}">
							<div class="mb-2 flex items-center gap-2">
								<h6 class="text-lg font-bold" style="color: var(--theme-text);">{type.name}</h6>
								<span class="rounded px-2 py-0.5 text-xs font-medium" style="background-color: color-mix(in srgb, {kindColor} 20%, transparent); color: {kindColor};">{type.kind}</span>
							</div>
							{#if type.documentation}
								<p class="mb-2 text-sm italic" style="color: var(--theme-subtext);">
									{type.documentation}
								</p>
							{/if}
							{#if type.base}
								<p class="mb-2 text-sm" style="color: var(--theme-subtext);">
									Extends: {#if isKnownType(stripPrefix(type.base))}<button type="button" class="cursor-pointer hover:underline" style="color: var(--theme-link);" onclick={() => goToType(stripPrefix(type.base))}><code class="text-xs">{type.base}</code> →</button>{:else}<code class="text-xs">{type.base}</code>{/if}
								</p>
							{/if}
							{#if type.restrictions?.enumeration}
								<div class="mb-2">
									<p class="text-sm font-medium" style="color: var(--theme-subtext);">Allowed values:</p>
									<div class="mt-1 flex flex-wrap gap-1">
										{#each type.restrictions.enumeration as value}
											<span class="rounded px-2 py-0.5 text-xs font-medium" style="background-color: color-mix(in srgb, var(--theme-yellow) 20%, transparent); color: var(--theme-yellow);">{value}</span>
										{/each}
									</div>
								</div>
							{/if}
							{#if type.fields.length > 0}
								<ul class="list-inside list-disc space-y-1 text-sm" style="color: var(--theme-subtext);">
									{#each type.fields as field}
										<li>
											<code class="text-xs" style="color: var(--theme-subtext);">{formatFieldPrefix(field)}: </code>{#if isKnownType(stripPrefix(field.type))}<button type="button" class="cursor-pointer text-xs hover:underline" style="color: var(--theme-link);" onclick={() => goToType(stripPrefix(field.type))}>{field.type} →</button>{:else}<code class="text-xs" style="color: var(--theme-subtext);">{field.type}</code>{/if}<code class="text-xs" style="color: var(--theme-subtext);">{formatFieldSuffix(field)}</code>
										</li>
									{/each}
								</ul>
							{/if}
							</div>
						</div>
					{/each}
				{:else if $hasDocument}
					<p style="color: var(--theme-subtext);">
						No types defined in this WSDL document.
					</p>
				{:else}
					<p style="color: var(--theme-subtext);">
						Type definitions will appear here once a WSDL is loaded.
					</p>
				{/if}
			</div>
		{/if}

		{#if $activeTab === 3}
			<div class="space-y-4">
				{#if $hasDocument && $messages.length > 0}
					{#each $messages as message}
						<div class="rounded-lg border p-5" style="background-color: var(--theme-base); border-color: var(--theme-surface1);">
							<div id="message-{message.name}">
							<h6 class="mb-2 text-lg font-bold" style="color: var(--theme-text);">{message.name}</h6>
							{#if message.documentation}
								<p class="mb-2 text-sm italic" style="color: var(--theme-subtext);">
									{message.documentation}
								</p>
							{/if}
							{#if message.parts.length > 0}
								<ul class="list-inside list-disc space-y-1 text-sm" style="color: var(--theme-subtext);">
									{#each message.parts as part}
										<li>
											<code class="text-xs" style="color: var(--theme-subtext);">
												{part.name}: 
											</code>
											{#if part.element}
												{#if isKnownType(stripPrefix(part.element))}
													<button type="button" class="cursor-pointer text-xs hover:underline" style="color: var(--theme-link);" onclick={() => goToType(stripPrefix(part.element))}>{part.element} →</button>
												{:else}
													<code class="text-xs" style="color: var(--theme-subtext);">{part.element}</code>
												{/if}
												<span class="ml-1 rounded px-2 py-0.5 text-xs font-medium" style="background-color: color-mix(in srgb, var(--theme-purple) 20%, transparent); color: var(--theme-purple);">element</span>
											{:else if part.type}
												{#if isKnownType(stripPrefix(part.type))}
													<button type="button" class="cursor-pointer text-xs hover:underline" style="color: var(--theme-link);" onclick={() => goToType(stripPrefix(part.type))}>{part.type} →</button>
												{:else}
													<code class="text-xs" style="color: var(--theme-subtext);">{part.type}</code>
												{/if}
											{:else}
												<code class="text-xs" style="color: var(--theme-subtext);">any</code>
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm" style="color: var(--theme-subtext);">No parts defined</p>
							{/if}
							</div>
						</div>
					{/each}
				{:else if $hasDocument}
					<p style="color: var(--theme-subtext);">
						No messages defined in this WSDL document.
					</p>
				{:else}
					<p style="color: var(--theme-subtext);">
						Message definitions will appear here once a WSDL is loaded.
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
