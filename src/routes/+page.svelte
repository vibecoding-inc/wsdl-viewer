<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import WsdlViewer from '$lib/components/WsdlViewer.svelte';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<Header />

	<main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="space-y-6">
			<!-- File Upload Section -->
			<FileUpload />

			<!-- WSDL Viewer Section -->
			<WsdlViewer />
		</div>
	</main>
</div>
