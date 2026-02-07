<script lang="ts">
	import { Card, Tabs, TabItem, Badge, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	// Placeholder data - will be populated by the parser later
	let hasWsdlLoaded = false;
	let services = [
		{
			name: 'ExampleService',
			endpoint: 'http://example.com/service',
			operations: ['getUser', 'createUser', 'deleteUser']
		}
	];

	let types = [
		{ name: 'User', fields: ['id: string', 'name: string', 'email: string'] },
		{ name: 'Response', fields: ['status: string', 'message: string'] }
	];

	let messages = [
		{ name: 'GetUserRequest', parts: ['userId: string'] },
		{ name: 'GetUserResponse', parts: ['user: User'] }
	];
</script>

<div class="w-full">
	{#if !hasWsdlLoaded}
		<Alert color="blue" class="mb-4">
			<InfoCircleSolid slot="icon" class="h-5 w-5" />
			<span class="font-medium">No WSDL loaded</span>
			Please upload a WSDL file or paste WSDL content to view details.
		</Alert>
	{/if}

	<Card class="max-w-full">
		<h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			WSDL Document Viewer
		</h5>

		<Tabs>
			<TabItem open title="Services">
				<div class="space-y-4">
					{#if hasWsdlLoaded}
						{#each services as service}
							<Card>
								<h6 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
									{service.name}
								</h6>
								<p class="mb-3 text-sm text-gray-700 dark:text-gray-400">
									Endpoint: <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700"
										>{service.endpoint}</code
									>
								</p>
								<div>
									<h6 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
										Operations:
									</h6>
									<div class="flex flex-wrap gap-2">
										{#each service.operations as operation}
											<Badge color="blue">{operation}</Badge>
										{/each}
									</div>
								</div>
							</Card>
						{/each}
					{:else}
						<p class="text-gray-500 dark:text-gray-400">
							Service information will appear here once a WSDL is loaded.
						</p>
					{/if}
				</div>
			</TabItem>

			<TabItem title="Operations">
				<div class="space-y-4">
					{#if hasWsdlLoaded}
						{#each services as service}
							{#each service.operations as operation}
								<Card>
									<h6 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">{operation}</h6>
									<p class="text-sm text-gray-700 dark:text-gray-400">
										Service: {service.name}
									</p>
									<div class="mt-2">
										<Badge color="green">SOAP</Badge>
									</div>
								</Card>
							{/each}
						{/each}
					{:else}
						<p class="text-gray-500 dark:text-gray-400">
							Operations will appear here once a WSDL is loaded.
						</p>
					{/if}
				</div>
			</TabItem>

			<TabItem title="Types">
				<div class="space-y-4">
					{#if hasWsdlLoaded}
						{#each types as type}
							<Card>
								<h6 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">{type.name}</h6>
								<ul class="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400">
									{#each type.fields as field}
										<li><code class="text-xs">{field}</code></li>
									{/each}
								</ul>
							</Card>
						{/each}
					{:else}
						<p class="text-gray-500 dark:text-gray-400">
							Type definitions will appear here once a WSDL is loaded.
						</p>
					{/if}
				</div>
			</TabItem>

			<TabItem title="Messages">
				<div class="space-y-4">
					{#if hasWsdlLoaded}
						{#each messages as message}
							<Card>
								<h6 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">{message.name}</h6>
								<ul class="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400">
									{#each message.parts as part}
										<li><code class="text-xs">{part}</code></li>
									{/each}
								</ul>
							</Card>
						{/each}
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
