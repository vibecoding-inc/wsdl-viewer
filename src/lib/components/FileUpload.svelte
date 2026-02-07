<script lang="ts">
	import { Card, Button, Fileupload, Label, Textarea, Alert, Spinner } from 'flowbite-svelte';
	import { ExclamationCircleSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import { wsdlStore, isLoading, errors as storeErrors } from '$lib/stores/wsdl-store';

	let wsdlFile: FileList;
	let wsdlUrl = '';
	let wsdlText = '';
	let parseSuccess = false;
	let parseError = '';

	async function handleFileUpload() {
		if (wsdlFile && wsdlFile[0]) {
			parseSuccess = false;
			parseError = '';
			
			const result = await wsdlStore.loadFromFile(wsdlFile[0]);
			
			if (result.success && result.document) {
				wsdlText = result.document.rawXml;
				parseSuccess = true;
				parseError = '';
			} else {
				parseError = result.errors.join('\n');
				parseSuccess = false;
			}
		}
	}

	async function handleLoadFromUrl() {
		if (!wsdlUrl.trim()) {
			parseError = 'Please enter a URL';
			return;
		}
		
		parseSuccess = false;
		parseError = '';
		
		const result = await wsdlStore.loadFromUrl(wsdlUrl);
		
		if (result.success && result.document) {
			wsdlText = result.document.rawXml;
			parseSuccess = true;
			parseError = '';
		} else {
			parseError = result.errors.join('\n');
			parseSuccess = false;
		}
	}

	function handleParseText() {
		if (!wsdlText.trim()) {
			parseError = 'Please enter WSDL content';
			return;
		}
		
		parseSuccess = false;
		parseError = '';
		
		const result = wsdlStore.parseXml(wsdlText);
		
		if (result.success) {
			parseSuccess = true;
			parseError = '';
		} else {
			parseError = result.errors.join('\n');
			parseSuccess = false;
		}
	}
	
	function handleClear() {
		wsdlFile = undefined as unknown as FileList;
		wsdlUrl = '';
		wsdlText = '';
		parseSuccess = false;
		parseError = '';
		wsdlStore.clear();
	}
</script>

<Card class="max-w-full">
	<div class="mb-4 flex items-center justify-between">
		<h5 class="text-xl font-bold text-gray-900 dark:text-white">Load WSDL Document</h5>
		{#if parseSuccess}
			<Button color="alternative" size="sm" onclick={handleClear}>Clear</Button>
		{/if}
	</div>

	<!-- Status Messages -->
	{#if $isLoading}
		<div class="mb-4 flex items-center gap-2 text-blue-600">
			<Spinner size="4" />
			<span>Parsing WSDL...</span>
		</div>
	{/if}

	{#if parseError}
		<Alert color="red" class="mb-4">
			<ExclamationCircleSolid slot="icon" class="h-5 w-5" />
			<span class="font-medium">Parse Error</span>
			<p class="mt-1 whitespace-pre-wrap text-sm">{parseError}</p>
		</Alert>
	{/if}

	{#if parseSuccess}
		<Alert color="green" class="mb-4">
			<CheckCircleSolid slot="icon" class="h-5 w-5" />
			<span class="font-medium">WSDL parsed successfully!</span>
			<p class="text-sm">View the parsed content in the tabs below.</p>
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
			/>
			<Button onclick={handleParseText} class="mt-2" disabled={$isLoading}>Parse</Button>
		</div>
	</div>
</Card>
