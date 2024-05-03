<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { PageData } from './$types';
	import 'iconify-icon';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	function getFilteredData(data: PageData, jurisdiction: string) {
		if (jurisdiction === 'federal') {
			return data.officials.offices.filter((office) => office.levels.includes('country'));
		}

		if (jurisdiction === 'state') {
			return data.officials.offices.filter((office) =>
				office.levels.includes('administrativeArea1')
			);
		}

		if (jurisdiction === 'local') {
			return data.officials.offices.filter((office) =>
				office.levels.includes('administrativeArea2')
			);
		}

		return data.officials.offices;
	}
	let jurisdiction = 'all';
	const jurisdictionButtons = ['all', 'federal', 'state', 'local'];
</script>

<svelte:head>
	<title>Your Elected Officials | Get Involved in Democracy</title>
	<meta name="description" content="Find your elected officials based on your ZIP code." />
</svelte:head>

<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
	<div class="py-2">
		<h1 class="text-center text-3xl font-semibold text-gray-700">Your Elected Officials</h1>
		<p class="text-center text-gray-600">
			Here are your elected officials based on the zip code you entered.
		</p>
	</div>
	<div class="px-10 py-4">
		<div class="flex h-12 flex-row justify-evenly gap-4">
			{#each jurisdictionButtons as button}
				<button
					class="w-1/4 rounded bg-neutral-400 font-semibold uppercase text-white hover:bg-neutral-700"
					class:bg-neutral-700={jurisdiction === button}
					on:click={() => (jurisdiction = button)}
				>
					{button}
				</button>
			{/each}
		</div>
	</div>

	<div
		class="grid grid-cols-1 content-center justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3"
	>
		{#each getFilteredData(data, jurisdiction) as office}
			{#each office.officialIndices as index (index)}
				<div animate:flip in:fade out:fade class="h-full w-full">
					<Card {office} official={data.officials.officials[index]} />
				</div>
			{/each}
		{/each}
	</div>
</div>
