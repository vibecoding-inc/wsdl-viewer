<script lang="ts">
	import { Modal, Button, Fileupload, Label, Textarea, Alert, Spinner } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { wsdlStore, isLoading } from '$lib/stores/wsdl-store';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	let wsdlFile: FileList | undefined = $state();
	let wsdlUrl = $state('');
	let wsdlText = $state('');
	let parseError = $state('');

	async function handleFileUpload() {
		if (wsdlFile && wsdlFile[0]) {
			parseError = '';
			
			const result = await wsdlStore.loadFromFile(wsdlFile[0]);
			
			if (result.success && result.document) {
				open = false;
				resetForm();
			} else {
				parseError = result.errors.join('\n');
			}
		}
	}

	async function handleLoadFromUrl() {
		if (!wsdlUrl.trim()) {
			parseError = 'Please enter a URL';
			return;
		}
		
		parseError = '';
		
		const result = await wsdlStore.loadFromUrl(wsdlUrl);
		
		if (result.success && result.document) {
			open = false;
			resetForm();
		} else {
			parseError = result.errors.join('\n');
		}
	}

	function handleParseText() {
		if (!wsdlText.trim()) {
			parseError = 'Please enter WSDL content';
			return;
		}
		
		parseError = '';
		
		const result = wsdlStore.parseXml(wsdlText);
		
		if (result.success) {
			open = false;
			resetForm();
		} else {
			parseError = result.errors.join('\n');
		}
	}

	function resetForm() {
		wsdlFile = undefined;
		wsdlUrl = '';
		wsdlText = '';
		parseError = '';
	}
</script>

<Modal title="Load WSDL Document" bind:open size="lg" dismissable={false} class="z-50">
	<!-- Status Messages -->
	{#if $isLoading}
		<div class="mb-4 flex items-center gap-2 text-blue-600">
			<Spinner size="4" />
			<span>Parsing WSDL...</span>
		</div>
	{/if}

	{#if parseError}
		<Alert color="red" class="mb-4">
			{#snippet icon()}
				<ExclamationCircleSolid class="h-5 w-5" />
			{/snippet}
			<span class="font-medium">Parse Error</span>
			<p class="mt-1 whitespace-pre-wrap text-sm">{parseError}</p>
		</Alert>
	{/if}

	<div class="space-y-6">
		<!-- File Upload Section -->
		<div>
			<Label for="file" class="mb-2">Upload WSDL File</Label>
			<Fileupload
				id="file"
				bind:files={wsdlFile}
				onchange={handleFileUpload}
				accept=".wsdl,.xml"
				disabled={$isLoading}
				class="p-1!"
			/>
		</div>

		<!-- URL Input Section -->
		<div>
			<Label for="url" class="mb-2">Or Load from URL</Label>
			<div class="flex gap-2">
				<input
					type="url"
					id="url"
					bind:value={wsdlUrl}
					placeholder="https://example.com/service.wsdl"
					disabled={$isLoading}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				/>
				<Button onclick={handleLoadFromUrl} disabled={$isLoading}>Load</Button>
			</div>
		</div>

		<!-- Text Input Section -->
		<div>
			<Label for="text" class="mb-2">Or Paste WSDL Content</Label>
			<Textarea
				id="text"
				bind:value={wsdlText}
				rows={6}
				placeholder="Paste your WSDL XML content here..."
				disabled={$isLoading}
				class="w-full"
			/>
			<Button onclick={handleParseText} class="mt-2" disabled={$isLoading}>Parse</Button>
		</div>
	</div>
</Modal>
