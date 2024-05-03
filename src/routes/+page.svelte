<script lang="ts">
	import type { AddressDetails } from '$lib/types';
	import { fetchPlus } from '$lib/utils';
	import 'iconify-icon';
	//import { ZipCodeSchema } from '$lib/zodSchemas';

	let zipCode: string[] = Array.from({ length: 5 });
	let ref: HTMLInputElement[] = [];

	let formErrorMessage = '';

	let isLoading = false;

	function handleInput(e: Event, i: number) {
		if (e.target instanceof HTMLInputElement) {
			if (e.target.value.length === 1) {
				if (i < 5) {
					ref[i].focus();
				}
			}
		}
		if (/^\d{5}$/g.test(zipCode.join(''))) {
			fetchAddress();
		}
	}

	function validateZipCode() {
		formErrorMessage = /^\d{5}$/g.test(zipCode.join('')) ? '' : 'Please enter a valid ZIP code.';
		return /^\d{5}$/g.test(zipCode.join('')) && !isLoading;
	}

	//export let data: PageData;
	let addressDetails: AddressDetails;
	const fetchAddress = async () => {
		isLoading = true;
		// const response = await fetch(`/api/zipcode`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ zip: zipCode.join('') })
		// });
		const response = await fetchPlus(
			'/api/zipcode',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ zip: zipCode.join('') })
			},
			3
		);
		addressDetails = await response.json();
		//console.log(addressDetails);
		isLoading = false;
	};
</script>

<svelte:head>
	<title>Find Your Elected Officials - USA | Get Involved in Democracy</title>
	<meta
		name="description"
		content="Find your elected officials in the USA by entering your ZIP code."
	/>
</svelte:head>
<div class="container mx-auto max-w-7xl py-5 sm:px-6 lg:px-8">
	<h1 class="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
		Find Your Elected Officials
	</h1>
	<p
		class="mx-auto text-center text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
	>
		See who represents you in government and get involved in democracy.
	</p>
	<section class="py-14">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="text-2xl text-gray-700">Enter your ZIP Code</h1>
			<div class="flex gap-1.5">
				{#each zipCode as _, i}
					<input
						type="text"
						minlength="1"
						maxlength="1"
						class="h-20 w-20 rounded border-2 border-gray-300 p-1 text-center text-3xl font-medium focus:ring-2"
						bind:value={zipCode[i]}
						bind:this={ref[i]}
						on:input={(e) => handleInput(e, i + 1)}
						on:keydown={(e) => {
							if (!zipCode[i] && e.key === 'Backspace' && i > 0) {
								ref[i - 1].focus();
							}
						}}
					/>
				{/each}
			</div>

			<div class="h-5">
				{#if addressDetails && addressDetails.defaultCity && addressDetails.defaultState}
					<div class="flex">
						<p class="text-gray-700">
							Search for officials in <span class="font-medium">{addressDetails.defaultCity}</span>,
							<span class="font-medium">{addressDetails.defaultState}</span>
						</p>
					</div>
				{/if}
				{#if formErrorMessage}
					<p class="text-red-500">{formErrorMessage}</p>
				{/if}
			</div>

			<a
				class="flex w-full max-w-[250px] cursor-pointer items-center justify-center gap-2 rounded bg-neutral-600 p-2 text-white hover:bg-neutral-700"
				href="/officials/{zipCode.join(
					''
				)}?state={addressDetails?.defaultState}&city={addressDetails?.defaultCity}"
				on:click={validateZipCode}
			>
				{#if isLoading}<iconify-icon icon="eos-icons:loading" class="text-2xl"
					></iconify-icon>{/if}Submit</a
			>

			<p class="text-sm text-gray-600">
				⚡ Powered by <a href="https://www.googleapis.com/civicinfo/v2/representatives"
					>Google Civic Information API</a
				>
			</p>
			<p class="text-sm text-gray-600">
				🚀 Supercharged by <iconify-icon icon="logos:google-gemini" class="text-lg"></iconify-icon>
			</p>
		</div>
	</section>
	<!-- Information Section -->
	<section class="w-full py-2">
		<div class="container space-y-12 px-4 md:px-6">
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<h2 class="text-3xl font-bold tracking-tighter">Empowerment through Civic Engagement</h2>
					<p
						class="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						Take charge of your community's future by understanding the roles and responsibilities
						of your elected officials. Engage in meaningful dialogue, advocate for change, and
						ensure your voice is heard in the decision-making process.
					</p>
				</div>
			</div>
			<div
				class="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3"
			>
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Transparency and Accountability</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Ensure elected officials are transparent and accountable by tracking their performance
						and voting records to align with your values and priorities.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Informed Decision-Making</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Stay informed about key community and national issues to make educated decisions at the
						ballot box and shape impactful policies.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-bold">Building Stronger Communities</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Promote unity and collaboration in your community by engaging with elected officials to
						address challenges and create a better future for all residents.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
