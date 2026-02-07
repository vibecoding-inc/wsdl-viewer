<script lang="ts">
	import { Button, Spinner } from 'flowbite-svelte';
	import { wsdlStore, isLoading, errors as storeErrors } from '$lib/stores/wsdl-store';

	let wsdlFile: FileList | undefined;
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
		wsdlFile = undefined;
		wsdlUrl = '';
		wsdlText = '';
		parseSuccess = false;
		parseError = '';
		wsdlStore.clear();
	}
</script>

<div class="w-full rounded-lg border p-6" style="background-color: var(--theme-surface0); border-color: var(--theme-surface1);">
	<div class="mb-4 flex items-center justify-between">
		<h5 class="text-xl font-bold" style="color: var(--theme-text);">Load WSDL Document</h5>
		{#if parseSuccess}
			<button
				type="button"
				class="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium"
				style="border-color: var(--theme-surface1); color: var(--theme-text); background-color: var(--theme-base);"
				onclick={handleClear}
			>Clear</button>
		{/if}
	</div>

	<!-- Status Messages -->
	{#if $isLoading}
		<div class="mb-4 flex items-center gap-2" style="color: var(--theme-accent);">
			<Spinner size="4" />
			<span>Parsing WSDL...</span>
		</div>
	{/if}

	{#if parseError}
		<div class="mb-4 rounded-lg p-4" style="background-color: color-mix(in srgb, var(--theme-red) 15%, var(--theme-base)); color: var(--theme-red); border: 1px solid color-mix(in srgb, var(--theme-red) 30%, var(--theme-base));">
			<span class="font-medium">Parse Error</span>
			<p class="mt-1 whitespace-pre-wrap text-sm">{parseError}</p>
		</div>
	{/if}

	{#if parseSuccess}
		<div class="mb-4 rounded-lg p-4" style="background-color: color-mix(in srgb, var(--theme-green) 15%, var(--theme-base)); color: var(--theme-green); border: 1px solid color-mix(in srgb, var(--theme-green) 30%, var(--theme-base));">
			<span class="font-medium">WSDL parsed successfully!</span>
			<p class="text-sm">View the parsed content in the tabs below.</p>
		</div>
	{/if}

	<div class="space-y-6">
		<!-- File Upload Section -->
		<div>
			<label for="file" class="mb-2 block text-sm font-medium" style="color: var(--theme-subtext);">Upload WSDL File</label>
			<input
				type="file"
				id="file"
				accept=".wsdl,.xml"
				disabled={$isLoading}
				onchange={(e) => { wsdlFile = (e.target as HTMLInputElement).files ?? undefined; handleFileUpload(); }}
				class="block w-full cursor-pointer rounded-lg border text-sm disabled:opacity-50"
				style="background-color: var(--theme-base); border-color: var(--theme-surface1); color: var(--theme-text);"
			/>
		</div>

		<!-- URL Input Section -->
		<div>
			<label for="url" class="mb-2 block text-sm font-medium" style="color: var(--theme-subtext);">Or Load from URL</label>
			<div class="flex gap-2">
				<input
					type="url"
					id="url"
					bind:value={wsdlUrl}
					placeholder="https://example.com/service.wsdl"
					disabled={$isLoading}
					class="block w-full rounded-lg border p-2.5 text-sm disabled:opacity-50"
					style="background-color: var(--theme-base); border-color: var(--theme-surface1); color: var(--theme-text);"
				/>
				<button
					type="button"
					class="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50"
					style="background-color: var(--theme-accent); color: var(--theme-btn-text);"
					onclick={handleLoadFromUrl}
					disabled={$isLoading}
				>Load</button>
			</div>
		</div>

		<!-- Text Input Section -->
		<div>
			<label for="text" class="mb-2 block text-sm font-medium" style="color: var(--theme-subtext);">Or Paste WSDL Content</label>
			<textarea
				id="text"
				bind:value={wsdlText}
				rows={6}
				placeholder="Paste your WSDL XML content here..."
				disabled={$isLoading}
				class="block w-full rounded-lg border p-2.5 text-sm disabled:opacity-50"
				style="background-color: var(--theme-base); border-color: var(--theme-surface1); color: var(--theme-text);"
			></textarea>
			<button
				type="button"
				class="mt-2 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50"
				style="background-color: var(--theme-accent); color: var(--theme-btn-text);"
				onclick={handleParseText}
				disabled={$isLoading}
			>Parse</button>
		</div>
	</div>
</div>
