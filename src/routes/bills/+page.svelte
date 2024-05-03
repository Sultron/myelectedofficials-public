<script lang="ts">
	import USA from '$lib/components/USA.svelte';

	function onSelectedState(state: string) {
		console.log(state);
	}
</script>

<svelte:head>
	<title>Bills | Get Involved in Democracy</title>
	<meta name="description" content="View bills that are currently in the United States Congress." />
</svelte:head>
<div class="container mx-auto max-w-7xl py-5 sm:px-6 lg:px-8">
	<h1 class="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
		Find Bills in Your State Legislature
	</h1>
	<p
		class="mx-auto text-center text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
	>
		Check the status and details of bills in your state legislature.
	</p>

	<div class="py-10">
		<h2 class="text-center text-2xl text-gray-700">Select your state to get started:</h2>

		<div class="flex justify-center">
			<USA {onSelectedState} />
		</div>
	</div>
</div>
