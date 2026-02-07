<script lang="ts">
	import { Card, Button, Fileupload, Label, Textarea } from 'flowbite-svelte';

	let wsdlFile: FileList;
	let wsdlUrl = '';
	let wsdlText = '';

	function handleFileUpload() {
		if (wsdlFile && wsdlFile[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				wsdlText = e.target?.result as string;
				// TODO: Parse WSDL content (implementation for later)
				console.log('WSDL file loaded:', wsdlText.substring(0, 100));
			};
			reader.readAsText(wsdlFile[0]);
		}
	}

	function handleLoadFromUrl() {
		// TODO: Load WSDL from URL (implementation for later)
		console.log('Load from URL:', wsdlUrl);
	}

	function handleParseText() {
		// TODO: Parse WSDL text (implementation for later)
		console.log('Parse WSDL text:', wsdlText.substring(0, 100));
	}
</script>

<Card class="max-w-full">
	<h5 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Load WSDL Document</h5>

	<div class="space-y-6">
		<!-- File Upload Section -->
		<div>
			<Label for="file" class="mb-2">Upload WSDL File</Label>
			<Fileupload
				id="file"
				bind:files={wsdlFile}
				on:change={handleFileUpload}
				accept=".wsdl,.xml"
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
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				/>
				<Button on:click={handleLoadFromUrl}>Load</Button>
			</div>
		</div>

		<!-- Text Input Section -->
		<div>
			<Label for="text" class="mb-2">Or Paste WSDL Content</Label>
			<Textarea
				id="text"
				bind:value={wsdlText}
				rows="6"
				placeholder="Paste your WSDL XML content here..."
			/>
			<Button on:click={handleParseText} class="mt-2">Parse</Button>
		</div>
	</div>
</Card>
