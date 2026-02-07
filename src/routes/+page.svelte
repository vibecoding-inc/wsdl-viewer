<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import WsdlSidebar from '$lib/components/WsdlSidebar.svelte';
	import WsdlViewer from '$lib/components/WsdlViewer.svelte';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<Header />

	<div class="flex">
		<!-- Sidebar -->
		<aside class="hidden w-64 flex-shrink-0 lg:block">
			<WsdlSidebar />
		</aside>

		<!-- Main Content -->
		<main class="flex-1 p-4">
			<div class="mx-auto max-w-7xl space-y-6">
				<!-- File Upload Section -->
				<FileUpload />

				<!-- WSDL Viewer Section -->
				<WsdlViewer />
			</div>
		</main>
	</div>
</div>

